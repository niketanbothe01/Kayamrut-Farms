"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/types";
import { fetchProducts } from "@/lib/catalog";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchProducts();
        if (!cancelled) setProducts(list.slice(0, 4));
      } catch {
        if (!cancelled) setError("Catalog unavailable — start the API (`make up`).");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="mt-8 text-sm text-warn">{error}</p>;
  if (products.length === 0) {
    return (
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="surface-card h-64 animate-pulse bg-cream-strong" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
