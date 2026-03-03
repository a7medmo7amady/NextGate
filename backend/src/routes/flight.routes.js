const express = require("express");
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
router.post("/", createFlight);
router.put("/:id", updateFlight);
router.delete("/:id", deleteFlight);

module.exports = router;