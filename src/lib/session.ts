import type { Role } from "./mock-data";

const KEY = "vidyasetu.session";

export type Session = { role: Role; name: string } | null;

export function getSession(): Session {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(s: Session) {
  if (typeof window === "undefined") return;
  if (s) localStorage.setItem(KEY, JSON.stringify(s));
  else localStorage.removeItem(KEY);
}

export function roleHome(role: Role): string {
  return { child: "/child", parent: "/parent", worker: "/worker", supervisor: "/supervisor" }[role];
}
