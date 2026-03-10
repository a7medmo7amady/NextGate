"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "../../Card";

export default function Verify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Verification failed.");
        return;
      }

      setSuccess("Email verified! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Card className="max-w-md">
        <h1 className="text-3xl font-bold mb-1 text-white">Verify your email</h1>
        <p className="mb-2 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
          We sent a 6-digit code to
        </p>
        <p className="mb-6 text-sm font-semibold text-white">{email}</p>

        {error && (
          <p className="text-sm mb-3 text-center rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm mb-3 text-center rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.3)", color: "#fff" }}>
            {success}
          </p>
        )}

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-sm font-medium text-white">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              required
              maxLength={6}
              className="rounded-lg px-3 py-2 text-sm outline-none tracking-widest text-center text-lg font-bold"
              style={{ background: "var(--background)", border: "none", color: "var(--text)" }}
            />
          </div>

          <button type="submit" disabled={loading || code.length !== 6} className="nav-button w-full justify-center mt-2">
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <p className="text-sm mt-6 text-center" style={{ color: "rgba(255,255,255,0.75)" }}>
          Wrong email?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="font-semibold text-white hover:opacity-75 transition"
          >
            Go back
          </button>
        </p>
      </Card>
    </div>
  );
}
