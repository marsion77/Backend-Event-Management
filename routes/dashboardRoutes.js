import { Router } from "express";
import {
  getAdminDashboard, getAllUsers,
  getOrganizerDashboard, getUserDashboard,
} from "../controllers/dashboardController.js";
import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/role.js";

const router = Router();

// Admin dashboard
router.get("/admin", authenticate, authorize("admin"), getAdminDashboard);
router.get("/admin/users", authenticate, authorize("admin"), getAllUsers);

// Organizer dashboard
router.get("/organizer", authenticate, authorize("organizer"), getOrganizerDashboard);

// User dashboard
router.get("/user", authenticate, authorize("user"), getUserDashboard);

export default router;
