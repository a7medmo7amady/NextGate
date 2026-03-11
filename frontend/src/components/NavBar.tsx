"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();

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
          {isLoggedIn ? (
            <>
              <Link href="/history" className="nav-button">
                Flight History
              </Link>

           <div className="profile-menu group">
                <button className="profile-icon" aria-label="Account menu">
                  <Image
                    src="/user.svg"
                    alt="Profile"
                    width={20}
                    height={20}
                  />
                </button>

                <div className="dropdown-bridge" />

                <div className="profile-dropdown">
                  <button
                    onClick={logout}
                    className="dropdown-item dropdown-item--danger"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-button login">
                Login
              </Link>
              <Link href="/signup" className="nav-button register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
