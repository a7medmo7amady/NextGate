"use client";

import { useState, useEffect, useRef } from "react";
import { getAuthCookie } from "@/lib/auth";
import type { Flight } from "./FlightCard";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (flight: Flight) => void;
}

const EMPTY = {
  flightNumber: "",
  from: "",
  to: "",
  date: "",
  returnDate: "",
  price: "",
  AvailableSeats: "",
  seats: "",
  class: "economy",
  type: "oneway",
};

export default function AddFlightModal({ open, onClose, onCreated }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync the <dialog> open state
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else {
      el.close();
      setForm(EMPTY);
      setError("");
    }
  }, [open]);

  // Close on backdrop click
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const price = Number(form.price);
    const seats = Number(form.seats);
    const available = Number(form.AvailableSeats);

    if (available > seats) {
      setError("Available seats cannot exceed total seats.");
      return;
    }

    const token = getAuthCookie();
    if (!token) { setError("Not authenticated."); return; }

    if (form.type === "round" && !form.returnDate) {
      setError("Please provide a return date for round trips.");
      return;
    }

    setLoading(true);
    try {
      const postFlight = async (body: object) => {
        const res = await fetch("http://localhost:5000/api/flights", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create flight.");
        return data;
      };

      const baseNumber = form.flightNumber.trim().toUpperCase();
      const outbound = await postFlight({
        flightNumber: baseNumber,
        from: form.from.trim(),
        to: form.to.trim(),
        date: new Date(form.date).toISOString(),
        price,
        seats,
        AvailableSeats: available,
        class: form.class,
        type: form.type,
      });
      onCreated(outbound);

      if (form.type === "round") {
        const returnLeg = await postFlight({
          flightNumber: baseNumber + "R",
          from: form.to.trim(),
          to: form.from.trim(),
          date: new Date(form.returnDate).toISOString(),
          price,
          seats,
          AvailableSeats: available,
          class: form.class,
          type: "round",
        });
        onCreated(returnLeg);
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-lg px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-[#80b9e8] transition-colors";
  const labelCls = "text-xs font-semibold text-gray-500 uppercase tracking-wide";

  return (
    <dialog
      ref={dialogRef}
      onClick={handleDialogClick}
      className="rounded-2xl shadow-2xl p-0 w-full max-w-lg backdrop:bg-black/50"
      style={{
        border: "none",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        margin: 0,
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{ background: "#80b9e8" }}
        >
          <h2 className="text-white font-bold text-lg">Add New Flight</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4 bg-white rounded-b-2xl">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Row: flight number + type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Flight Number</label>
              <input
                required
                value={form.flightNumber}
                onChange={(e) => set("flightNumber", e.target.value)}
                placeholder="NG101"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Type</label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className={inputCls}
              >
                <option value="oneway">One Way</option>
                <option value="round">Round Trip</option>
              </select>
            </div>
          </div>

          {/* Row: from + to */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelCls}>From</label>
              <input
                required
                value={form.from}
                onChange={(e) => set("from", e.target.value)}
                placeholder="New York"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelCls}>To</label>
              <input
                required
                value={form.to}
                onChange={(e) => set("to", e.target.value)}
                placeholder="London"
                className={inputCls}
              />
            </div>
          </div>

          {/* Row: date + class */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Departure Date & Time</label>
              <input
                required
                type="datetime-local"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Class</label>
              <select
                value={form.class}
                onChange={(e) => set("class", e.target.value)}
                className={inputCls}
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </div>
          </div>

          {/* Return date — only for round trips */}
          {form.type === "round" && (
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Return Date & Time</label>
              <input
                required
                type="datetime-local"
                value={form.returnDate}
                onChange={(e) => set("returnDate", e.target.value)}
                min={form.date || undefined}
                className={inputCls}
              />
            </div>
          )}

          {/* Row: price + seats + available */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Price ($)</label>
              <input
                required
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="450"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Total Seats</label>
              <input
                required
                type="number"
                min={1}
                value={form.seats}
                onChange={(e) => set("seats", e.target.value)}
                placeholder="180"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Available</label>
              <input
                required
                type="number"
                min={0}
                value={form.AvailableSeats}
                onChange={(e) => set("AvailableSeats", e.target.value)}
                placeholder="120"
                className={inputCls}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
              style={{ background: "#80b9e8" }}
            >
              {loading ? "Adding…" : "Add Flight"}
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
