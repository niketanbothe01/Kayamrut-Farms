import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { formatInr, getOrder, orders } from "@/data/fixtures";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const order = getOrder(id);
  return { title: order?.number ?? "Order" };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();

  return (
    <AdminShell
      title={order.number}
      actions={
        <Link href="/orders" className="btn btn-ghost">
          Back to orders
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="panel p-5">
          <h2 className="font-display text-xl text-forest">Summary</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Status</dt>
              <dd className="mt-1">
                <span className={`badge badge-${order.status}`}>{order.status}</span>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Total</dt>
              <dd className="mt-1 text-lg font-semibold">{formatInr(order.totalInr)}</dd>
            </div>
            <div>
              <dt className="text-muted">Customer</dt>
              <dd className="mt-1">
                {order.customerName}
                <br />
                <span className="text-muted">{order.customerEmail}</span>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Ship to</dt>
              <dd className="mt-1">{order.city}</dd>
            </div>
            <div>
              <dt className="text-muted">Placed</dt>
              <dd className="mt-1">{order.createdAt}</dd>
            </div>
            <div>
              <dt className="text-muted">Items</dt>
              <dd className="mt-1">{order.itemCount}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary">
              Mark processing
            </button>
            <button type="button" className="btn btn-ghost">
              Mark shipped
            </button>
            <button type="button" className="btn btn-ghost">
              Cancel
            </button>
          </div>
          <p className="mt-3 text-xs text-muted">
            Status changes → <code>PATCH /api/admin/orders/:id</code> + optional shipment
            payload.
          </p>
        </section>

        <section className="panel p-5">
          <h2 className="font-display text-xl text-forest">Line items</h2>
          <p className="mt-3 text-sm text-muted">
            Fixture placeholder. Real payload needs variant SKU, title snapshot, qty,
            unit price, line total.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between border-b border-line py-2">
              <span>A2 Gir Cow Ghee · 1 Litre</span>
              <span>{formatInr(order.totalInr)}</span>
            </li>
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
