"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatInr } from "@/data/types";
import { fetchGuestOrder, type PlacedOrder } from "@/lib/checkout";

export function OrderConfirmClient() {
  const searchParams = useSearchParams();
  const number = searchParams.get("number") ?? "";
  const email = searchParams.get("email") ?? "";
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!number || !email) {
      setError("Missing order details — open the link from checkout.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchGuestOrder(number, email);
        if (!cancelled) setOrder(data);
      } catch {
        if (!cancelled) setError("Could not load this order. Check the link or contact us.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [number, email]);

  if (error) {
    return (
      <div className="surface-card mt-8 max-w-xl p-8">
        <p className="text-warn">{error}</p>
        <Link href="/shop" className="btn btn-primary mt-6">
          Back to shop
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="mt-8 h-48 animate-pulse rounded-2xl bg-cream-strong" />;
  }

  return (
    <div className="surface-card mt-8 max-w-2xl p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-ink">
        Order confirmed
      </p>
      <h2 className="font-display mt-2 text-3xl text-forest">{order.number}</h2>
      <p className="mt-3 text-muted">
        Thanks, {order.customer_name}. We’ll pack soon
        {order.fulfillment_status === "to_pack" ? " for cash on delivery" : ""}.
      </p>
      <ul className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
        {order.items.map((item) => (
          <li key={`${item.sku}-${item.qty}`} className="flex justify-between gap-4">
            <span>
              {item.title} × {item.qty}
            </span>
            <span>{formatInr(item.line_total_inr)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex justify-between border-t border-line pt-4 font-semibold text-forest">
        <span>Total</span>
        <span>{formatInr(order.total_inr)}</span>
      </p>
      <p className="mt-4 text-sm text-muted">
        Ship to {order.address}, {order.city} {order.pincode}. Noted for {order.customer_email}.
      </p>
      <Link href="/shop" className="btn btn-forest mt-8">
        Continue shopping
      </Link>
    </div>
  );
}
