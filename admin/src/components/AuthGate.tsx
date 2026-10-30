"use client";

import { FormEvent, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { fetchMe, loginAdmin, logoutAdmin } from "@/lib/admin-api";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("admin@kayamrut.local");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await fetchMe();
        if (!cancelled) {
          setAuthed(true);
          setUserName(me.data.name);
        }
      } catch {
        if (!cancelled) setAuthed(false);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const user = await loginAdmin(email, password);
      setUserName(user.name);
      setAuthed(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? "Invalid admin credentials or API unreachable."
          : "Login failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function onLogout() {
    await logoutAdmin();
    setAuthed(false);
    setUserName(null);
  }

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream text-muted">
        Connecting to API…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-4">
        <form
          onSubmit={onSubmit}
          className="panel w-full max-w-md space-y-4 p-6 shadow-sm"
        >
          <div>
            <p className="font-display text-2xl text-forest">Kayamrut Admin</p>
            <p className="mt-1 text-sm text-muted">
              Sign in against the Laravel API (`NEXT_PUBLIC_API_URL`).
            </p>
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error ? <p className="text-sm text-warn">{error}</p> : null}
          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <AdminSession userName={userName} onLogout={onLogout}>
      {children}
    </AdminSession>
  );
}

function AdminSession({
  children,
  userName,
  onLogout,
}: {
  children: React.ReactNode;
  userName: string | null;
  onLogout: () => void;
}) {
  return (
    <div className="relative">
      <div className="absolute right-4 top-4 z-20 hidden items-center gap-2 md:flex">
        <span className="text-xs text-muted">{userName}</span>
        <button type="button" className="btn btn-ghost text-xs" onClick={onLogout}>
          Log out
        </button>
      </div>
      {children}
    </div>
  );
}
