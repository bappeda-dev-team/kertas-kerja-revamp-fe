import { AlertNotification } from "../global/Alert";

// ==========================
// Utilities: Cookie helpers
// ==========================
type CookieOptions = {
  path?: string;
  maxAge?: number;
  expires?: Date;
  sameSite?: "lax" | "strict" | "none" | "Lax" | "Strict" | "None";
  secure?: boolean;
};

export const setCookie = (
  name: string,
  value: string,
  opts: CookieOptions = {},
) => {
  if (typeof document === "undefined") return;

  const {
    path = "/",
    sameSite = "Lax",
    secure = process.env.NODE_ENV === "production",
    maxAge,
    expires,
  } = opts;

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value,
  )}; Path=${path}; SameSite=${sameSite}`;

  if (secure) cookie += "; Secure";
  if (typeof maxAge === "number") cookie += `; Max-Age=${maxAge}`;
  if (expires instanceof Date) cookie += `; Expires=${expires.toUTCString()}`;

  document.cookie = cookie;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const target = `; ${encodeURIComponent(name)}=`;
  const value = `; ${document.cookie}`;
  const parts = value.split(target);
  if (parts.length === 2) {
    const raw = parts.pop()!.split(";").shift()!;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return null;
};

export const removeCookie = (name: string, path = "/") => {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(
    name,
  )}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

// ==========================
// Auth helpers
// ==========================

export async function login(
  username: string,
  password: string,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockSessionId = "dev-session-" + Date.now();
  const mockUser = {
    username,
    nama: "Developer Mode",
    role: "ADMIN",
    nip: username,
  };

  localStorage.setItem("sessionId", mockSessionId);

  document.cookie = `sessionId=${mockSessionId}; path=/; SameSite=Lax`;
  document.cookie = `token=dummy-token-bypass; path=/; SameSite=Lax`;
  document.cookie = `user=${JSON.stringify(mockUser)}; path=/; SameSite=Lax`;

  AlertNotification("Login Berhasil", "Mode Development", "success", 2000, true);
}

export const logout = () => {
  removeCookie("sessionId", "/");
  removeCookie("token", "/");
  removeCookie("user", "/");
  removeCookie("opd", "/");
  removeCookie("tahun", "/");

  try {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("opd");
  } catch {}

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

// ==========================
// Global context helpers
// ==========================

export const getUser = () => {
  const raw = getCookie("user");
  if (!raw) return undefined;
  try {
    return { user: JSON.parse(raw) };
  } catch {
    return undefined;
  }
};

export const getToken = () => {
  return getCookie("token");
};

export const getSessionId = () => {
  return localStorage.getItem("sessionId") ?? "-";
};

/**
 * GLOBAL FILTER ENGINE
 * dipakai semua page (Tematik, Pohon, dll)
 */
export const getOpdTahun = () => {
  const tRaw = getCookie("tahun");
  const oRaw = getCookie("opd");

  let tahun: { value: string; label: string } | null = null;
  let opd: { value: string; label: string } | null = null;

  try {
    if (tRaw) tahun = JSON.parse(tRaw);
  } catch {}

  try {
    if (oRaw) opd = JSON.parse(oRaw);
  } catch {}

  return { tahun, opd };
};
