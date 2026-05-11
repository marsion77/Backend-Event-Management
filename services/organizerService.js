import User from "../models/User.js";

/**
 * Create a new organizer — Admin only.
 * The organizer is stored in the User collection with role = "organizer" and isVerified = true.
 */
const createOrganizer = async ({ name, email, password, phone }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email is already registered.");
    error.statusCode = 409;
    throw error;
  }

  const organizer = await User.create({
    name,
    email,
    password,
    phone,
    role: "organizer",
    isVerified: true, // Organizers don't need OTP verification
  });

  return {
    id: organizer._id,
    name: organizer.name,
    email: organizer.email,
    phone: organizer.phone,
    role: organizer.role,
    isVerified: organizer.isVerified,
    createdAt: organizer.createdAt,
  };
};

/**
 * Get all organizers.
 */
const getAllOrganizers = async () => {
  const organizers = await User.find({ role: "organizer" }).select("-password");
  return organizers;
};

/**
 * Get a single organizer by ID.
 */
const getOrganizerById = async (id) => {
  const organizer = await User.findOne({ _id: id, role: "organizer" }).select("-password");
  if (!organizer) {
    const error = new Error("Organizer not found.");
    error.statusCode = 404;
    throw error;
  }
  return organizer;
};

/**
 * Delete an organizer by ID.
 */
const deleteOrganizer = async (id) => {
  const organizer = await User.findOneAndDelete({ _id: id, role: "organizer" });
  if (!organizer) {
    const error = new Error("Organizer not found.");
    error.statusCode = 404;
    throw error;
  }
  return { message: "Organizer deleted successfully." };
};

export default { createOrganizer, getAllOrganizers, getOrganizerById, deleteOrganizer };
