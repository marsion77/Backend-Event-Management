import { Router } from "express";
import {
  createBooking, getUserBookings, getOrganizerBookings,
  getBookingById, cancelBooking,
} from "../controllers/bookingController.js";
import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/role.js";

const router = Router();

// User routes
router.post("/", authenticate, authorize("user"), createBooking);
router.get("/", authenticate, authorize("user"), getUserBookings);
router.get("/:id", authenticate, getBookingById);
router.patch("/:id/cancel", authenticate, authorize("user"), cancelBooking);

// Organizer route — view bookings for their events
router.get("/organizer/bookings", authenticate, authorize("organizer"), getOrganizerBookings);

export default router;
