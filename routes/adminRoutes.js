import { Router } from "express";
import { createOrganizer, getOrganizers, getOrganizerById, deleteOrganizer } from "../controllers/adminController.js";
import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/role.js";

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize("admin"));

// POST   /api/admin/organizer      — Create organizer
router.post("/organizer", createOrganizer);

// GET    /api/admin/organizers      — List all organizers
router.get("/organizers", getOrganizers);

// GET    /api/admin/organizer/:id   — Get single organizer
router.get("/organizer/:id", getOrganizerById);

// DELETE /api/admin/organizer/:id   — Delete organizer
router.delete("/organizer/:id", deleteOrganizer);

export default router;
