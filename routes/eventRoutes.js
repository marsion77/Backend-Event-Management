import { Router } from "express";
import {
  createEvent, getOrganizerEvents, getApprovedEvents, getAllEvents,
  getEventById, updateEvent, deleteEvent, approveEvent, rejectEvent,
} from "../controllers/eventController.js";
import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/role.js";
import upload from "../config/multer.js";

const router = Router();

// Public — approved events
router.get("/approved", getApprovedEvents);

// Public — single event detail
router.get("/:id", getEventById);

// Organizer routes
router.post("/", authenticate, authorize("organizer"), upload.single("image"), createEvent);
router.get("/organizer/my-events", authenticate, authorize("organizer"), getOrganizerEvents);
router.put("/:id", authenticate, authorize("organizer"), upload.single("image"), updateEvent);
router.delete("/:id", authenticate, authorize("organizer"), deleteEvent);

// Admin routes
router.get("/admin/all", authenticate, authorize("admin"), getAllEvents);
router.patch("/:id/approve", authenticate, authorize("admin"), approveEvent);
router.patch("/:id/reject", authenticate, authorize("admin"), rejectEvent);

export default router;
