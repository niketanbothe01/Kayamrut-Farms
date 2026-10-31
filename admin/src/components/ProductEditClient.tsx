"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch } from "@/lib/api";

type ProductDetail = {
  id: number;
  name: string;
  slug: string;
  category: string | null;
  tagline: string | null;
  description: string | null;
  status: string;
  accent: string | null;
  image?: string | null;
  image_url?: string | null;
  variants: {
    id: number;
    sku: string;
    label: string;
    price_inr: number;
    compare_at_inr: number | null;
    stock: number;
  }[];
};

export function ProductEditClient({ id }: { id: string }) {
  const isNew = id === "new";
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      try {
        const json = await apiFetch<{ data: ProductDetail }>(`/admin/products/${id}`);
        if (!cancelled) setProduct(json.data);
      } catch {
        if (!cancelled) setError("Failed to load product.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const body = {
      name: String(form.get("name") || ""),
      slug: String(form.get("slug") || "") || undefined,
      category: String(form.get("category") || ""),
      tagline: String(form.get("tagline") || "") || null,
      description: String(form.get("description") || "") || null,
      status: String(form.get("status") || "draft"),
      accent: String(form.get("accent") || "") || null,
    };

    try {
      if (isNew) {
        const json = await apiFetch<{ data: ProductDetail }>("/admin/products", {
          method: "POST",
          body: JSON.stringify({
            ...body,
            variants: [
              {
                sku: `${(body.slug || "SKU").toUpperCase()}-1`,
                label: "Default",
                price_inr: Number(form.get("price") || 0),
                stock: Number(form.get("stock") || 0),
              },
            ],
          }),
        });
        setProduct(json.data);
        setMessage("Product created.");
      } else {
        const json = await apiFetch<{ data: ProductDetail }>(`/admin/products/${id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        setProduct(json.data);
        setMessage("Product saved.");
      }
    } catch {
      setMessage("Save failed — check fields / API.");
    }
  }

  return (
    <AdminShell
      title={isNew ? "Add product" : `Edit · ${product?.name ?? "…"}`}
      actions={
        <Link href="/products" className="btn btn-ghost">
          Back to list
        </Link>
      }
    >
      {error ? <p className="mb-3 text-sm text-warn">{error}</p> : null}
      {!isNew && !product && !error ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <form className="panel grid max-w-3xl gap-4 p-5 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="field md:col-span-2">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              defaultValue={product?.name ?? ""}
              placeholder="A2 Gir Cow Ghee"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" defaultValue={product?.slug ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              defaultValue={product?.category ?? ""}
              required
            />
          </div>
          <div className="field md:col-span-2">
            <label htmlFor="tagline">Tagline</label>
            <input id="tagline" name="tagline" defaultValue={product?.tagline ?? ""} />
          </div>
          <div className="field md:col-span-2">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={product?.description ?? ""}
            />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={product?.status ?? "draft"}>
              <option value="draft">draft</option>
              <option value="active">active</option>
              <option value="archived">archived</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="accent">Accent</label>
            <input id="accent" name="accent" defaultValue={product?.accent ?? "ghee"} />
          </div>
          {isNew ? (
            <>
              <div className="field">
                <label htmlFor="price">Starting price (INR)</label>
                <input id="price" name="price" type="number" defaultValue={499} required />
              </div>
              <div className="field">
                <label htmlFor="stock">Starting stock</label>
                <input id="stock" name="stock" type="number" defaultValue={20} required />
              </div>
            </>
          ) : null}
          <div className="md:col-span-2 flex flex-wrap gap-2">
            <button type="submit" className="btn btn-primary">
              {isNew ? "Create product" : "Save changes"}
            </button>
            {message ? <p className="self-center text-sm text-forest">{message}</p> : null}
          </div>
          {!isNew && product?.variants?.length ? (
            <div className="md:col-span-2">
              <p className="text-sm font-semibold text-forest">Variants</p>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {product.variants.map((v) => (
                  <li key={v.id}>
                    {v.label} · {v.sku} · ₹{v.price_inr} · stock {v.stock}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {!isNew && product ? (
            <div className="md:col-span-2 border-t border-line pt-4">
              <p className="text-sm font-semibold text-forest">Product image</p>
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="mt-2 h-28 w-28 rounded-xl object-cover"
                />
              ) : (
                <p className="mt-1 text-sm text-muted">No image yet.</p>
              )}
              <input
                className="mt-3 block w-full text-sm"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setMessage(null);
                  const body = new FormData();
                  body.append("image", file);
                  try {
                    const json = await apiFetch<{ data: ProductDetail }>(
                      `/admin/products/${id}/image`,
                      { method: "POST", body },
                    );
                    setProduct(json.data);
                    setMessage("Image uploaded.");
                  } catch {
                    setMessage("Image upload failed.");
                  }
                }}
              />
            </div>
          ) : null}
        </form>
      )}
    </AdminShell>
  );
}
