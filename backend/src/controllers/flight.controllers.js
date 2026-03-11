const Flight = require("../models/flight");

const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

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
    const { from, to, departDate, returnDate, class: flightClass, flightType } = req.query;

    const makeDateFilter = (dateStr) => {
      if (!dateStr) return null;
      const start = new Date(dateStr);
      const end   = new Date(dateStr);
      end.setDate(end.getDate() + 1);
      return { $gte: start, $lt: end };
    };

    // Shared text/class filters
    const baseFilter = {};
    if (from)       baseFilter.from  = { $regex: from.trim(), $options: "i" };
    if (to)         baseFilter.to    = { $regex: to.trim(),   $options: "i" };
    if (flightClass) baseFilter.class = flightClass.toLowerCase();

    // ── Round trip: two parallel queries ─────────────────────────────────────
    if (flightType === "round") {
      // Outbound: A → B on departDate
      const outboundFilter = { ...baseFilter };
      const departDateFilter = makeDateFilter(departDate);
      if (departDateFilter) outboundFilter.date = departDateFilter;

      // Return leg: swap from ↔ to, filter by returnDate (or >= departDate if unset)
      const returnFilter = {};
      if (flightClass) returnFilter.class = flightClass.toLowerCase();
      if (to)   returnFilter.from = { $regex: to.trim(),   $options: "i" };
      if (from) returnFilter.to   = { $regex: from.trim(), $options: "i" };

      const returnDateFilter = makeDateFilter(returnDate);
      if (returnDateFilter) {
        returnFilter.date = returnDateFilter;
      } else if (departDate) {
        // No return date given — at least ensure return is on/after departure date
        returnFilter.date = { $gte: new Date(departDate) };
      }

      const [outbound, returnFlights] = await Promise.all([
        Flight.find(outboundFilter),
        Flight.find(returnFilter),
      ]);

      return res.json({ type: "round", outbound, return: returnFlights });
    }

    // ── One-way: filter type=oneway ───────────────────────────────────────────
    if (flightType === "oneway") {
      const filter = { ...baseFilter, type: "oneway" };
      if (departDate && returnDate) {
        filter.date = { $gte: new Date(departDate), $lt: (() => { const d = new Date(returnDate); d.setDate(d.getDate()+1); return d; })() };
      } else if (departDate) {
        filter.date = makeDateFilter(departDate);
      }
      const flights = await Flight.find(filter);
      return res.json({ type: "oneway", flights });
    }

    // ── No type specified: return everything (wildcard) ───────────────────────
    const filter = { ...baseFilter };
    if (departDate && returnDate) {
      filter.date = { $gte: new Date(departDate), $lt: (() => { const d = new Date(returnDate); d.setDate(d.getDate()+1); return d; })() };
    } else if (departDate) {
      filter.date = makeDateFilter(departDate);
    }
    const flights = await Flight.find(filter);
    return res.json({ type: "all", flights });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getFlightById, getAllFlights, createFlight, updateFlight, deleteFlight, searchFlights };