export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: "draft" | "active" | "archived";
  priceFromInr: number;
  stockTotal: number;
  updatedAt: string;
};

export type AdminOrder = {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  totalInr: number;
  itemCount: number;
  createdAt: string;
  city: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  visible: boolean;
};

export const products: AdminProduct[] = [
  {
    id: "p-ghee",
    slug: "a2-gir-cow-ghee",
    name: "A2 Gir Cow Ghee",
    category: "A2 Ghee",
    status: "active",
    priceFromInr: 549,
    stockTotal: 128,
    updatedAt: "2026-10-28",
  },
  {
    id: "p-sunflower",
    slug: "cold-pressed-sunflower-oil",
    name: "Cold Pressed Sunflower Oil",
    category: "Cold Pressed",
    status: "active",
    priceFromInr: 275,
    stockTotal: 86,
    updatedAt: "2026-10-27",
  },
  {
    id: "p-coconut",
    slug: "cold-pressed-coconut-oil",
    name: "Cold Pressed Coconut Oil",
    category: "Cold Pressed",
    status: "active",
    priceFromInr: 449,
    stockTotal: 12,
    updatedAt: "2026-10-26",
  },
  {
    id: "p-moringa",
    slug: "organic-moringa-powder",
    name: "Organic Moringa Powder",
    category: "Organic Powders",
    status: "active",
    priceFromInr: 249,
    stockTotal: 64,
    updatedAt: "2026-10-25",
  },
  {
    id: "p-ashwa",
    slug: "organic-ashwagandha-powder",
    name: "Organic Ashwagandha Powder",
    category: "Organic Powders",
    status: "draft",
    priceFromInr: 299,
    stockTotal: 0,
    updatedAt: "2026-10-24",
  },
  {
    id: "p-makhana",
    slug: "organic-makhana",
    name: "Organic Makhana",
    category: "Makhana",
    status: "active",
    priceFromInr: 249,
    stockTotal: 40,
    updatedAt: "2026-10-22",
  },
];

export const orders: AdminOrder[] = [
  {
    id: "o-1004",
    number: "KF-1004",
    customerName: "Ananya Shah",
    customerEmail: "ananya@example.com",
    status: "paid",
    totalInr: 1899,
    itemCount: 1,
    createdAt: "2026-10-30",
    city: "Ahmedabad",
  },
  {
    id: "o-1003",
    number: "KF-1003",
    customerName: "Rohit Mehta",
    customerEmail: "rohit@example.com",
    status: "processing",
    totalInr: 1248,
    itemCount: 3,
    createdAt: "2026-10-29",
    city: "Pune",
  },
  {
    id: "o-1002",
    number: "KF-1002",
    customerName: "Neha Iyer",
    customerEmail: "neha@example.com",
    status: "shipped",
    totalInr: 799,
    itemCount: 2,
    createdAt: "2026-10-28",
    city: "Bengaluru",
  },
  {
    id: "o-1001",
    number: "KF-1001",
    customerName: "Guest checkout",
    customerEmail: "guest@example.com",
    status: "pending",
    totalInr: 549,
    itemCount: 1,
    createdAt: "2026-10-27",
    city: "Mumbai",
  },
];

export const categories: AdminCategory[] = [
  { id: "c1", name: "A2 Ghee", slug: "a2-ghee", productCount: 1, visible: true },
  { id: "c2", name: "Cold Pressed", slug: "cold-pressed", productCount: 2, visible: true },
  { id: "c3", name: "Organic Powders", slug: "powders", productCount: 2, visible: true },
  { id: "c4", name: "Seeds", slug: "seeds", productCount: 1, visible: true },
  { id: "c5", name: "Makhana", slug: "makhana", productCount: 1, visible: true },
];

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function getOrder(id: string) {
  return orders.find((o) => o.id === id);
}
