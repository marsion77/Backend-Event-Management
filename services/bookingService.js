import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

const createBooking = async (userId, { eventId, numberOfTickets }) => {
  const event = await Event.findById(eventId);
  if (!event) { const e = new Error("Event not found."); e.statusCode = 404; throw e; }
  if (event.status !== "approved") { const e = new Error("Only approved events can be booked."); e.statusCode = 400; throw e; }
  if (event.eventDate < new Date()) { const e = new Error("Cannot book past events."); e.statusCode = 400; throw e; }
  if (numberOfTickets > event.availableSeats) {
    const e = new Error(`Only ${event.availableSeats} seat(s) remaining.`); e.statusCode = 400; throw e;
  }

  const updatedEvent = await Event.findOneAndUpdate(
    { _id: eventId, availableSeats: { $gte: numberOfTickets } },
    { $inc: { availableSeats: -numberOfTickets } },
    { new: true }
  );
  if (!updatedEvent) { const e = new Error("Seats no longer available."); e.statusCode = 409; throw e; }

  const totalAmount = numberOfTickets * event.price;
  const booking = await Booking.create({ userId, eventId, numberOfTickets, totalAmount, bookingStatus: "pending" });
  return booking;
};

const getBookingById = async (bookingId) => {
  const booking = await Booking.findById(bookingId)
    .populate("eventId", "title eventDate location price image")
    .populate("userId", "name email phone")
    .populate("paymentId");
  if (!booking) { const e = new Error("Booking not found."); e.statusCode = 404; throw e; }
  return booking;
};

const getUserBookings = async (userId) => {
  return Booking.find({ userId })
    .populate("eventId", "title eventDate location price image status")
    .populate("paymentId")
    .sort({ createdAt: -1 });
};

const getOrganizerBookings = async (organizerId) => {
  const events = await Event.find({ organizerId }).select("_id");
  const eventIds = events.map((e) => e._id);
  return Booking.find({ eventId: { $in: eventIds } })
    .populate("eventId", "title eventDate location price")
    .populate("userId", "name email phone")
    .sort({ createdAt: -1 });
};

const cancelBooking = async (bookingId, userId) => {
  const booking = await Booking.findOne({ _id: bookingId, userId });
  if (!booking) { const e = new Error("Booking not found."); e.statusCode = 404; throw e; }
  if (booking.bookingStatus === "cancelled") { const e = new Error("Already cancelled."); e.statusCode = 400; throw e; }

  await Event.findByIdAndUpdate(booking.eventId, { $inc: { availableSeats: booking.numberOfTickets } });
  booking.bookingStatus = "cancelled";
  await booking.save();
  return { message: "Booking cancelled successfully.", booking };
};

const confirmBooking = async (bookingId, paymentId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) { const e = new Error("Booking not found."); e.statusCode = 404; throw e; }
  booking.bookingStatus = "confirmed";
  booking.paymentId = paymentId;
  await booking.save();
  return booking;
};

export default { createBooking, getBookingById, getUserBookings, getOrganizerBookings, cancelBooking, confirmBooking };
