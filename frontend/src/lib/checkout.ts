import { apiGet, apiPost } from "@/lib/api";

export type CheckoutItemInput = {
  variant_id: number;
  qty: number;
};

export type CheckoutPayload = {
  customer_name: string;
  customer_email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  payment_method: "cod" | "prepaid";
  packing_notes?: string;
  items: CheckoutItemInput[];
};

export type PlacedOrder = {
  id: number;
  number: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  payment_status: string;
  fulfillment_status: string;
  total_inr: number;
  address: string;
  city: string;
  pincode: string;
  items: {
    title: string;
    sku: string;
    qty: number;
    unit_price_inr: number;
    line_total_inr: number;
  }[];
};

export async function placeOrder(payload: CheckoutPayload) {
  const json = await apiPost<{ data: PlacedOrder }>("/checkout", payload);
  return json.data;
}

export async function fetchGuestOrder(number: string, email: string) {
  const qs = `?email=${encodeURIComponent(email)}`;
  const json = await apiGet<{ data: PlacedOrder }>(
    `/orders/${encodeURIComponent(number)}${qs}`,
  );
  return json.data;
}
