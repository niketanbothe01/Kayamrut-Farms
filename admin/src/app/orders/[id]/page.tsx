import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { OrderFulfillmentPanel } from "@/components/OrderFulfillmentPanel";
import { getOrder, orders } from "@/data/fixtures";

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
      <OrderFulfillmentPanel order={order} />
    </AdminShell>
  );
}
