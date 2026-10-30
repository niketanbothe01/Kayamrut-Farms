import { apiFetch, setToken } from "@/lib/api";
import type {
  AdminCategory,
  AdminCustomer,
  AdminOrder,
  AdminProduct,
  DashboardStats,
  FulfillmentStatus,
  PaymentStatus,
} from "@/data/types";

type ApiOrderListItem = {
  id: number;
  number: string;
  customer_name: string;
  customer_email: string;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  total_inr: number;
  item_count: number;
  city: string | null;
  carrier: string | null;
  tracking_number: string | null;
  created_at: string;
};

type ApiOrderDetail = ApiOrderListItem & {
  phone: string | null;
  address: string | null;
  pincode: string | null;
  packing_notes: string | null;
  shipment: {
    carrier: string | null;
    tracking_number: string | null;
    tracking_url: string | null;
    shipped_at: string | null;
    estimated_delivery: string | null;
    delivered_at: string | null;
  };
  items: {
    id: number;
    title: string;
    sku: string;
    qty: number;
    unit_price_inr: number;
  }[];
  timeline: { at: string; label: string }[];
};

function mapOrderList(o: ApiOrderListItem): AdminOrder {
  return {
    id: String(o.id),
    number: o.number,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    phone: "",
    paymentStatus: o.payment_status,
    fulfillmentStatus: o.fulfillment_status,
    totalInr: o.total_inr,
    itemCount: o.item_count,
    createdAt: o.created_at,
    address: "",
    city: o.city ?? "",
    pincode: "",
    items: [],
    shipment: o.carrier
      ? {
          carrier: o.carrier,
          trackingNumber: o.tracking_number ?? "",
        }
      : undefined,
    timeline: [],
  };
}

function mapOrderDetail(o: ApiOrderDetail): AdminOrder {
  return {
    ...mapOrderList(o),
    phone: o.phone ?? "",
    address: o.address ?? "",
    pincode: o.pincode ?? "",
    packingNotes: o.packing_notes ?? undefined,
    items: (o.items ?? []).map((i) => ({
      id: String(i.id),
      title: i.title,
      sku: i.sku,
      qty: i.qty,
      unitPriceInr: i.unit_price_inr,
    })),
    shipment: {
      carrier: o.shipment?.carrier ?? "",
      trackingNumber: o.shipment?.tracking_number ?? "",
      trackingUrl: o.shipment?.tracking_url ?? undefined,
      shippedAt: o.shipment?.shipped_at ?? undefined,
      estimatedDelivery: o.shipment?.estimated_delivery ?? undefined,
      deliveredAt: o.shipment?.delivered_at ?? undefined,
    },
    timeline: o.timeline ?? [],
  };
}

export async function loginAdmin(email: string, password: string) {
  const json = await apiFetch<{ token: string; user: { name: string; email: string } }>(
    "/admin/auth/login",
    {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password }),
    },
  );
  setToken(json.token);
  return json.user;
}

export async function logoutAdmin() {
  try {
    await apiFetch("/admin/auth/logout", { method: "POST" });
  } finally {
    setToken(null);
  }
}

export async function fetchMe() {
  return apiFetch<{ data: { id: number; name: string; email: string; is_admin: boolean } }>(
    "/admin/me",
  );
}

export async function fetchDashboard(): Promise<DashboardStats> {
  const json = await apiFetch<{
    data: {
      active_products: number;
      open_orders: number;
      low_stock_skus: number;
      paid_gmv_inr: number;
    };
  }>("/admin/dashboard");
  return {
    activeProducts: json.data.active_products,
    openOrders: json.data.open_orders,
    lowStockSkus: json.data.low_stock_skus,
    paidGmvInr: json.data.paid_gmv_inr,
  };
}

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  const json = await apiFetch<{
    data: {
      id: number;
      slug: string;
      name: string;
      category: string | null;
      status: AdminProduct["status"];
      price_from_inr: number | null;
      stock_total: number;
      updated_at: string | null;
    }[];
  }>("/admin/products");
  return json.data.map((p) => ({
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    category: p.category ?? "",
    status: p.status,
    priceFromInr: p.price_from_inr ?? 0,
    stockTotal: p.stock_total,
    updatedAt: p.updated_at ?? "",
  }));
}

export async function fetchAdminProduct(id: string) {
  const json = await apiFetch<{ data: Record<string, unknown> }>(`/admin/products/${id}`);
  return json.data;
}

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const json = await apiFetch<{
    data: {
      id: number;
      name: string;
      slug: string;
      product_count: number;
      visible: boolean;
    }[];
  }>("/admin/categories");
  return json.data.map((c) => ({
    id: String(c.id),
    name: c.name,
    slug: c.slug,
    productCount: c.product_count,
    visible: c.visible,
  }));
}

export async function fetchAdminOrders(params?: {
  fulfillment_status?: string;
  payment_status?: string;
}): Promise<AdminOrder[]> {
  const qs = new URLSearchParams();
  if (params?.fulfillment_status) qs.set("fulfillment_status", params.fulfillment_status);
  if (params?.payment_status) qs.set("payment_status", params.payment_status);
  const suffix = qs.toString() ? `?${qs}` : "";
  const json = await apiFetch<{ data: ApiOrderListItem[] }>(`/admin/orders${suffix}`);
  return json.data.map(mapOrderList);
}

export async function fetchAdminOrder(id: string): Promise<AdminOrder> {
  const json = await apiFetch<{ data: ApiOrderDetail }>(`/admin/orders/${id}`);
  return mapOrderDetail(json.data);
}

export async function patchAdminOrder(
  id: string,
  body: {
    fulfillment_status?: FulfillmentStatus;
    packing_notes?: string;
    payment_status?: PaymentStatus;
  },
) {
  const json = await apiFetch<{ data: ApiOrderDetail }>(`/admin/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return mapOrderDetail(json.data);
}

export async function bulkUpdateOrders(ids: string[], fulfillment_status: FulfillmentStatus) {
  return apiFetch<{ updated: number; fulfillment_status: string }>("/admin/orders/bulk", {
    method: "POST",
    body: JSON.stringify({
      ids: ids.map((id) => Number(id)),
      fulfillment_status,
    }),
  });
}

export async function patchShipment(
  id: string,
  body: {
    carrier: string;
    tracking_number: string;
    tracking_url?: string;
    estimated_delivery?: string;
    mark_shipped?: boolean;
  },
) {
  const json = await apiFetch<{ data: ApiOrderDetail }>(`/admin/orders/${id}/shipment`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return mapOrderDetail(json.data);
}

export async function fetchAdminCustomers(): Promise<AdminCustomer[]> {
  const json = await apiFetch<{
    data: { id: string; name: string; email: string; orders: number; spent_inr: number }[];
  }>("/admin/customers");
  return json.data.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    orders: c.orders,
    spentInr: c.spent_inr,
  }));
}
