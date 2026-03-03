const Flight = require("../models/flight");
s
const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json(flight);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flight) return res.status(404).json({ message: "Flight not found" });
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });
    res.json({ message: "Flight deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const searchFlights = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    const filter = {};
    if (from) filter.from = from;
    if (to) filter.to = to;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const flights = await Flight.find(filter);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getAllFlights, createFlight, updateFlight, deleteFlight, searchFlights };