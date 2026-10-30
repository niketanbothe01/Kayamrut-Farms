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

/** Payment lifecycle (money) */
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "failed";

/** Fulfillment / delivery lifecycle (ops) */
export type FulfillmentStatus =
  | "awaiting_payment"
  | "to_pack"
  | "packing"
  | "ready_to_ship"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type OrderLineItem = {
  id: string;
  title: string;
  sku: string;
  qty: number;
  unitPriceInr: number;
};

export type ShipmentInfo = {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  shippedAt?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
};

export type AdminOrder = {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  totalInr: number;
  itemCount: number;
  createdAt: string;
  address: string;
  city: string;
  pincode: string;
  items: OrderLineItem[];
  shipment?: ShipmentInfo;
  packingNotes?: string;
  timeline: { at: string; label: string }[];
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  visible: boolean;
};

/** Happy-path delivery steps for the status stepper UI */
export const FULFILLMENT_STEPS: FulfillmentStatus[] = [
  "to_pack",
  "packing",
  "ready_to_ship",
  "shipped",
  "out_for_delivery",
  "delivered",
];

export const FULFILLMENT_LABELS: Record<FulfillmentStatus, string> = {
  awaiting_payment: "Awaiting payment",
  to_pack: "To pack",
  packing: "Packing",
  ready_to_ship: "Ready to ship",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
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
    phone: "+91 98765 43210",
    paymentStatus: "paid",
    fulfillmentStatus: "to_pack",
    totalInr: 1899,
    itemCount: 1,
    createdAt: "2026-10-30 09:12",
    address: "14 Heritage Park, Satellite",
    city: "Ahmedabad",
    pincode: "380015",
    packingNotes: "Include recipe card",
    items: [
      {
        id: "li1",
        title: "A2 Gir Cow Ghee · 1 Litre",
        sku: "GHEE-1L",
        qty: 1,
        unitPriceInr: 1899,
      },
    ],
    timeline: [
      { at: "2026-10-30 09:12", label: "Order placed" },
      { at: "2026-10-30 09:13", label: "Payment confirmed (Razorpay)" },
      { at: "2026-10-30 09:13", label: "Queued for packing" },
    ],
  },
  {
    id: "o-1003",
    number: "KF-1003",
    customerName: "Rohit Mehta",
    customerEmail: "rohit@example.com",
    phone: "+91 98200 11223",
    paymentStatus: "paid",
    fulfillmentStatus: "packing",
    totalInr: 1248,
    itemCount: 3,
    createdAt: "2026-10-29 16:40",
    address: "802 Lakeview, Baner",
    city: "Pune",
    pincode: "411045",
    items: [
      {
        id: "li2",
        title: "Cold Pressed Sunflower Oil · 1 Litre",
        sku: "OIL-SF-1L",
        qty: 1,
        unitPriceInr: 499,
      },
      {
        id: "li3",
        title: "Organic Moringa Powder · 100 g",
        sku: "PWD-MOR-100",
        qty: 2,
        unitPriceInr: 249,
      },
      {
        id: "li4",
        title: "Organic Makhana · 200 g",
        sku: "MAK-200",
        qty: 1,
        unitPriceInr: 249,
      },
    ],
    timeline: [
      { at: "2026-10-29 16:40", label: "Order placed" },
      { at: "2026-10-29 16:41", label: "Payment confirmed" },
      { at: "2026-10-30 08:05", label: "Packing started" },
    ],
  },
  {
    id: "o-1002",
    number: "KF-1002",
    customerName: "Neha Iyer",
    customerEmail: "neha@example.com",
    phone: "+91 99001 44556",
    paymentStatus: "paid",
    fulfillmentStatus: "shipped",
    totalInr: 799,
    itemCount: 2,
    createdAt: "2026-10-28 11:20",
    address: "22 Palm Grove, Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    shipment: {
      carrier: "Delhivery",
      trackingNumber: "DLV88221045",
      trackingUrl: "https://www.delhivery.com/",
      shippedAt: "2026-10-29 14:10",
      estimatedDelivery: "2026-11-01",
    },
    items: [
      {
        id: "li5",
        title: "Cold Pressed Coconut Oil · 500 ml",
        sku: "OIL-CO-500",
        qty: 1,
        unitPriceInr: 449,
      },
      {
        id: "li6",
        title: "Pumpkin Seeds · 200 g",
        sku: "SEED-PUMP-200",
        qty: 1,
        unitPriceInr: 199,
      },
      {
        id: "li7",
        title: "Shipping",
        sku: "SHIP",
        qty: 1,
        unitPriceInr: 151,
      },
    ],
    timeline: [
      { at: "2026-10-28 11:20", label: "Order placed" },
      { at: "2026-10-28 11:21", label: "Payment confirmed" },
      { at: "2026-10-28 18:00", label: "Packed / ready to ship" },
      { at: "2026-10-29 14:10", label: "Shipped via Delhivery · DLV88221045" },
    ],
  },
  {
    id: "o-1005",
    number: "KF-1005",
    customerName: "Priya Nair",
    customerEmail: "priya@example.com",
    phone: "+91 98111 22334",
    paymentStatus: "paid",
    fulfillmentStatus: "out_for_delivery",
    totalInr: 999,
    itemCount: 1,
    createdAt: "2026-10-27 13:05",
    address: "5 Lotus Residency, Andheri West",
    city: "Mumbai",
    pincode: "400058",
    shipment: {
      carrier: "Shiprocket / Bluedart",
      trackingNumber: "BD4492011",
      shippedAt: "2026-10-28 10:00",
      estimatedDelivery: "2026-10-30",
    },
    items: [
      {
        id: "li8",
        title: "A2 Gir Cow Ghee · 500 ml",
        sku: "GHEE-500",
        qty: 1,
        unitPriceInr: 999,
      },
    ],
    timeline: [
      { at: "2026-10-27 13:05", label: "Order placed" },
      { at: "2026-10-27 13:06", label: "Payment confirmed" },
      { at: "2026-10-28 10:00", label: "Shipped" },
      { at: "2026-10-30 08:40", label: "Out for delivery" },
    ],
  },
  {
    id: "o-1001",
    number: "KF-1001",
    customerName: "Guest checkout",
    customerEmail: "guest@example.com",
    phone: "+91 90000 00001",
    paymentStatus: "unpaid",
    fulfillmentStatus: "awaiting_payment",
    totalInr: 549,
    itemCount: 1,
    createdAt: "2026-10-27 10:02",
    address: "Pending address",
    city: "Mumbai",
    pincode: "—",
    items: [
      {
        id: "li9",
        title: "A2 Gir Cow Ghee · 250 ml",
        sku: "GHEE-250",
        qty: 1,
        unitPriceInr: 549,
      },
    ],
    timeline: [{ at: "2026-10-27 10:02", label: "Order created — awaiting payment" }],
  },
  {
    id: "o-1000",
    number: "KF-1000",
    customerName: "Suresh Patil",
    customerEmail: "suresh@example.com",
    phone: "+91 97654 32100",
    paymentStatus: "paid",
    fulfillmentStatus: "delivered",
    totalInr: 748,
    itemCount: 2,
    createdAt: "2026-10-20 12:00",
    address: "9 Green Colony, Kothrud",
    city: "Pune",
    pincode: "411038",
    shipment: {
      carrier: "Delhivery",
      trackingNumber: "DLV7711002",
      shippedAt: "2026-10-21",
      deliveredAt: "2026-10-24 17:22",
    },
    items: [
      {
        id: "li10",
        title: "Organic Makhana · 500 g",
        sku: "MAK-500",
        qty: 1,
        unitPriceInr: 549,
      },
      {
        id: "li11",
        title: "Organic Moringa Powder · 100 g",
        sku: "PWD-MOR-100",
        qty: 1,
        unitPriceInr: 199,
      },
    ],
    timeline: [
      { at: "2026-10-20 12:00", label: "Order placed" },
      { at: "2026-10-21", label: "Shipped" },
      { at: "2026-10-24 17:22", label: "Delivered" },
    ],
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

/** Active packing pipeline (excludes terminal / unpaid waiting) */
export const PACK_PIPELINE: FulfillmentStatus[] = [
  "to_pack",
  "packing",
  "ready_to_ship",
];
