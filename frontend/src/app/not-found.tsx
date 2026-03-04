import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      <Image
        src="/error.webp"
        alt="Page not found"
        width={400}
        height={300}
        priority
      />
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-5xl font-bold" style={{ color: "var(--primary)" }}>404</h1>
        <p className="text-xl" style={{ color: "var(--text)" }}>Oops! Page not found.</p>
        <p className="max-w-sm text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link href="/" className="nav-button">
        Back to Home
      </Link>
    </main>
  );
}
