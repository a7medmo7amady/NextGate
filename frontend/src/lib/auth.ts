const COOKIE_NAME = "token";
const MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

function dispatch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("authchange"));
  }
}

export function setAuthCookie(token: string): void {
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Strict`;
  dispatch();
}

export function getAuthCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? match[1] : null;
}

export function clearAuthCookie(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
  dispatch();
}
