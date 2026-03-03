const express = require("express");
const {
  getAllFlights,
  createFlight,
  updateFlight,
  deleteFlight,
  searchFlights,
} = require("../controllers/flight.controller");

const router = express.Router();

router.get("/", getAllFlights);
router.get("/search", searchFlights);
router.post("/", createFlight);
router.put("/:id", updateFlight);
router.delete("/:id", deleteFlight);

module.exports = router;