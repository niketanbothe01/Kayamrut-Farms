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

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: "draft" | "active" | "archived";
  image?: string | null;
  priceFromInr: number;
  stockTotal: number;
  updatedAt: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  visible: boolean;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  spentInr: number;
};

export type DashboardStats = {
  activeProducts: number;
  openOrders: number;
  lowStockSkus: number;
  paidGmvInr: number;
};

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

export const PACK_PIPELINE: FulfillmentStatus[] = [
  "to_pack",
  "packing",
  "ready_to_ship",
  "shipped",
];

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
