"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { formatInr, type AdminOrder, type AdminProduct, type DashboardStats } from "@/data/types";
import { fetchAdminOrders, fetchAdminProducts, fetchDashboard } from "@/lib/admin-api";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [dashboard, orderList, productList] = await Promise.all([
          fetchDashboard(),
          fetchAdminOrders(),
          fetchAdminProducts(),
        ]);
        if (!cancelled) {
          setStats(dashboard);
          setOrders(orderList);
          setProducts(productList);
        }
      } catch {
        if (!cancelled) setError("Failed to load dashboard from API.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminShell title="Dashboard">
      {error ? <p className="mb-4 text-sm text-warn">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active products" value={stats ? String(stats.activeProducts) : "—"} />
        <Stat label="Open orders" value={stats ? String(stats.openOrders) : "—"} />
        <Stat
          label="Low stock SKUs"
          value={stats ? String(stats.lowStockSkus) : "—"}
          tone="warn"
        />
        <Stat
          label="Paid GMV"
          value={stats ? formatInr(stats.paidGmvInr) : "—"}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-forest">Recent orders</h2>
            <Link href="/orders" className="text-sm font-semibold text-gold-ink">
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {orders.slice(0, 4).map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0"
              >
                <div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-semibold text-forest hover:underline"
                  >
                    {order.number}
                  </Link>
                  <p className="text-sm text-muted">
                    {order.customerName} · {order.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatInr(order.totalInr)}</p>
                  <span className={`badge badge-ful-${order.fulfillmentStatus}`}>
                    {order.fulfillmentStatus.replaceAll("_", " ")}
                  </span>
                </div>
              </li>
            ))}
            {!orders.length && !error ? (
              <li className="text-sm text-muted">Loading…</li>
            ) : null}
          </ul>
        </section>

        <section className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-forest">Inventory watch</h2>
            <Link href="/products" className="text-sm font-semibold text-gold-ink">
              Manage
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {products
              .slice()
              .sort((a, b) => a.stockTotal - b.stockTotal)
              .slice(0, 5)
              .map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0"
                >
                  <div>
                    <Link
                      href={`/products/${product.id}`}
                      className="font-semibold text-forest hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-muted">{product.category}</p>
                  </div>
                  <p
                    className={`font-semibold ${
                      product.stockTotal < 20 ? "text-warn" : "text-ink"
                    }`}
                  >
                    {product.stockTotal} units
                  </p>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "warn";
}) {
  return (
    <div className="panel p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-3xl ${
          tone === "warn" ? "text-warn" : "text-forest"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
