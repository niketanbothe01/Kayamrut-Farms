import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { formatInr, products } from "@/data/fixtures";

export const metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <AdminShell
      title="Products"
      actions={
        <Link href="/products/new" className="btn btn-primary">
          Add product
        </Link>
      }
    >
      <div className="panel table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Status</th>
              <th>From</th>
              <th>Stock</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Link
                    href={`/products/${product.id}`}
                    className="font-semibold text-forest hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted">{product.slug}</p>
                </td>
                <td>{product.category}</td>
                <td>
                  <span className={`badge badge-${product.status}`}>
                    {product.status}
                  </span>
                </td>
                <td>{formatInr(product.priceFromInr)}</td>
                <td className={product.stockTotal < 20 ? "text-warn font-semibold" : ""}>
                  {product.stockTotal}
                </td>
                <td className="text-muted">{product.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
