"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuthCookie, clearAuthCookie } from "@/lib/auth";

function decodeRole(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const sync = useCallback(() => {
    const token = getAuthCookie();
    setIsLoggedIn(!!token);
    setIsAdmin(!!token && decodeRole(token) === "admin");
  }, []);

  useEffect(() => {
    // Initial check
    sync();

    // Re-sync whenever our custom event fires (set/clear cookie)
    window.addEventListener("authchange", sync);
    return () => window.removeEventListener("authchange", sync);
  }, [sync]);

  const logout = useCallback(() => {
    clearAuthCookie();
    router.push("/");
  }, [router]);

  return { isLoggedIn, isAdmin, logout };
}
