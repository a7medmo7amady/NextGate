"use client";

export interface Flight {
  _id: string;
  flightNumber: string;
  from: string;
  to: string;
  date: string;
  price: number;
  AvailableSeats: number;
  seats: number;
  class: "economy" | "business" | "first";
  type: "oneway" | "round";
}

export type SearchResult =
  | { type: "all";    flights: Flight[] }
  | { type: "oneway"; flights: Flight[] }
  | { type: "round";  outbound: Flight[]; return: Flight[] };

const CLASS_STYLES: Record<string, string> = {
  economy:  "bg-gray-100 text-gray-600",
  business: "bg-blue-100 text-blue-700",
  first:    "bg-yellow-100 text-yellow-700",
};

import { useState } from "react";
import { getAuthCookie } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function FlightCard({
  flight,
  requestedTickets = 1,
  onBooked,
}: {
  flight: Flight;
  requestedTickets?: number;
  onBooked?: (flightId: string) => void;
}) {
  const [booking, setBooking] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [bookingError, setBookingError] = useState("");
  const router = useRouter();

  const handleBook = async () => {
    const token = getAuthCookie();
    if (!token) {
      router.push("/login");
      return;
    }
    setBooking("loading");
    setBookingError("");
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ flightId: flight._id, quantity: requestedTickets }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.message || "Booking failed.");
        setBooking("error");
        return;
      }
      setBooking("done");
      onBooked?.(flight._id);
    } catch {
      setBookingError("Could not connect to server.");
      setBooking("error");
    }
  };
  const departureDate = new Date(flight.date);
  const formattedDate = departureDate.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = departureDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const occupancy = flight.seats - flight.AvailableSeats;
  const occupancyPct = Math.round((occupancy / flight.seats) * 100);

  const soldOut = flight.AvailableSeats === 0;
  const notEnough = !soldOut && flight.AvailableSeats < requestedTickets;
  const unavailable = soldOut || notEnough;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Flight {flight.flightNumber}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${CLASS_STYLES[flight.class] ?? CLASS_STYLES.economy}`}>
            {flight.class}
          </span>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            soldOut
              ? "bg-red-100 text-red-600"
              : notEnough
              ? "bg-orange-100 text-orange-600"
              : flight.AvailableSeats <= 5
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {soldOut
            ? "Sold Out"
            : notEnough
            ? `Not enough tickets (${flight.AvailableSeats} left)`
            : `${flight.AvailableSeats} seat${flight.AvailableSeats !== 1 ? "s" : ""} left`}
        </span>
      </div>

      {/* Route */}
      <div className="flex items-center gap-3">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">{flight.from}</p>
          <p className="text-xs text-gray-500">Origin</p>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center w-full gap-1">
            <div className="h-px flex-1 bg-gray-300" />
            <svg
              className="text-[#80B9E8]"
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
            <div className="h-px flex-1 bg-gray-300" />
          </div>
          <p className="text-xs text-gray-400">Direct</p>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">{flight.to}</p>
          <p className="text-xs text-gray-500">Destination</p>
        </div>
      </div>

      {/* Date & Time */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-[#80B9E8]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>
          {formattedDate} &mdash; {formattedTime}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Seat availability</span>
          <span>{occupancyPct}% occupied</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-[#80B9E8] h-2 rounded-full transition-all"
            style={{ width: `${occupancyPct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-xs text-gray-400">Price per seat</p>
          <p className="text-xl font-bold text-gray-800">
            ${flight.price.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          {booking === "done" ? (
            <span className="text-green-600 font-semibold text-sm px-4 py-2">✓ Booked!</span>
          ) : (
            <button
              onClick={handleBook}
              disabled={unavailable || booking === "loading"}
              className="bg-[#80B9E8] text-white text-sm font-semibold px-6 py-2 rounded-full hover:bg-[#5fa3d9] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {booking === "loading"
                ? "Booking…"
                : requestedTickets > 1
                ? `Book ${requestedTickets} Tickets`
                : "Book Now"}
            </button>
          )}
          {bookingError && (
            <span className="text-red-500 text-xs">{bookingError}</span>
          )}
        </div>
      </div>
    </div>
  );
}
