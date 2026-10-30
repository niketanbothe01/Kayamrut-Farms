import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { categories, productsByCategory } from "@/data/products";

export const metadata = {
  title: "Shop",
};

type ShopCatalogProps = {
  searchParams: Promise<{ category?: string }>;
};

export default function ShopPage({ searchParams }: ShopCatalogProps) {
  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">
        Shop
      </p>
      <h1 className="font-display mt-2 text-4xl text-forest">Shop</h1>
      <p className="mt-3 max-w-xl text-muted">
        Browse by category. Pick a size on the product page — checkout wiring
        comes after the backend.
      </p>
      <Suspense fallback={<ShopSkeleton />}>
        <ShopCatalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ShopCatalog({ searchParams }: ShopCatalogProps) {
  const params = await searchParams;
  const category = params.category ?? "all";
  const list = productsByCategory(category === "all" ? undefined : category);
  const activeName =
    category === "all"
      ? "All products"
      : categories.find((c) => c.slug === category)?.name ?? "Shop";

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

      {list.length === 0 ? (
        <p className="mt-12 text-muted">No products in this category yet.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((product) => (
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
