"use client";

import { useState } from "react";

export default function SearchForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tickets, setTickets] = useState(1);
  const [flightType, setFlightType] = useState("round");

  function swapLocations() {
    setFrom(to);
    setTo(from);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!departDate) {
      alert("Please select a departure date.");
      return;
    }

    if (flightType === "round" && returnDate && returnDate < departDate) {
      alert("Return date cannot be before departure date.");
      return;
    }

    if (tickets <= 0) {
      alert("Number of tickets must be at least 1.");
      return;
    }

    console.log({
      from,
      to,
      departDate,
      returnDate,
      tickets,
      flightType,
    });
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* flight type */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-white mb-1">
          Flight Type
        </label>
        <select
          value={flightType}
          onChange={(e) => setFlightType(e.target.value)}
          className="bg-white rounded-full px-4 py-2 text-sm w-40"
        >
          <option value="round">Round Trip</option>
          <option value="oneway">One Way</option>
        </select>
      </div>

      {/* inputs row */}
      <div className="flex flex-nowrap items-end gap-3">

        {/* From */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-white mb-1">From</label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-white rounded-full px-5 py-3 w-40"
          />
        </div>

        {/* Swap */}
        <button
          type="button"
          onClick={swapLocations}
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-lg mt-6 swapButton"
        >
          <img src="/switch-38.svg" alt="swtich" width={18} height={18} />
        </button>

        {/* To */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-white mb-1">To</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-white rounded-full px-5 py-3 w-40"
          />
        </div>

        {/* Depart */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-white mb-1">
            Depart Date
          </label>
          <input
            type="date"
            min={today}
            value={departDate}
            onChange={(e) => setDepartDate(e.target.value)}
            className="bg-white rounded-full px-5 py-3 w-44"
          />
        </div>

        {/* Return */}
        {flightType !== "oneway" && (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-white mb-1">
              Return Date
            </label>
            <input
              type="date"
              min={departDate || today}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="bg-white rounded-full px-5 py-3 w-44"
            />
          </div>
        )}

        {/* Tickets */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-white mb-1">
            Number of Tickets
          </label>
          <input
            type="number"
            min={1}
            value={tickets}
            onChange={(e) => setTickets(Number(e.target.value))}
            className="bg-white rounded-full px-5 py-3 w-44"
          />
        </div>

        {/* Ticket Type */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-white mb-1">
            Ticket Type
          </label>
          <select className="bg-white rounded-full px-5 py-3 w-40">
            <option>Economy</option>
            <option>Business</option>
            <option>First</option>
          </select>
        </div>

        {/* Search */}
        <button
          type="submit"
          className="bg-white rounded-full w-12 h-12 flex items-center justify-center mt-6 shrink-0"
        >
          <img src="/search.svg" alt="Search" width={18} height={18} />
        </button>

      </div>
    </form>
  );
}