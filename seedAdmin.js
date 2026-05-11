import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

/**
 * Seed admin user into the database.
 * Admin is NOT created via signup — this script inserts it directly.
 *
 * Usage: npm run seed   OR   node seedAdmin.js
 */
const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists. Skipping seed.");
    } else {
      await User.create({
        name: process.env.ADMIN_NAME || "Super Admin",
        email: process.env.ADMIN_EMAIL || "admin@eventsphere.com",
        password: process.env.ADMIN_PASSWORD || "Admin@123",
        phone: process.env.ADMIN_PHONE || "9999999999",
        role: "admin",
        isVerified: true,
      });
      console.log("✅ Admin user seeded successfully!");
      console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD}`);
    }

    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
