import eventService from "../services/eventService.js";

/** POST /api/events — Create event (Organizer). */
export const createEvent = async (req, res, next) => {
  try {
    const eventData = { ...req.body };
    if (req.file) eventData.image = req.file.filename;
    const event = await eventService.createEvent(req.user._id, eventData);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

/** GET /api/events/organizer — Get organizer's own events. */
export const getOrganizerEvents = async (req, res, next) => {
  try {
    const events = await eventService.getOrganizerEvents(req.user._id);
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
};

/** GET /api/events/approved — Get approved events (public/user). */
export const getApprovedEvents = async (_req, res, next) => {
  try {
    const events = await eventService.getApprovedEvents();
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
};

/** GET /api/events/all — Get all events (Admin). */
export const getAllEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents({
      status: req.query.status,
    });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
};

/** GET /api/events/:id — Get single event. */
export const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/events/:id — Update event (Organizer). */
export const updateEvent = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.filename;
    const event = await eventService.updateEvent(
      req.params.id,
      req.user._id,
      updateData,
    );
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/events/:id — Delete event (Organizer). */
export const deleteEvent = async (req, res, next) => {
  try {
    const result = await eventService.deleteEvent(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/events/:id/approve — Approve event (Admin). */
export const approveEvent = async (req, res, next) => {
  try {
    const event = await eventService.approveEvent(req.params.id);
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/events/:id/reject — Reject event (Admin). */
export const rejectEvent = async (req, res, next) => {
  try {
    const event = await eventService.rejectEvent(req.params.id);
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};
