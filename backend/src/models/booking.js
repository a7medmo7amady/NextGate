const mongoose = require("mongoose");

// One-to-few: embedded in the User document.
// Flight details are snapshotted at booking time so history survives
// even if the flight document is later edited or deleted.
const bookingSchema = new mongoose.Schema(
  {
    flightId:     { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
    flightNumber: { type: String, required: true },
    from:         { type: String, required: true },
    to:           { type: String, required: true },
    date:         { type: Date,   required: true },
    price:        { type: Number, required: true },
    class:        { type: String, required: true },
    type:         { type: String, required: true },
    quantity:     { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true }
);

module.exports = bookingSchema;
