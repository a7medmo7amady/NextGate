"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuthCookie, clearAuthCookie } from "@/lib/auth";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const sync = useCallback(() => {
    setIsLoggedIn(!!getAuthCookie());
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

  return { isLoggedIn, logout };
}
