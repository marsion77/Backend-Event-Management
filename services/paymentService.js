import crypto from "crypto";
import getRazorpayInstance from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import bookingService from "./bookingService.js";
import emailService from "./emailService.js";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

/**
 * Create a Razorpay order for a booking.
 */
const createOrder = async (userId, bookingId) => {
  const booking = await Booking.findOne({ _id: bookingId, userId });
  if (!booking) { const e = new Error("Booking not found."); e.statusCode = 404; throw e; }
  if (booking.bookingStatus === "confirmed") { const e = new Error("Booking already paid."); e.statusCode = 400; throw e; }
  if (booking.bookingStatus === "cancelled") { const e = new Error("Booking is cancelled."); e.statusCode = 400; throw e; }

  const options = {
    amount: booking.totalAmount * 100, // Razorpay expects paise
    currency: "INR",
    receipt: `receipt_${bookingId}`,
  };

  const order = await getRazorpayInstance().orders.create(options);

  const payment = await Payment.create({
    userId,
    bookingId,
    razorpayOrderId: order.id,
    amount: booking.totalAmount,
    currency: "INR",
    status: "created",
  });

  return { order, paymentId: payment._id };
};

/**
 * Verify Razorpay payment signature and confirm booking.
 */
const verifyPayment = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) { const e = new Error("Payment record not found."); e.statusCode = 404; throw e; }

  // Verify signature
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    payment.status = "failed";
    await payment.save();
    const e = new Error("Payment verification failed. Invalid signature.");
    e.statusCode = 400;
    throw e;
  }

  // Update payment
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = "success";
  await payment.save();

  // Confirm booking
  const booking = await bookingService.confirmBooking(payment.bookingId, payment._id);

  // Send confirmation email
  try {
    const user = await User.findById(payment.userId);
    const event = await Event.findById(booking.eventId);
    if (user && event) {
      await emailService.sendBookingConfirmation(user.email, user.name, {
        eventTitle: event.title,
        numberOfTickets: booking.numberOfTickets,
        totalAmount: booking.totalAmount,
        eventDate: event.eventDate,
        location: event.location,
      });
    }
  } catch (emailErr) {
    console.warn("⚠️  Booking confirmation email failed:", emailErr.message);
  }

  return { message: "Payment verified and booking confirmed.", payment, booking };
};

/**
 * Get payment details by booking ID.
 */
const getPaymentByBookingId = async (bookingId) => {
  const payment = await Payment.findOne({ bookingId });
  if (!payment) { const e = new Error("Payment not found."); e.statusCode = 404; throw e; }
  return payment;
};

export default { createOrder, verifyPayment, getPaymentByBookingId };
