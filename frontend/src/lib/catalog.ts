import { apiGet } from "@/lib/api";
import type { Product, ProductVariant } from "@/data/types";

type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  product_count: number;
};

type ApiProductCard = {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  category: string | null;
  category_slug: string | null;
  badges: string[];
  accent: Product["accent"] | null;
  price_from_inr: number | null;
  from_label: string | null;
};

type ApiProductDetail = ApiProductCard & {
  description: string | null;
  variants: {
    id: number;
    sku: string;
    label: string;
    price_inr: number;
    compare_at_inr: number | null;
    stock: number;
    in_stock: boolean;
  }[];
};

function mapAccent(value: string | null | undefined): Product["accent"] {
  if (value === "ghee" || value === "oil" || value === "powder" || value === "seed" || value === "makhana") {
    return value;
  }
  return "ghee";
}

function mapVariants(
  variants: ApiProductDetail["variants"] | undefined,
  priceFrom?: number | null,
  fromLabel?: string | null,
): ProductVariant[] {
  if (variants?.length) {
    return variants.map((v) => ({
      id: String(v.id),
      label: v.label,
      priceInr: v.price_inr,
      compareAtInr: v.compare_at_inr ?? undefined,
      inStock: v.in_stock,
    }));
  }
  if (priceFrom != null) {
    return [
      {
        id: "from",
        label: fromLabel ?? "From",
        priceInr: priceFrom,
        inStock: true,
      },
    ];
  }
  return [];
}

function mapCard(p: ApiProductCard): Product {
  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    category: p.category ?? "",
    categorySlug: p.category_slug ?? "",
    tagline: p.tagline ?? "",
    description: "",
    badges: p.badges ?? [],
    accent: mapAccent(p.accent),
    variants: mapVariants(undefined, p.price_from_inr, p.from_label),
  };
}

function mapDetail(p: ApiProductDetail): Product {
  return {
    ...mapCard(p),
    description: p.description ?? "",
    variants: mapVariants(p.variants, p.price_from_inr, p.from_label),
  };
}

export async function fetchCategories() {
  const json = await apiGet<{ data: ApiCategory[] }>("/categories");
  return json.data.map((c) => ({ slug: c.slug, name: c.name }));
}

export async function fetchProducts(category?: string) {
  const qs = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
  const json = await apiGet<{ data: ApiProductCard[] }>(`/products${qs}`);
  return json.data.map(mapCard);
}

export async function fetchProduct(slug: string) {
  const json = await apiGet<{ data: ApiProductDetail }>(`/products/${encodeURIComponent(slug)}`);
  return mapDetail(json.data);
}

export async function fetchProductSlugs(): Promise<string[]> {
  const products = await fetchProducts();
  return products.map((p) => p.slug);
}
