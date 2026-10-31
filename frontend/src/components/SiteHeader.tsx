import Link from "next/link";
import { CartLink } from "@/components/CartLink";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=a2-ghee", label: "Ghee" },
  { href: "/shop?category=cold-pressed", label: "Oils" },
  { href: "/about", label: "Our story" },
  { href: "/account", label: "Account" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display text-lg tracking-wide text-forest md:text-xl">
            Kayamrut Farms
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted">
            Organic · Herbal · Pure
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-forest md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-gold-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/shop" className="btn btn-forest !min-h-10 !px-4 text-sm md:hidden">
            Shop
          </Link>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
