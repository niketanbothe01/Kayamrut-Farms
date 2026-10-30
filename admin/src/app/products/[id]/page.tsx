import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { getProduct, products } from "@/data/fixtures";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return [
    ...products.map((p) => ({ id: p.id })),
    { id: "new" },
  ];
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  if (id === "new") return { title: "New product" };
  const product = getProduct(id);
  return { title: product?.name ?? "Product" };
}

export default async function ProductEditPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";
  const product = isNew ? null : getProduct(id);
  if (!isNew && !product) notFound();

  return (
    <AdminShell
      title={isNew ? "Add product" : `Edit · ${product!.name}`}
      actions={
        <Link href="/products" className="btn btn-ghost">
          Back to list
        </Link>
      }
    >
      <form className="panel grid max-w-3xl gap-4 p-5 md:grid-cols-2">
        <div className="field md:col-span-2">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" defaultValue={product?.name ?? ""} placeholder="A2 Gir Cow Ghee" />
        </div>
        <div className="field">
          <label htmlFor="slug">Slug</label>
          <input id="slug" name="slug" defaultValue={product?.slug ?? ""} placeholder="a2-gir-cow-ghee" />
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue={product?.category ?? "A2 Ghee"}>
            <option>A2 Ghee</option>
            <option>Cold Pressed</option>
            <option>Organic Powders</option>
            <option>Seeds</option>
            <option>Makhana</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={product?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="price">From price (INR)</label>
          <input
            id="price"
            name="price"
            type="number"
            defaultValue={product?.priceFromInr ?? 499}
          />
        </div>
        <div className="field md:col-span-2">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            defaultValue={
              product
                ? "Product copy shown on the storefront PDP."
                : ""
            }
            placeholder="Short customer-facing description"
          />
        </div>
        <div className="field md:col-span-2">
          <label>Variants (API shape preview)</label>
          <p className="rounded-lg border border-dashed border-line bg-cream px-3 py-3 text-sm text-muted">
            Each variant needs: <code>sku</code>, <code>label</code> (250 ml / 1 L),{" "}
            <code>price_inr</code>, <code>compare_at_inr?</code>, <code>stock</code>,{" "}
            <code>weight_grams?</code>.
          </p>
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-2 pt-2">
          <button type="button" className="btn btn-primary">
            {isNew ? "Create product" : "Save changes"}
          </button>
          <button type="button" className="btn btn-ghost">
            Save as draft
          </button>
        </div>
        <p className="md:col-span-2 text-xs text-muted">
          Buttons are UI-only. Saving will call{" "}
          <code>POST/PATCH /api/admin/products</code> once Laravel is ready.
        </p>
      </form>
    </AdminShell>
  );
}
