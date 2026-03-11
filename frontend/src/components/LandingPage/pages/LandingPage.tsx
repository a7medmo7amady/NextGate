"use client";

import { useState } from "react";
import LandingPageCard from "../LandingPageCard";
import SearchForm from "../SearchForm";
import Welcome from "../Welcome";
import FlightCard, { type Flight, type SearchResult } from "../FlightCard";
import AddFlightModal from "../AddFlightModal";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const { isAdmin } = useAuth();
  const [result, setResult] = useState<SearchResult | null>(null);
  const [requestedTickets, setRequestedTickets] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  function handleSearch(data: SearchResult, tickets: number) {
    setResult(data);
    setRequestedTickets(tickets);
  }

  // When a new flight is created, append it to the current result set so it
  // shows up immediately without requiring a re-search.
  function handleFlightCreated(flight: Flight) {
    setResult((prev) => {
      if (!prev) return { type: "all", flights: [flight] };
      if (prev.type === "round") {
        return { ...prev, outbound: [flight, ...prev.outbound] };
      }
      return { ...prev, flights: [flight, ...prev.flights] };
    });
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

      {isAdmin && (
        <div className="flex justify-end w-[80vw] mx-auto mb-2">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer"
            style={{ background: "#80b9e8" }}
          >
            <span className="text-lg leading-none">+</span>
            Add Flight
          </button>
        </div>
      )}

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

      <AddFlightModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleFlightCreated}
      />
    </main>
  );
}
