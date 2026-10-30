"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/types";
import { fetchCategories, fetchProducts } from "@/lib/catalog";

export function ShopCatalog() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "all";
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [cats, list] = await Promise.all([
          fetchCategories(),
          fetchProducts(category === "all" ? undefined : category),
        ]);
        if (!cancelled) {
          setCategories(cats);
          setProducts(list);
        }
      } catch {
        if (!cancelled) setError("Could not load catalog from API. Is the backend running?");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category]);

  const activeName = useMemo(() => {
    if (category === "all") return "All products";
    return categories.find((c) => c.slug === category)?.name ?? "Shop";
  }, [category, categories]);

  if (loading) return <ShopSkeleton />;
  if (error) return <p className="mt-8 text-warn">{error}</p>;

  return (
    <>
      <p className="mt-2 text-sm font-medium text-forest">{activeName}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <CategoryChip href="/shop" active={category === "all"} label="All" />
        {categories.map((c) => (
          <CategoryChip
            key={c.slug}
            href={`/shop?category=${c.slug}`}
            active={category === c.slug}
            label={c.name}
          />
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-12 text-muted">No products in this category yet.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}

function ShopSkeleton() {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="surface-card h-72 animate-pulse bg-cream-strong" />
      ))}
    </div>
  );
}

function CategoryChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "border-forest bg-forest text-cream"
          : "border-line bg-cream-strong text-forest hover:border-forest/30"
      }`}
    >
      {label}
    </Link>
  );
}
