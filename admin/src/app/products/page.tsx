"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { formatInr, type AdminProduct } from "@/data/types";
import { fetchAdminProducts } from "@/lib/admin-api";

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchAdminProducts();
        if (!cancelled) setProducts(list);
      } catch {
        if (!cancelled) setError("Failed to load products.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminShell
      title="Products"
      actions={
        <Link href="/products/new" className="btn btn-primary">
          Add product
        </Link>
      }
    >
      {error ? <p className="mb-3 text-sm text-warn">{error}</p> : null}
      <div className="panel table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Status</th>
              <th>From</th>
              <th>Stock</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Link
                    href={`/products/${product.id}`}
                    className="font-semibold text-forest hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted">{product.slug}</p>
                </td>
                <td>{product.category}</td>
                <td>
                  <span className={`badge badge-${product.status}`}>
                    {product.status}
                  </span>
                </td>
                <td>{formatInr(product.priceFromInr)}</td>
                <td className={product.stockTotal < 20 ? "text-warn font-semibold" : ""}>
                  {product.stockTotal}
                </td>
                <td className="text-muted">{product.updatedAt}</td>
              </tr>
            ))}
            {!products.length && !error ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
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
