"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { OrdersWorkbench } from "@/components/OrdersWorkbench";
import type { AdminOrder } from "@/data/types";
import { fetchAdminOrders } from "@/lib/admin-api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchAdminOrders();
        if (!cancelled) setOrders(list);
      } catch {
        if (!cancelled) setError("Failed to load orders.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminShell title="Orders & fulfillment">
      <p className="mb-4 max-w-3xl text-sm text-muted">
        Track packing and delivery separately from payment. Bulk actions call the
        live Laravel API.
      </p>
      {error ? <p className="mb-3 text-sm text-warn">{error}</p> : null}
      {orders ? (
        <OrdersWorkbench initialOrders={orders} />
      ) : (
        <p className="text-sm text-muted">Loading orders…</p>
      )}
    </AdminShell>
  );
}
