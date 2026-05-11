import bookingService from "../services/bookingService.js";

/** POST /api/bookings — Create booking (User). */
export const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.user._id, req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (err) { next(err); }
};

/** GET /api/bookings — Get user's bookings. */
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user._id);
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) { next(err); }
};

/** GET /api/bookings/organizer — Get organizer's event bookings. */
export const getOrganizerBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getOrganizerBookings(req.user._id);
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) { next(err); }
};

/** GET /api/bookings/:id — Get single booking. */
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    res.status(200).json({ success: true, data: booking });
  } catch (err) { next(err); }
};

/** PATCH /api/bookings/:id/cancel — Cancel booking (User). */
export const cancelBooking = async (req, res, next) => {
  try {
    const result = await bookingService.cancelBooking(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
};
