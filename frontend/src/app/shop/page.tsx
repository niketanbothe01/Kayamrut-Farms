import { Suspense } from "react";
import { ShopCatalog } from "@/components/ShopCatalog";

export const metadata = {
  title: "Shop",
};

export default function ShopPage() {
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
        <ShopCatalog />
      </Suspense>
    </div>
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
