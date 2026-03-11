"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuthCookie } from "@/lib/auth";

interface Booking {
  _id: string;
  flightId: string;
  flightNumber: string;
  from: string;
  to: string;
  date: string;
  price: number;
  class: string;
  type: string;
  quantity: number;
  createdAt: string;
}

const HOURS_48 = 48 * 60 * 60 * 1000;

function isPast(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

function canCancel(dateStr: string): boolean {
  return new Date(dateStr).getTime() - Date.now() > HOURS_48;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BookingCard({
  b,
  onCancelled,
}: {
  b: Booking;
  onCancelled: (id: string) => void;
}) {
  const past = isPast(b.date);
  const cancellable = !past && canCancel(b.date);
  const [cancelState, setCancelState] = useState<"idle" | "confirming" | "loading" | "error">("idle");
  const [cancelError, setCancelError] = useState("");

  const handleCancel = async () => {
    const token = getAuthCookie();
    if (!token) return;
    setCancelState("loading");
    setCancelError("");
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${b._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setCancelError(data.message || "Cancellation failed.");
        setCancelState("error");
        return;
      }
      onCancelled(b._id);
    } catch {
      setCancelError("Could not connect to server.");
      setCancelState("error");
    }
  };

  const totalPrice = b.price * (b.quantity ?? 1);

  return (
    <li
      className="rounded-xl p-5 flex justify-between items-start gap-4"
      style={{
        background: past ? "rgba(0,0,0,0.04)" : "#80b9e820",
        border: `1px solid ${past ? "rgba(0,0,0,0.08)" : "#80b9e840"}`,
        opacity: past ? 0.75 : 1,
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="font-bold text-lg" style={{ color: "var(--text)" }}>
            {b.from} → {b.to}
          </p>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={
              past
                ? { background: "rgba(0,0,0,0.08)", color: "#666" }
                : { background: "#80b9e830", color: "#2a7abf" }
            }
          >
            {past ? "Past" : "Upcoming"}
          </span>
        </div>
        <p className="text-sm" style={{ color: "rgba(0,0,0,0.55)" }}>
          {b.flightNumber} · {b.class} · {b.type === "round" ? "Round Trip" : "One Way"}
          {(b.quantity ?? 1) > 1 && (
            <span className="ml-2 font-medium" style={{ color: "#2a7abf" }}>
              × {b.quantity} tickets
            </span>
          )}
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(0,0,0,0.4)" }}>
          Departure: {formatDate(b.date)}
        </p>
        {cancelError && (
          <p className="text-xs mt-1 text-red-500">{cancelError}</p>
        )}
        {!past && !cancellable && (
          <p className="text-xs mt-1" style={{ color: "#e08030" }}>
            Within 48-hour window — cancellation no longer available
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="font-bold text-xl" style={{ color: past ? "#999" : "#80b9e8" }}>
          ${totalPrice.toFixed(2)}
          {(b.quantity ?? 1) > 1 && (
            <span className="text-xs font-normal ml-1" style={{ color: "rgba(0,0,0,0.4)" }}>
              (${b.price} × {b.quantity})
            </span>
          )}
        </span>

        {cancellable && (
          <>
            {cancelState === "confirming" ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full text-white"
                  style={{ background: "#e05252" }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setCancelState("idle")}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.07)", color: "#333" }}
                >
                  Keep
                </button>
              </div>
            ) : cancelState === "loading" ? (
              <span className="text-xs" style={{ color: "#888" }}>Cancelling…</span>
            ) : (
              <button
                onClick={() => setCancelState("confirming")}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                style={{ borderColor: "#e05252", color: "#e05252", background: "transparent" }}
              >
                Cancel Booking
              </button>
            )}
          </>
        )}
      </div>
    </li>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(() => {
    const token = getAuthCookie();
    if (!token) { router.push("/login"); return; }
    fetch("http://localhost:5000/api/bookings/mine", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleCancelled = (id: string) =>
    setBookings((prev) => prev.filter((b) => b._id !== id));

  const upcoming = bookings.filter((b) => !isPast(b.date));
  const past     = bookings.filter((b) => isPast(b.date));

  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--text)" }}>
        Flight History
      </h1>

      {loading ? (
        <p style={{ color: "var(--text)" }}>Loading…</p>
      ) : bookings.length === 0 ? (
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
        <div className="flex flex-col gap-10">
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#2a7abf" }}>
                ✈ Upcoming ({upcoming.length})
              </h2>
              <ul className="flex flex-col gap-3">
                {upcoming.map((b) => (
                  <BookingCard key={b._id} b={b} onCancelled={handleCancelled} />
                ))}
              </ul>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#888" }}>
                Past ({past.length})
              </h2>
              <ul className="flex flex-col gap-3">
                {past.map((b) => (
                  <BookingCard key={b._id} b={b} onCancelled={handleCancelled} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

