export interface Flight {
  _id: string;
  flightNumber: string;
  from: string;
  to: string;
  date: string;
  price: number;
  AvailableSeats: number;
  seats: number;
}

export default function FlightCard({ flight }: { flight: Flight }) {
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

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Flight {flight.flightNumber}
        </span>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            flight.AvailableSeats === 0
              ? "bg-red-100 text-red-600"
              : flight.AvailableSeats <= 5
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {flight.AvailableSeats === 0
            ? "Sold Out"
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

      {/* Seat occupancy bar */}
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-xs text-gray-400">Price per seat</p>
          <p className="text-xl font-bold text-gray-800">
            ${flight.price.toFixed(2)}
          </p>
        </div>

        <button
          disabled={flight.AvailableSeats === 0}
          className="bg-[#80B9E8] text-white text-sm font-semibold px-6 py-2 rounded-full hover:bg-[#5fa3d9] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
