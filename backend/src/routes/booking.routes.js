const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { bookFlight, getMyBookings, cancelBooking } = require("../controllers/booking.controllers");

const router = express.Router();

router.post("/", protect, bookFlight);
router.get("/mine", protect, getMyBookings);
router.delete("/:bookingId", protect, cancelBooking);

module.exports = router;
