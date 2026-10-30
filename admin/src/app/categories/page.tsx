"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import type { AdminCategory } from "@/data/types";
import { fetchAdminCategories } from "@/lib/admin-api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchAdminCategories();
        if (!cancelled) setCategories(list);
      } catch {
        if (!cancelled) setError("Failed to load categories.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminShell title="Categories">
      {error ? <p className="mb-3 text-sm text-warn">{error}</p> : null}
      <div className="panel table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Visible</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="font-semibold text-forest">{category.name}</td>
                <td className="text-muted">{category.slug}</td>
                <td>{category.productCount}</td>
                <td>{category.visible ? "Yes" : "No"}</td>
              </tr>
            ))}
            {!categories.length && !error ? (
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
