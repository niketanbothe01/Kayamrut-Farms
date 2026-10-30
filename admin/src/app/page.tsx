import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { formatInr, orders, products } from "@/data/fixtures";

export default function DashboardPage() {
  const activeProducts = products.filter((p) => p.status === "active").length;
  const lowStock = products.filter((p) => p.stockTotal > 0 && p.stockTotal < 20).length;
  const openOrders = orders.filter((o) =>
    ["pending", "paid", "processing"].includes(o.status),
  ).length;
  const revenue = orders
    .filter((o) => o.status !== "cancelled" && o.status !== "pending")
    .reduce((sum, o) => sum + o.totalInr, 0);

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active products" value={String(activeProducts)} />
        <Stat label="Open orders" value={String(openOrders)} />
        <Stat label="Low stock SKUs" value={String(lowStock)} tone="warn" />
        <Stat label="Paid GMV (fixture)" value={formatInr(revenue)} />
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
                  <span className={`badge badge-${order.status}`}>{order.status}</span>
                </div>
              </li>
            ))}
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
