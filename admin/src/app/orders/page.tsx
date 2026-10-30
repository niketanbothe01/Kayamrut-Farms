import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { formatInr, orders } from "@/data/fixtures";

export const metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <AdminShell title="Orders">
      <div className="panel table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-semibold text-forest hover:underline"
                  >
                    {order.number}
                  </Link>
                  <p className="text-xs text-muted">{order.city}</p>
                </td>
                <td>
                  <p>{order.customerName}</p>
                  <p className="text-xs text-muted">{order.customerEmail}</p>
                </td>
                <td>
                  <span className={`badge badge-${order.status}`}>{order.status}</span>
                </td>
                <td>{order.itemCount}</td>
                <td className="font-semibold">{formatInr(order.totalInr)}</td>
                <td className="text-muted">{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
