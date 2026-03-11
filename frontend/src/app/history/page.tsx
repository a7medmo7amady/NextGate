"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthCookie } from "@/lib/auth";

interface Flight {
  _id: string;
  flightNumber: string;
  from: string;
  to: string;
  date: string;
  price: number;
  class: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthCookie();
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch booked flights for the logged-in user
    fetch("http://localhost:5000/api/flights/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setFlights(data))
      .catch(() => setFlights([]))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--text)" }}>
        Flight History
      </h1>

      {loading ? (
        <p style={{ color: "var(--text)" }}>Loading...</p>
      ) : flights.length === 0 ? (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "#80b9e820", border: "1px solid #80b9e840" }}
        >
          <p className="text-lg font-medium" style={{ color: "var(--text)" }}>
            No flights booked yet.
          </p>
          <p className="mt-2 text-sm" style={{ color: "rgba(0,0,0,0.5)" }}>
            Your booked flights will appear here.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 nav-button inline-block"
            style={{ cursor: "pointer", border: "none" }}
          >
            Browse Flights
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {flights.map((f) => (
            <li
              key={f._id}
              className="rounded-xl p-5 flex justify-between items-center"
              style={{ background: "#80b9e820", border: "1px solid #80b9e840" }}
            >
              <div>
                <p className="font-bold text-lg" style={{ color: "var(--text)" }}>
                  {f.from} → {f.to}
                </p>
                <p className="text-sm mt-1" style={{ color: "rgba(0,0,0,0.6)" }}>
                  {f.flightNumber} · {f.class} ·{" "}
                  {new Date(f.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="font-bold text-xl" style={{ color: "#80b9e8" }}>
                ${f.price}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
