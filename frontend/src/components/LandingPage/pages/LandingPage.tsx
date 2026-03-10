"use client";

import { useState } from "react";
import LandingPageCard from "../LandingPageCard";
import SearchForm from "../SearchForm";
import Welcome from "../Welcome";
import FlightCard, { type Flight } from "../FlightCard";

export default function LandingPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searched, setSearched] = useState(false);

  function handleSearch(results: Flight[], didSearch: boolean) {
    setFlights(results);
    setSearched(didSearch);
  }

  return (
    <main>
      <LandingPageCard>
        <Welcome />
      </LandingPageCard>

      <LandingPageCard>
        <SearchForm onSearch={handleSearch} />
      </LandingPageCard>

      {searched && (
        <LandingPageCard>
          <h2 className="text-white font-semibold text-lg mb-4">
            {flights.length > 0
              ? `${flights.length} flight${flights.length !== 1 ? "s" : ""} found`
              : "No flights found for your search"}
          </h2>

          {flights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {flights.map((flight) => (
                <FlightCard key={flight._id} flight={flight} />
              ))}
            </div>
          )}
        </LandingPageCard>
      )}
    </main>
  );
}
