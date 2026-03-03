const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware.js");
const {
  getFlightById,
  getAllFlights,
  createFlight,
  updateFlight,
  deleteFlight,
  searchFlights,
} = require("../controllers/flight.controllers");

const router = express.Router();

router.get("/", getAllFlights);
router.get("/:id", getFlightById);
router.get("/search", searchFlights);
router.post("/", protect, adminOnly, createFlight);     
router.put("/:id", protect, adminOnly, updateFlight);   
router.delete("/:id", protect, adminOnly, deleteFlight);

module.exports = router;