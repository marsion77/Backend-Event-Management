import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Event from "./models/Event.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Create a User
    const hashedPassword = await bcrypt.hash("User@123", 10);
    let user = await User.findOne({ email: "user@example.com" });
    if (!user) {
      user = await User.create({
        name: "Test User",
        email: "user@example.com",
        password: hashedPassword,
        phone: "1234567890",
        role: "user",
      });
      console.log("User seeded:", user.email);
    }

    // Create an Organizer
    let organizer = await User.findOne({ email: "org@example.com" });
    if (!organizer) {
      organizer = await User.create({
        name: "Test Organizer",
        email: "org@example.com",
        password: hashedPassword,
        phone: "0987654321",
        role: "organizer",
      });
      console.log("Organizer seeded:", organizer.email);
    }

    // Create an Event
    let event = await Event.findOne({ title: "Test Razorpay Event" });
    if (!event) {
      event = await Event.create({
        title: "Test Razorpay Event",
        description: "An event to test Razorpay integration.",
        organizerId: organizer._id,
        location: "Virtual",
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        totalSeats: 100,
        availableSeats: 100,
        price: 500, // INR 500
        status: "approved",
      });
      console.log("Event seeded:", event.title);
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
