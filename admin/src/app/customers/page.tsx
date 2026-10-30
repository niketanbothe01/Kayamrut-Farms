"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { formatInr, type AdminCustomer } from "@/data/types";
import { fetchAdminCustomers } from "@/lib/admin-api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchAdminCustomers();
        if (!cancelled) setCustomers(list);
      } catch {
        if (!cancelled) setError("Failed to load customers.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminShell title="Customers">
      {error ? <p className="mb-3 text-sm text-warn">{error}</p> : null}
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
                <td>{formatInr(c.spentInr)}</td>
              </tr>
            ))}
            {!customers.length && !error ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
