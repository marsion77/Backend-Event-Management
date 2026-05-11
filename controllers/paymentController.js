import paymentService from "../services/paymentService.js";

/** POST /api/payments/create-order — Create Razorpay order (User). */
export const createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const result = await paymentService.createOrder(req.user._id, bookingId);
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
};

/** POST /api/payments/verify — Verify Razorpay payment. */
export const verifyPayment = async (req, res, next) => {
  try {
    const result = await paymentService.verifyPayment(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
};

/** GET /api/payments/booking/:bookingId — Get payment by booking. */
export const getPaymentByBookingId = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentByBookingId(req.params.bookingId);
    res.status(200).json({ success: true, data: payment });
  } catch (err) { next(err); }
};
