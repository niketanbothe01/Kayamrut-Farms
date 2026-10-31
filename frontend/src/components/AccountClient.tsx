"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

const TOKEN_KEY = "kayamrut_customer_token";

type AuthResponse = {
  token: string;
  user: { id: number; name: string; email: string; phone: string | null };
};

export function AccountClient() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const form = new FormData(e.currentTarget);
    try {
      if (mode === "login") {
        const json = await apiPost<AuthResponse>("/auth/login", {
          email: String(form.get("email") || ""),
          password: String(form.get("password") || ""),
        });
        window.localStorage.setItem(TOKEN_KEY, json.token);
        setUser(json.user);
        setMessage("Signed in.");
      } else {
        const json = await apiPost<AuthResponse>("/auth/register", {
          name: String(form.get("name") || ""),
          email: String(form.get("email") || ""),
          phone: String(form.get("phone") || "") || null,
          password: String(form.get("password") || ""),
          password_confirmation: String(form.get("password_confirmation") || ""),
        });
        window.localStorage.setItem(TOKEN_KEY, json.token);
        setUser(json.user);
        setMessage("Account created.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Request failed.");
    }
  }

  return (
    <div className="surface-card mt-8 max-w-lg p-8">
      <div className="flex gap-3 text-sm">
        <button
          type="button"
          className={mode === "login" ? "font-semibold text-forest" : "text-muted"}
          onClick={() => setMode("login")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={mode === "register" ? "font-semibold text-forest" : "text-muted"}
          onClick={() => setMode("register")}
        >
          Create account
        </button>
      </div>

      {user ? (
        <p className="mt-6 text-forest">
          Hello, {user.name} ({user.email}). Guest checkout still works without signing in —
          accounts are ready for order history next.
        </p>
      ) : (
        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          {mode === "register" ? (
            <>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" required />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" />
              </div>
            </>
          ) : null}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required minLength={8} />
          </div>
          {mode === "register" ? (
            <div className="field">
              <label htmlFor="password_confirmation">Confirm password</label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                minLength={8}
              />
            </div>
          ) : null}
          <button type="submit" className="btn btn-primary">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      )}
      {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
    </div>
  );
}
