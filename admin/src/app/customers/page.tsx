import { AdminShell } from "@/components/AdminShell";

export const metadata = { title: "Customers" };

const customers = [
  {
    id: "u1",
    name: "Ananya Shah",
    email: "ananya@example.com",
    orders: 3,
    spentInr: "₹4,280",
  },
  {
    id: "u2",
    name: "Rohit Mehta",
    email: "rohit@example.com",
    orders: 1,
    spentInr: "₹1,248",
  },
  {
    id: "u3",
    name: "Neha Iyer",
    email: "neha@example.com",
    orders: 2,
    spentInr: "₹2,110",
  },
];

export default function CustomersPage() {
  return (
    <AdminShell title="Customers">
      <div className="panel table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="font-semibold text-forest">{c.name}</td>
                <td>{c.email}</td>
                <td>{c.orders}</td>
                <td>{c.spentInr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        Needed APIs: <code>GET /api/admin/customers</code>, detail with addresses + order
        history. Guest checkouts may have email-only records.
      </p>
    </AdminShell>
  );
}
