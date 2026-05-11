import { Router } from "express";
import { createOrder, verifyPayment, getPaymentByBookingId } from "../controllers/paymentController.js";
import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/role.js";

const router = Router();

// POST /api/payments/create-order — Create Razorpay order
router.post("/create-order", authenticate, authorize("user"), createOrder);

// POST /api/payments/verify — Verify Razorpay payment
router.post("/verify", authenticate, authorize("user"), verifyPayment);

// GET  /api/payments/booking/:bookingId — Get payment by booking
router.get("/booking/:bookingId", authenticate, getPaymentByBookingId);

export default router;
