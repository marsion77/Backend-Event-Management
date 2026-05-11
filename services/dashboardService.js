import User from "../models/User.js";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

/**
 * Admin Dashboard: overview stats.
 */
const getAdminDashboard = async () => {
  const [totalUsers, totalOrganizers, totalEvents, pendingEvents, approvedEvents, bookings, revenue] =
    await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "organizer" }),
      Event.countDocuments(),
      Event.countDocuments({ status: "pending" }),
      Event.countDocuments({ status: "approved" }),
      Booking.countDocuments(),
      Payment.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

  return {
    totalUsers,
    totalOrganizers,
    totalEvents,
    pendingEvents,
    approvedEvents,
    totalBookings: bookings,
    totalRevenue: revenue[0]?.total || 0,
  };
};

/**
 * Admin: get all users list.
 */
const getAllUsers = async () => {
  return User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
};

/**
 * Organizer Dashboard: their events + booking stats.
 */
const getOrganizerDashboard = async (organizerId) => {
  const events = await Event.find({ organizerId });
  const eventIds = events.map((e) => e._id);

  const [totalBookings, confirmedBookings, revenue] = await Promise.all([
    Booking.countDocuments({ eventId: { $in: eventIds } }),
    Booking.countDocuments({ eventId: { $in: eventIds }, bookingStatus: "confirmed" }),
    Payment.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking",
        },
      },
      { $unwind: "$booking" },
      { $match: { "booking.eventId": { $in: eventIds }, status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    totalEvents: events.length,
    approvedEvents: events.filter((e) => e.status === "approved").length,
    pendingEvents: events.filter((e) => e.status === "pending").length,
    totalBookings,
    confirmedBookings,
    totalRevenue: revenue[0]?.total || 0,
    events,
  };
};

/**
 * User Dashboard: booking history.
 */
const getUserDashboard = async (userId) => {
  const bookings = await Booking.find({ userId })
    .populate("eventId", "title eventDate location price image")
    .populate("paymentId")
    .sort({ createdAt: -1 });

  const totalSpent = bookings
    .filter((b) => b.bookingStatus === "confirmed")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return {
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((b) => b.bookingStatus === "confirmed").length,
    cancelledBookings: bookings.filter((b) => b.bookingStatus === "cancelled").length,
    totalSpent,
    bookings,
  };
};

export default { getAdminDashboard, getAllUsers, getOrganizerDashboard, getUserDashboard };
