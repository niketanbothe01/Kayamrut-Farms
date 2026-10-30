import Link from "next/link";
import { notFound } from "next/navigation";
import { formatInr, getProduct, products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product" };
  return { title: product.name, description: product.tagline };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const defaultVariant = product.variants.find((v) => v.inStock) ?? product.variants[0];

  return (
    <div className="container-page py-10 md:py-14">
      <Link href="/shop" className="text-sm font-semibold text-muted hover:text-forest">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div
          className="accent-swatch min-h-80 rounded-[calc(var(--radius)+0.15rem)]"
          data-accent={product.accent}
        />

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
                <li
                  key={variant.id}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                    variant.id === defaultVariant.id
                      ? "border-forest bg-cream-strong"
                      : "border-line"
                  } ${variant.inStock ? "" : "opacity-55"}`}
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
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" disabled={!defaultVariant.inStock}>
              {defaultVariant.inStock ? "Add to cart" : "Notify me later"}
            </button>
            <Link href="/cart" className="btn btn-forest">
              Go to cart
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted">
            Cart actions are UI-only until the Laravel API is connected.
          </p>
        </div>
      </div>
    </div>
  );
}
