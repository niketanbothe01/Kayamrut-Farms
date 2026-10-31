"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatInr } from "@/data/types";
import { useCart } from "@/lib/cart";
import { placeOrder } from "@/lib/checkout";

export function CheckoutClient() {
  const router = useRouter();
  const { lines, subtotalInr, clear, ready } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) {
    return <div className="mt-8 h-64 animate-pulse rounded-2xl bg-cream-strong" />;
  }

  if (lines.length === 0) {
    return (
      <div className="surface-card mt-8 max-w-xl p-8">
        <p className="text-muted">Nothing to check out yet.</p>
        <Link href="/shop" className="btn btn-primary mt-6">
          Browse shop
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);

    try {
      const order = await placeOrder({
        customer_name: String(form.get("customer_name") || ""),
        customer_email: String(form.get("customer_email") || ""),
        phone: String(form.get("phone") || ""),
        address: String(form.get("address") || ""),
        city: String(form.get("city") || ""),
        pincode: String(form.get("pincode") || ""),
        payment_method: String(form.get("payment_method") || "cod") as "cod" | "prepaid",
        packing_notes: String(form.get("packing_notes") || "") || undefined,
        items: lines.map((l) => ({
          variant_id: Number(l.variantId),
          qty: l.qty,
        })),
      });
      clear();
      router.push(
        `/order/confirm?number=${encodeURIComponent(order.number)}&email=${encodeURIComponent(order.customer_email)}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-8 grid gap-8 lg:grid-cols-[1fr_18rem]" onSubmit={onSubmit}>
      <div className="surface-card grid gap-4 p-6 md:grid-cols-2">
        <div className="field md:col-span-2">
          <label htmlFor="customer_name">Full name</label>
          <input id="customer_name" name="customer_name" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="customer_email">Email</label>
          <input
            id="customer_email"
            name="customer_email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" required autoComplete="tel" />
        </div>
        <div className="field md:col-span-2">
          <label htmlFor="address">Address</label>
          <input id="address" name="address" required autoComplete="street-address" />
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input id="city" name="city" required autoComplete="address-level2" />
        </div>
        <div className="field">
          <label htmlFor="pincode">PIN code</label>
          <input id="pincode" name="pincode" required autoComplete="postal-code" />
        </div>
        <div className="field md:col-span-2">
          <label htmlFor="payment_method">Payment</label>
          <select id="payment_method" name="payment_method" defaultValue="cod">
            <option value="cod">Cash on delivery</option>
            <option value="prepaid">Prepaid (manual confirm — Razorpay next)</option>
          </select>
        </div>
        <div className="field md:col-span-2">
          <label htmlFor="packing_notes">Order notes (optional)</label>
          <textarea id="packing_notes" name="packing_notes" rows={3} />
        </div>
        {error ? <p className="md:col-span-2 text-sm text-warn">{error}</p> : null}
        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </div>
      </div>

      <aside className="surface-card h-fit p-6">
        <p className="text-sm font-semibold text-forest">Order summary</p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {lines.map((l) => (
            <li key={l.variantId} className="flex justify-between gap-3">
              <span>
                {l.name} · {l.variantLabel} × {l.qty}
              </span>
              <span className="shrink-0 text-ink">{formatInr(l.priceInr * l.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-line pt-3 font-semibold text-forest">
          <span>Total</span>
          <span>{formatInr(subtotalInr)}</span>
        </p>
      </aside>
    </form>
  );
}
