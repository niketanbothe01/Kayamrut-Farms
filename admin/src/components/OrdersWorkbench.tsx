"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FULFILLMENT_LABELS,
  type AdminOrder,
  type FulfillmentStatus,
  formatInr,
  PACK_PIPELINE,
} from "@/data/types";
import { bulkUpdateOrders, fetchAdminOrders } from "@/lib/admin-api";

const FILTERS: { id: "all" | "needs_action" | FulfillmentStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "needs_action", label: "Needs action" },
  { id: "to_pack", label: "To pack" },
  { id: "packing", label: "Packing" },
  { id: "ready_to_ship", label: "Ready to ship" },
  { id: "shipped", label: "Shipped" },
  { id: "out_for_delivery", label: "Out for delivery" },
  { id: "delivered", label: "Delivered" },
  { id: "awaiting_payment", label: "Awaiting payment" },
  { id: "cancelled", label: "Cancelled" },
];

type Props = { initialOrders: AdminOrder[] };

export function OrdersWorkbench({ initialOrders }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("needs_action");
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const visible = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "needs_action") {
      return orders.filter((o) =>
        ["to_pack", "packing", "ready_to_ship", "out_for_delivery"].includes(
          o.fulfillmentStatus,
        ),
      );
    }
    return orders.filter((o) => o.fulfillmentStatus === filter);
  }, [orders, filter]);

  const allVisibleSelected =
    visible.length > 0 && visible.every((o) => selected.includes(o.id));

  function toggleAllVisible() {
    if (allVisibleSelected) {
      setSelected((prev) => prev.filter((id) => !visible.some((o) => o.id === id)));
      return;
    }
    setSelected((prev) => [...new Set([...prev, ...visible.map((o) => o.id)])]);
  }

  function toggleOne(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function applyBulk(next: FulfillmentStatus) {
    if (selected.length === 0) {
      setNotice("Select at least one order first.");
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const result = await bulkUpdateOrders(selected, next);
      const refreshed = await fetchAdminOrders();
      setOrders(refreshed);
      setNotice(
        `Updated ${result.updated} order(s) → ${FULFILLMENT_LABELS[next]}`,
      );
      setSelected([]);
    } catch {
      setNotice("Bulk update failed — check API / auth.");
    } finally {
      setBusy(false);
    }
  }

  function count(status: FulfillmentStatus | "needs_action") {
    if (status === "needs_action") {
      return orders.filter((o) =>
        ["to_pack", "packing", "ready_to_ship", "out_for_delivery"].includes(
          o.fulfillmentStatus,
        ),
      ).length;
    }
    return orders.filter((o) => o.fulfillmentStatus === status).length;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PipelineStat label="To pack" value={count("to_pack")} />
        <PipelineStat label="Packing" value={count("packing")} />
        <PipelineStat label="Ready to ship" value={count("ready_to_ship")} />
        <PipelineStat label="Out for delivery" value={count("out_for_delivery")} />
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
              filter === f.id
                ? "border-forest bg-forest text-white"
                : "border-line bg-panel text-forest hover:border-forest/30"
            }`}
          >
            {f.label}
            {f.id !== "all" && f.id !== "cancelled" ? (
              <span className="ml-1 opacity-70">
                (
                {f.id === "needs_action"
                  ? count("needs_action")
                  : count(f.id as FulfillmentStatus)}
                )
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="panel sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b-0 p-3 shadow-sm">
        <span className="text-sm font-semibold text-forest">
          Bulk prepare · {selected.length} selected
        </span>
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy}
          onClick={() => applyBulk("packing")}
        >
          Start packing
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={busy}
          onClick={() => applyBulk("ready_to_ship")}
        >
          Mark ready to ship
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={busy}
          onClick={() => applyBulk("shipped")}
        >
          Mark shipped
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={busy}
          onClick={() => applyBulk("out_for_delivery")}
        >
          Out for delivery
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={busy}
          onClick={() => applyBulk("delivered")}
        >
          Mark delivered
        </button>
      </div>

      {notice ? (
        <p className="rounded-lg border border-line bg-cream px-3 py-2 text-sm text-forest">
          {notice}
        </p>
      ) : null}

      <div className="panel table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th className="w-10">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAllVisible}
                  aria-label="Select all visible orders"
                />
              </th>
              <th>Order</th>
              <th>Customer</th>
              <th>Payment</th>
              <th>Delivery status</th>
              <th>Tracking</th>
              <th>Total</th>
              <th>Placed</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((order) => (
              <tr key={order.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(order.id)}
                    disabled={
                      order.paymentStatus !== "paid" &&
                      !PACK_PIPELINE.includes(order.fulfillmentStatus)
                    }
                    onChange={() => toggleOne(order.id)}
                    aria-label={`Select ${order.number}`}
                  />
                </td>
                <td>
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-semibold text-forest hover:underline"
                  >
                    {order.number}
                  </Link>
                  <p className="text-xs text-muted">
                    {order.itemCount} item(s) · {order.city}
                  </p>
                </td>
                <td>
                  <p>{order.customerName}</p>
                  <p className="text-xs text-muted">{order.customerEmail}</p>
                </td>
                <td>
                  <span className={`badge badge-${order.paymentStatus}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-ful-${order.fulfillmentStatus}`}>
                    {FULFILLMENT_LABELS[order.fulfillmentStatus]}
                  </span>
                </td>
                <td className="text-xs text-muted">
                  {order.shipment?.trackingNumber ? (
                    <>
                      <div className="font-semibold text-ink">
                        {order.shipment.carrier}
                      </div>
                      {order.shipment.trackingNumber}
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="font-semibold">{formatInr(order.totalInr)}</td>
                <td className="text-muted text-xs">{order.createdAt}</td>
              </tr>
            ))}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted">
                  No orders in this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PipelineStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl text-forest">{value}</p>
    </div>
  );
}
