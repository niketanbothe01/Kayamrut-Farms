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

export const categories = [
  { slug: "a2-ghee", name: "A2 Ghee" },
  { slug: "cold-pressed", name: "Cold Pressed" },
  { slug: "powders", name: "Organic Powders" },
  { slug: "seeds", name: "Seeds" },
  { slug: "makhana", name: "Makhana" },
] as const;

export const products: Product[] = [
  {
    id: "p-ghee",
    slug: "a2-gir-cow-ghee",
    name: "A2 Gir Cow Ghee",
    category: "A2 Ghee",
    categorySlug: "a2-ghee",
    tagline: "Everyday ghee, traditionally prepared.",
    description:
      "Crafted from the milk of free-grazing Gir cows. Pure, wholesome, and made for daily cooking — from tadka to sweets.",
    badges: ["Bestseller"],
    accent: "ghee",
    variants: [
      { id: "ghee-250", label: "250 ml", priceInr: 549, compareAtInr: 649, inStock: true },
      { id: "ghee-500", label: "500 ml", priceInr: 999, compareAtInr: 1199, inStock: true },
      { id: "ghee-1l", label: "1 Litre", priceInr: 1899, compareAtInr: 2199, inStock: true },
    ],
  },
  {
    id: "p-sunflower",
    slug: "cold-pressed-sunflower-oil",
    name: "Cold Pressed Sunflower Oil",
    category: "Cold Pressed",
    categorySlug: "cold-pressed",
    tagline: "Unrefined. Naturally rich in Vitamin E.",
    description:
      "Slow cold-pressed oil that keeps nutrients intact — ideal for everyday Indian cooking without the heaviness of refined oils.",
    accent: "oil",
    variants: [
      { id: "sf-500", label: "500 ml", priceInr: 275, inStock: true },
      { id: "sf-1l", label: "1 Litre", priceInr: 499, inStock: true },
    ],
  },
  {
    id: "p-coconut",
    slug: "cold-pressed-coconut-oil",
    name: "Cold Pressed Coconut Oil",
    category: "Cold Pressed",
    categorySlug: "cold-pressed",
    tagline: "Pure coconut, nothing added.",
    description:
      "Cold-pressed from fresh coconuts. Use for cooking, hair care, or a spoon of everyday nourishment.",
    accent: "oil",
    variants: [
      { id: "co-500", label: "500 ml", priceInr: 449, inStock: true },
      { id: "co-1l", label: "1 Litre", priceInr: 799, inStock: false },
    ],
  },
  {
    id: "p-moringa",
    slug: "organic-moringa-powder",
    name: "Organic Moringa Powder",
    category: "Organic Powders",
    categorySlug: "powders",
    tagline: "Super greens for daily vitality.",
    description:
      "Farm-grown moringa leaf powder — add to smoothies, warm water, or dosa batter for a simple nutrition lift.",
    badges: ["Popular"],
    accent: "powder",
    variants: [
      { id: "mo-100", label: "100 g", priceInr: 249, inStock: true },
      { id: "mo-200", label: "200 g", priceInr: 449, inStock: true },
    ],
  },
  {
    id: "p-ashwa",
    slug: "organic-ashwagandha-powder",
    name: "Organic Ashwagandha Powder",
    category: "Organic Powders",
    categorySlug: "powders",
    tagline: "Root powder for calm strength.",
    description:
      "100% pure ashwagandha root powder — traditionally used to support stress balance and everyday stamina.",
    accent: "powder",
    variants: [{ id: "as-100", label: "100 g", priceInr: 299, inStock: true }],
  },
  {
    id: "p-shatavari",
    slug: "organic-shatavari-powder",
    name: "Organic Shatavari Powder",
    category: "Organic Powders",
    categorySlug: "powders",
    tagline: "Queen of herbs for women’s wellness.",
    description:
      "Pure shatavari powder for daily herbal routines — mix with warm milk or water.",
    accent: "powder",
    variants: [{ id: "sh-100", label: "100 g", priceInr: 329, inStock: true }],
  },
  {
    id: "p-pumpkin",
    slug: "pumpkin-seeds",
    name: "Pumpkin Seeds",
    category: "Seeds",
    categorySlug: "seeds",
    tagline: "Magnesium, zinc, and clean snacking.",
    description:
      "Fresh, unprocessed pumpkin seeds — roast lightly or sprinkle on salads and breakfast bowls.",
    accent: "seed",
    variants: [
      { id: "ps-200", label: "200 g", priceInr: 199, inStock: true },
      { id: "ps-500", label: "500 g", priceInr: 449, inStock: true },
    ],
  },
  {
    id: "p-makhana",
    slug: "organic-makhana",
    name: "Organic Makhana",
    category: "Makhana",
    categorySlug: "makhana",
    tagline: "Light, crunchy, farm-sourced.",
    description:
      "Crisp fox nuts for mindful snacking — roast with ghee and rock salt for a classic treat.",
    accent: "makhana",
    variants: [
      { id: "mk-200", label: "200 g", priceInr: 249, inStock: true },
      { id: "mk-500", label: "500 g", priceInr: 549, inStock: true },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(categorySlug?: string) {
  if (!categorySlug || categorySlug === "all") return products;
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
