import Link from "next/link";
import { ProductDetail } from "@/components/ProductDetail";
import { fetchProductSlugs } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const FALLBACK_SLUGS = [
  "a2-gir-cow-ghee",
  "cold-pressed-sunflower-oil",
  "cold-pressed-coconut-oil",
  "organic-moringa-powder",
  "organic-ashwagandha-powder",
  "organic-makhana",
];

export async function generateStaticParams() {
  try {
    const slugs = await fetchProductSlugs();
    if (slugs.length) return slugs.map((slug) => ({ slug }));
  } catch {
    // API may be offline during Cloudflare build — fall back to known slugs.
  }
  return FALLBACK_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  return {
    title: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <div className="container-page py-10 md:py-14">
      <Link href="/shop" className="text-sm font-semibold text-muted hover:text-forest">
        ← Back to shop
      </Link>
      <ProductDetail slug={slug} />
    </div>
  );
}
