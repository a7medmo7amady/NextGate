"use client";

import { useState } from "react";
import LandingPageCard from "../LandingPageCard";
import SearchForm from "../SearchForm";
import Welcome from "../Welcome";
import FlightCard, { type Flight, type SearchResult } from "../FlightCard";

export default function LandingPage() {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [requestedTickets, setRequestedTickets] = useState(1);

  function handleSearch(data: SearchResult, tickets: number) {
    setResult(data);
    setRequestedTickets(tickets);
  }

  const totalFound =
    result === null
      ? 0
      : result.type === "round"
      ? result.outbound.length + result.return.length
      : result.flights.length;

  function FlightGrid({ flights, label }: { flights: Flight[]; label?: string }) {
    return (
      <div className="mb-6 last:mb-0">
        {label && (
          <h3 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
            <span>{label}</span>
            <span className="text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full">
              {flights.length} flight{flights.length !== 1 ? "s" : ""}
            </span>
          </h3>
        )}
        {flights.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flights.map((flight) => (
              <FlightCard key={flight._id} flight={flight} requestedTickets={requestedTickets} />
            ))}
          </div>
        ) : (
          <p className="text-white/70 text-sm">No flights found for this leg.</p>
        )}
      </div>
    );
  }

  return (
    <main>
      <LandingPageCard>
        <Welcome />
      </LandingPageCard>

      <LandingPageCard>
        <SearchForm onSearch={handleSearch} />
      </LandingPageCard>

      {result !== null && (
        <LandingPageCard>
          <h2 className="text-white font-semibold text-lg mb-4">
            {totalFound > 0
              ? `${totalFound} flight${totalFound !== 1 ? "s" : ""} found`
              : "No flights found for your search"}
          </h2>

          {result.type === "round" ? (
            <>
              <FlightGrid flights={result.outbound} label="✈ Outbound Flights" />
              <div className="border-t border-white/20 my-4" />
              <FlightGrid flights={result.return} label="↩ Return Flights" />
            </>
          ) : (
            <FlightGrid flights={result.flights} />
          )}
        </LandingPageCard>
      )}
    </main>
  );
}
