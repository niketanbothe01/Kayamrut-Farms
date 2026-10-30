"use client";

import { useMemo, useState } from "react";
import {
  FULFILLMENT_LABELS,
  FULFILLMENT_STEPS,
  type AdminOrder,
  type FulfillmentStatus,
  formatInr,
} from "@/data/fixtures";

type Props = { order: AdminOrder };

export function OrderFulfillmentPanel({ order: initial }: Props) {
  const [order, setOrder] = useState(initial);
  const [carrier, setCarrier] = useState(order.shipment?.carrier ?? "Delhivery");
  const [trackingNumber, setTrackingNumber] = useState(
    order.shipment?.trackingNumber ?? "",
  );
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    order.shipment?.estimatedDelivery ?? "",
  );
  const [packingNotes, setPackingNotes] = useState(order.packingNotes ?? "");
  const [message, setMessage] = useState<string | null>(null);

  const stepIndex = useMemo(() => {
    const idx = FULFILLMENT_STEPS.indexOf(order.fulfillmentStatus);
    return idx;
  }, [order.fulfillmentStatus]);

  function stamp(label: string) {
    return {
      at: new Date().toISOString().slice(0, 16).replace("T", " "),
      label,
    };
  }

  function setStatus(next: FulfillmentStatus, label: string) {
    setOrder((prev) => ({
      ...prev,
      fulfillmentStatus: next,
      timeline: [...prev.timeline, stamp(label)],
      shipment:
        next === "shipped" ||
        next === "out_for_delivery" ||
        next === "delivered"
          ? {
              carrier,
              trackingNumber: trackingNumber || prev.shipment?.trackingNumber || "PENDING",
              shippedAt:
                prev.shipment?.shippedAt ||
                (next === "shipped"
                  ? new Date().toISOString().slice(0, 10)
                  : undefined),
              estimatedDelivery: estimatedDelivery || prev.shipment?.estimatedDelivery,
              deliveredAt:
                next === "delivered"
                  ? new Date().toISOString().slice(0, 16).replace("T", " ")
                  : prev.shipment?.deliveredAt,
            }
          : prev.shipment,
      packingNotes,
    }));
    setMessage(
      `Saved locally: ${FULFILLMENT_LABELS[next]}. Will call PATCH /api/admin/orders/${order.id} + shipment fields.`,
    );
  }

  function saveShipment() {
    if (!trackingNumber.trim()) {
      setMessage("Add a tracking / AWB number before saving shipment.");
      return;
    }
    setOrder((prev) => ({
      ...prev,
      fulfillmentStatus:
        prev.fulfillmentStatus === "ready_to_ship" ||
        prev.fulfillmentStatus === "packing" ||
        prev.fulfillmentStatus === "to_pack"
          ? "shipped"
          : prev.fulfillmentStatus,
      shipment: {
        carrier,
        trackingNumber: trackingNumber.trim(),
        estimatedDelivery: estimatedDelivery || undefined,
        shippedAt:
          prev.shipment?.shippedAt || new Date().toISOString().slice(0, 10),
        deliveredAt: prev.shipment?.deliveredAt,
      },
      packingNotes,
      timeline: [
        ...prev.timeline,
        stamp(`Shipment updated · ${carrier} · ${trackingNumber.trim()}`),
      ],
    }));
    setMessage("Shipment details saved (fixture). API: PATCH .../shipment");
  }

  const canFulfill = order.paymentStatus === "paid";

  return (
    <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
      <div className="space-y-4">
        <section className="panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl text-forest">Delivery status</h2>
              <p className="mt-1 text-sm text-muted">
                Payment:{" "}
                <span className={`badge badge-${order.paymentStatus}`}>
                  {order.paymentStatus}
                </span>
              </p>
            </div>
            <span className={`badge badge-ful-${order.fulfillmentStatus}`}>
              {FULFILLMENT_LABELS[order.fulfillmentStatus]}
            </span>
          </div>

          <ol className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {FULFILLMENT_STEPS.map((step, i) => {
              const active = step === order.fulfillmentStatus;
              const done = stepIndex >= 0 && i <= stepIndex;
              return (
                <li
                  key={step}
                  className={`rounded-lg border px-2 py-3 text-center text-[0.7rem] font-semibold leading-tight ${
                    active
                      ? "border-forest bg-forest text-white"
                      : done
                        ? "border-forest/30 bg-cream text-forest"
                        : "border-line text-muted"
                  }`}
                >
                  {FULFILLMENT_LABELS[step]}
                </li>
              );
            })}
          </ol>

          {!canFulfill ? (
            <p className="mt-4 text-sm text-warn">
              Fulfillment actions unlock after payment is confirmed.
            </p>
          ) : (
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStatus("packing", "Packing started")}
              >
                Start packing
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStatus("ready_to_ship", "Marked ready to ship")}
              >
                Ready to ship
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStatus("shipped", "Marked shipped")}
              >
                Mark shipped
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStatus("out_for_delivery", "Out for delivery")}
              >
                Out for delivery
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStatus("delivered", "Delivered to customer")}
              >
                Mark delivered
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStatus("cancelled", "Order cancelled")}
              >
                Cancel order
              </button>
            </div>
          )}
          {message ? (
            <p className="mt-4 rounded-lg bg-cream px-3 py-2 text-xs text-forest">
              {message}
            </p>
          ) : null}
        </section>

        <section className="panel p-5">
          <h2 className="font-display text-xl text-forest">Shipment / AWB</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="field">
              <label htmlFor="carrier">Carrier</label>
              <select
                id="carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
              >
                <option>Delhivery</option>
                <option>Shiprocket / Bluedart</option>
                <option>DTDC</option>
                <option>India Post</option>
                <option>Self / local courier</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="awb">Tracking / AWB</label>
              <input
                id="awb"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. DLV88221045"
              />
            </div>
            <div className="field">
              <label htmlFor="eta">Estimated delivery</label>
              <input
                id="eta"
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="notes">Packing notes</label>
              <input
                id="notes"
                value={packingNotes}
                onChange={(e) => setPackingNotes(e.target.value)}
                placeholder="Fragile / gift note / recipe card"
              />
            </div>
          </div>
          <button type="button" className="btn btn-primary mt-4" onClick={saveShipment}>
            Save shipment & mark shipped
          </button>
        </section>

        <section className="panel p-5">
          <h2 className="font-display text-xl text-forest">Line items</h2>
          <ul className="mt-3 divide-y divide-[var(--line)] text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold text-forest">{item.title}</p>
                  <p className="text-xs text-muted">
                    {item.sku} · qty {item.qty}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatInr(item.unitPriceInr * item.qty)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-line pt-3 font-semibold">
            <span>Total</span>
            <span>{formatInr(order.totalInr)}</span>
          </div>
        </section>
      </div>

      <div className="space-y-4">
        <section className="panel p-5">
          <h2 className="font-display text-xl text-forest">Ship to</h2>
          <p className="mt-3 text-sm font-semibold">{order.customerName}</p>
          <p className="text-sm text-muted">{order.phone}</p>
          <p className="text-sm text-muted">{order.customerEmail}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            {order.address}
            <br />
            {order.city} {order.pincode}
          </p>
        </section>

        <section className="panel p-5">
          <h2 className="font-display text-xl text-forest">Timeline</h2>
          <ol className="mt-4 space-y-3">
            {[...order.timeline].reverse().map((event, i) => (
              <li key={`${event.at}-${i}`} className="border-l-2 border-forest/30 pl-3">
                <p className="text-sm font-semibold text-forest">{event.label}</p>
                <p className="text-xs text-muted">{event.at}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
