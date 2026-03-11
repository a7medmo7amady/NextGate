const mongoose = require("mongoose");
const bookingSchema = require("./booking");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: undefined },
    verificationCodeExpires: { type: Date, default: undefined },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    bookings: { type: [bookingSchema], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;