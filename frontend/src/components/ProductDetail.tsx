"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatInr, type Product } from "@/data/types";
import { useCart } from "@/lib/cart";
import { fetchProduct } from "@/lib/catalog";

export function ProductDetail({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProduct(slug);
        if (!cancelled) {
          setProduct(data);
          const first = data.variants.find((v) => v.inStock) ?? data.variants[0];
          setSelectedId(first?.id ?? null);
        }
      } catch {
        if (!cancelled) setError("Product not found or API unreachable.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) {
    return <p className="mt-8 text-warn">{error}</p>;
  }

  if (!product) {
    return <div className="mt-8 h-80 animate-pulse rounded-2xl bg-cream-strong" />;
  }

  const selected =
    product.variants.find((v) => v.id === selectedId) ??
    product.variants.find((v) => v.inStock) ??
    product.variants[0];

  function onAdd() {
    if (!product || !selected?.inStock) return;
    addItem({
      variantId: selected.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantLabel: selected.label,
      priceInr: selected.priceInr,
      image: product.image,
      qty: 1,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="relative min-h-80 overflow-hidden rounded-[calc(var(--radius)+0.15rem)] bg-cream-strong">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            unoptimized
          />
        ) : (
          <div className="accent-swatch h-full min-h-80 w-full" data-accent={product.accent} />
        )}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">
          {product.category}
        </p>
        <h1 className="font-display mt-2 text-4xl text-forest md:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 text-lg text-muted">{product.tagline}</p>
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink/80">
          {product.description}
        </p>

        <div className="mt-8">
          <p className="text-sm font-semibold text-forest">Choose size</p>
          <ul className="mt-3 space-y-2">
            {product.variants.map((variant) => (
              <li key={variant.id}>
                <button
                  type="button"
                  disabled={!variant.inStock}
                  onClick={() => setSelectedId(variant.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                    variant.id === selected?.id
                      ? "border-forest bg-cream-strong"
                      : "border-line hover:border-forest/40"
                  } ${variant.inStock ? "" : "cursor-not-allowed opacity-55"}`}
                >
                  <span className="font-medium text-ink">
                    {variant.label}
                    {!variant.inStock ? (
                      <span className="ml-2 text-xs text-muted">Sold out</span>
                    ) : null}
                  </span>
                  <span className="font-semibold text-forest">
                    {formatInr(variant.priceInr)}
                    {variant.compareAtInr ? (
                      <span className="ml-2 text-sm font-normal text-muted line-through">
                        {formatInr(variant.compareAtInr)}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-primary"
            disabled={!selected?.inStock}
            onClick={onAdd}
          >
            {selected?.inStock ? (added ? "Added" : "Add to cart") : "Notify me later"}
          </button>
          <Link href="/cart" className="btn btn-forest">
            Go to cart
          </Link>
        </div>
      </div>
    </div>
  );
}
