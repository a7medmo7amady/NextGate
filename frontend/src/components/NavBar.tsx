"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setHasSession(true);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="SkyBook logo"
              width={120}
              height={40}
              priority
            />
          </Link>
        </div>

        <div className="nav-right">
          {hasSession ? (
            <>
              <Link
                href="/history"
                className="nav-link"
              >
                Flight History
              </Link>

              <div className="user-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="black"
                >
                  <path d="M12 12c2.76 0 5-2.46 5-5.5S14.76 1 12 1 7 3.46 7 6.5 9.24 12 12 12zm0 2c-4.42 0-8 2.91-8 6.5V23h16v-2.5c0-3.59-3.58-6.5-8-6.5z" />
                </svg>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="nav-button login"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="nav-button register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
