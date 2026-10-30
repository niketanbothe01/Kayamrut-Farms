import { AdminShell } from "@/components/AdminShell";
import { OrdersWorkbench } from "@/components/OrdersWorkbench";
import { orders } from "@/data/fixtures";

export const metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <AdminShell title="Orders & fulfillment">
      <p className="mb-4 max-w-3xl text-sm text-muted">
        Track packing and delivery separately from payment. Select multiple paid
        orders to prepare in bulk, or open an order to update AWB / status.
      </p>
      <OrdersWorkbench initialOrders={orders} />
    </AdminShell>
  );
}
