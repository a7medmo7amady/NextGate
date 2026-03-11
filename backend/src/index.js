const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("./config/passport");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const flightRoutes = require("./routes/flight.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
