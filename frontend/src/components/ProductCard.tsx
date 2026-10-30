import Link from "next/link";
import { formatInr, type Product } from "@/data/types";

export function ProductCard({ product }: { product: Product }) {
  const variant = product.variants[0];
  const soldOut = product.variants.every((v) => !v.inStock);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="surface-card group flex flex-col overflow-hidden transition-[border-color,box-shadow] hover:border-forest/25"
    >
      <div
        className="accent-swatch relative aspect-[4/3] w-full"
        data-accent={product.accent}
      >
        <div className="absolute inset-0 flex items-end p-4">
          <span className="rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold text-forest">
            {product.category}
          </span>
        </div>
        {product.badges?.[0] ? (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[0.7rem] font-bold text-forest-deep">
            {product.badges[0]}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-xl text-forest group-hover:text-forest-soft">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{product.tagline}</p>
        <p className="mt-auto pt-2 text-sm font-semibold text-forest">
          {soldOut
            ? "Sold out"
            : variant
              ? `From ${formatInr(variant.priceInr)}`
              : "View options"}
        </p>
      </div>
    </Link>
  );
}
