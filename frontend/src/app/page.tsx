import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

export default function HomePage() {
  const featured = products.slice(0, 4);

  return (
    <>
      <section className="relative isolate min-h-[78vh] overflow-hidden bg-forest-deep text-cream">
        <Image
          src="/hero-forest-gold.jpg"
          alt="Kayamrut Farms A2 ghee jar in warm forest light"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/88 via-forest-deep/70 to-forest/35" />
        <div className="container-page relative flex min-h-[78vh] flex-col justify-center py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-bright">
            Organic · Herbal · Pure
          </p>
          <h1 className="font-display mt-4 max-w-xl text-5xl leading-[1.05] tracking-tight text-cream-strong md:text-6xl">
            Kayamrut Farms
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/85">
            Premium A2 ghee and farm-pure pantry staples — simple to shop, honest
            to cook with.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary">
              Shop products
            </Link>
            <Link href="/shop?category=a2-ghee" className="btn btn-secondary">
              Start with ghee
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">
              Shop by need
            </p>
            <h2 className="font-display mt-2 text-3xl text-forest md:text-4xl">
              Everyday essentials
            </h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-forest hover:text-gold-ink">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-cream-strong">
        <div className="container-page grid gap-10 py-16 md:grid-cols-3 md:py-20">
          {[
            {
              title: "Farm to home",
              body: "Sourced and prepared with care — no fillers, no confusion.",
            },
            {
              title: "Traditional methods",
              body: "Bilona-style ghee and cold-pressed oils that keep character.",
            },
            {
              title: "Easy to choose",
              body: "Clear sizes, plain prices, and a cart that stays simple.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-2xl text-forest">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="surface-card grid overflow-hidden md:grid-cols-2">
          <div className="accent-swatch min-h-56" data-accent="ghee" />
          <div className="flex flex-col justify-center p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">
              Our story
            </p>
            <h2 className="font-display mt-2 text-3xl text-forest">
              Nurturing health with nature
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Kayamrut Farms brings organic superfoods to your kitchen — from A2
              Gir cow ghee to cold-pressed oils and herbal powders.
            </p>
            <Link href="/about" className="btn btn-forest mt-6 w-fit">
              Read our story
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
