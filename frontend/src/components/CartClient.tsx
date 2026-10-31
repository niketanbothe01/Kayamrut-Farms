"use client";

import Image from "next/image";
import Link from "next/link";
import { formatInr } from "@/data/types";
import { useCart } from "@/lib/cart";

export function CartClient() {
  const { lines, subtotalInr, setQty, removeItem, ready } = useCart();

  if (!ready) {
    return <div className="mt-8 h-40 animate-pulse rounded-2xl bg-cream-strong" />;
  }

  if (lines.length === 0) {
    return (
      <div className="surface-card mt-8 max-w-xl p-8">
        <p className="text-muted">Your cart is empty. Browse the shop and add a size you like.</p>
        <Link href="/shop" className="btn btn-primary mt-6">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
      <ul className="space-y-4">
        {lines.map((line) => (
          <li
            key={line.variantId}
            className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-strong">
              {line.image ? (
                <Image
                  src={line.image}
                  alt={line.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                  unoptimized
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/product/${line.slug}`} className="font-semibold text-forest hover:underline">
                {line.name}
              </Link>
              <p className="text-sm text-muted">{line.variantLabel}</p>
              <p className="mt-1 font-medium text-ink">{formatInr(line.priceInr)}</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="sr-only" htmlFor={`qty-${line.variantId}`}>
                Quantity
              </label>
              <input
                id={`qty-${line.variantId}`}
                type="number"
                min={1}
                max={20}
                value={line.qty}
                onChange={(e) => setQty(line.variantId, Number(e.target.value) || 1)}
                className="w-16 rounded-lg border border-line bg-cream px-2 py-1.5 text-sm"
              />
              <button
                type="button"
                className="text-sm text-muted underline hover:text-forest"
                onClick={() => removeItem(line.variantId)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <aside className="surface-card h-fit p-6">
        <p className="text-sm text-muted">Subtotal</p>
        <p className="font-display mt-1 text-3xl text-forest">{formatInr(subtotalInr)}</p>
        <p className="mt-2 text-xs text-muted">Shipping calculated at checkout. Taxes included where applicable.</p>
        <Link href="/checkout" className="btn btn-primary mt-6 w-full justify-center">
          Checkout
        </Link>
        <Link href="/shop" className="btn btn-forest mt-3 w-full justify-center">
          Keep shopping
        </Link>
      </aside>
    </div>
  );
}
