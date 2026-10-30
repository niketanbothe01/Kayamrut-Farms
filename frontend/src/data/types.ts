export type ProductVariant = {
  id: string;
  label: string;
  priceInr: number;
  compareAtInr?: number;
  inStock: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  tagline: string;
  description: string;
  badges?: string[];
  variants: ProductVariant[];
  accent: "ghee" | "oil" | "powder" | "seed" | "makhana";
};

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
