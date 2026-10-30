"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { OrderFulfillmentPanel } from "@/components/OrderFulfillmentPanel";
import type { AdminOrder } from "@/data/types";
import { fetchAdminOrder } from "@/lib/admin-api";

export function OrderDetailClient({ id }: { id: string }) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAdminOrder(id);
        if (!cancelled) setOrder(data);
      } catch {
        if (!cancelled) setError("Order not found or API error.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <AdminShell
      title={order?.number ?? "Order"}
      actions={
        <Link href="/orders" className="btn btn-ghost">
          Back to orders
        </Link>
      }
    >
      {error ? <p className="text-sm text-warn">{error}</p> : null}
      {!order && !error ? <p className="text-sm text-muted">Loading…</p> : null}
      {order ? <OrderFulfillmentPanel order={order} /> : null}
    </AdminShell>
  );
}
