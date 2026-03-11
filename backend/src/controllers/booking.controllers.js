const User = require("../models/user");
const Flight = require("../models/flight");

const HOURS_48 = 48 * 60 * 60 * 1000;

/**
 * POST /api/bookings
 * Body: { flightId, quantity? }  (quantity defaults to 1)
 * Protected – requires valid JWT.
 *
 * Books N seats on the requested flight for the authenticated user.
 * Uses a MongoDB atomic $inc to decrement AvailableSeats safely, then
 * pushes a snapshot (with quantity) into the user's embedded bookings array.
 */
const bookFlight = async (req, res) => {
  try {
    const { flightId, quantity: rawQty = 1 } = req.body;
    const quantity = parseInt(rawQty, 10);

    if (!flightId) {
      return res.status(400).json({ message: "flightId is required" });
    }
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "quantity must be at least 1" });
    }

    const flight = await Flight.findOneAndUpdate(
      { _id: flightId, AvailableSeats: { $gte: quantity } },
      { $inc: { AvailableSeats: -quantity } },
      { new: true }
    );

    if (!flight) {
      const exists = await Flight.findById(flightId);
      if (!exists) return res.status(404).json({ message: "Flight not found" });
      const avail = exists.AvailableSeats;
      return res.status(409).json({
        message: avail === 0
          ? "No seats available on this flight"
          : `Only ${avail} seat${avail !== 1 ? "s" : ""} left – reduce the number of tickets`,
      });
    }

    const booking = {
      flightId:     flight._id,
      flightNumber: flight.flightNumber,
      from:         flight.from,
      to:           flight.to,
      date:         flight.date,
      price:        flight.price,
      class:        flight.class,
      type:         flight.type,
      quantity,
    };

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $push: { bookings: booking } },
      { new: true, select: "bookings" }
    );

    const newBooking = user.bookings[user.bookings.length - 1];
    return res.status(201).json({ message: "Flight booked successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * GET /api/bookings/mine
 * Protected – returns the authenticated user's bookings sorted newest first.
 */
const getMyBookings = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("bookings");
    if (!user) return res.status(404).json({ message: "User not found" });

    const sorted = [...user.bookings].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * DELETE /api/bookings/:bookingId
 * Protected – cancels one of the authenticated user's bookings.
 *
 * Only allowed if the flight departs more than 48 hours from now.
 * Atomically restores the seats on the flight document.
 */
const cancelBooking = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("bookings");
    if (!user) return res.status(404).json({ message: "User not found" });

    const booking = user.bookings.id(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const hoursUntilFlight = new Date(booking.date) - Date.now();
    if (hoursUntilFlight <= HOURS_48) {
      return res.status(409).json({
        message: "Cancellation is only allowed more than 48 hours before departure",
      });
    }

    const { quantity = 1 } = booking;

    // Restore seats atomically
    await Flight.findByIdAndUpdate(booking.flightId, { $inc: { AvailableSeats: quantity } });

    // Remove the booking subdocument and save
    booking.deleteOne();
    await user.save();

    return res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { bookFlight, getMyBookings, cancelBooking };
