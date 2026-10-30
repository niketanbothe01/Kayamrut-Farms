import Link from "next/link";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/orders", label: "Orders" },
  { href: "/customers", label: "Customers" },
  { href: "/content", label: "Content" },
];

export function AdminShell({
  children,
  title,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-forest-deep text-cream md:min-h-screen md:border-b-0 md:border-r md:border-white/10">
        <div className="px-5 py-5">
          <p className="font-display text-xl text-cream">Kayamrut Admin</p>
          <p className="mt-1 text-[0.7rem] uppercase tracking-[0.16em] text-gold">
            Forest Gold · ops
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:flex-col md:overflow-visible">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-cream/85 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden px-5 pb-6 text-xs text-cream/50 md:block">
          Fixture UI — APIs come next. Auth not wired yet.
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel px-5 py-4">
          <h1 className="font-display text-2xl text-forest">{title}</h1>
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        </header>
        <div className="flex-1 p-5 md:p-6">{children}</div>
      </div>
    </div>
  );
}
