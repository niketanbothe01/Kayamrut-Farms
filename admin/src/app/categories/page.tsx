import { AdminShell } from "@/components/AdminShell";
import { categories } from "@/data/fixtures";

export const metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <AdminShell
      title="Categories"
      actions={
        <button type="button" className="btn btn-primary">
          Add category
        </button>
      }
    >
      <div className="panel table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Visible</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="font-semibold text-forest">{category.name}</td>
                <td className="text-muted">{category.slug}</td>
                <td>{category.productCount}</td>
                <td>{category.visible ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        Needed APIs: <code>GET/POST/PATCH /api/admin/categories</code>, sort order, visibility.
      </p>
    </AdminShell>
  );
}
