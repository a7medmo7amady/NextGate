"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../../Card";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // TODO: connect to Google OAuth
    console.log("Google register");
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Card className="max-w-md">
        <h1 className="text-3xl font-bold mb-1 text-white">Create account</h1>
        <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
          Join NextGate today
        </p>

        <button
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-3 rounded-lg px-4 py-2.5 mb-4 text-sm font-medium transition hover:opacity-80"
          style={{ background: "var(--background)", color: "var(--text)", border: "none" }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.09-6.09C34.46 3.09 29.5 1 24 1 14.82 1 7.07 6.48 3.64 14.22l7.09 5.51C12.4 13.59 17.73 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v8.98h12.43c-.54 2.9-2.18 5.36-4.65 7.01l7.13 5.54C43.17 37.35 46.1 31.4 46.1 24.5z"/>
            <path fill="#FBBC05" d="M10.73 28.27A14.57 14.57 0 0 1 9.5 24c0-1.49.26-2.93.73-4.27l-7.09-5.51A23.93 23.93 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l8.17-6.51z"/>
            <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.95l-7.13-5.54C28.6 38.27 26.42 39 24 39c-6.27 0-11.6-4.09-13.27-9.73l-8.17 6.51C6.07 43.52 14.49 47 24 47z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <hr className="flex-1" style={{ borderColor: "rgba(255,255,255,0.4)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>or</span>
          <hr className="flex-1" style={{ borderColor: "rgba(255,255,255,0.4)" }} />
        </div>

        {error && (
          <p className="text-sm mb-3 text-center rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-sm font-medium text-white">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Walter White"
              required
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--background)", border: "none", color: "var(--text)" }}
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-sm font-medium text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Me@gmail.com"
              required
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--background)", border: "none", color: "var(--text)" }}
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-sm font-medium text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--background)", border: "none", color: "var(--text)" }}
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-sm font-medium text-white">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--background)", border: "none", color: "var(--text)" }}
            />
          </div>

          <button type="submit" disabled={loading} className="nav-button w-full justify-center mt-2">
            {loading ? "Creating" : "Create Account"}
          </button>
        </form>

        <p className="text-sm mt-6 text-center" style={{ color: "rgba(255,255,255,0.75)" }}>
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="font-semibold text-white hover:opacity-75 transition"
          >
            Sign in
          </button>
        </p>
      </Card>
    </div>
  );
}
