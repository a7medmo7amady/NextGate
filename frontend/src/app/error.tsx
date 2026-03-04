"use client"
import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-6xl font-bold" style={{ color: "var(--primary)" }}>500</h1>
        <p className="text-xl" style={{ color: "var(--text)" }}>Something went wrong.</p>
        <p className="max-w-sm text-gray-400">
          An unexpected error occurred. Please try again or go back home.
        </p>
      </div>
      <div className="flex gap-4">
        <button onClick={reset} className="nav-button">Try Again</button>
        <Link href="/" className="nav-button">Back to Home</Link>
      </div>
    </main>
  );
}
