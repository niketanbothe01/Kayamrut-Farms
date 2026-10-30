import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-forest-deep text-cream">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl">Kayamrut Farms</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/75">
            Farm-to-home organic superfoods — A2 ghee, cold-pressed oils, herbal
            powders, and seeds. Simple nourishment, honestly made.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cream/85">
            <li>
              <Link href="/shop" className="hover:text-gold-bright">
                All products
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-bright">
                Our story
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-gold-bright">
                Cart
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Contact
          </p>
          <p className="mt-3 text-sm text-cream/85">
            Instagram{" "}
            <a
              href="https://www.instagram.com/kayamrutfarms"
              className="text-gold-bright underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              @kayamrutfarms
            </a>
          </p>
          <p className="mt-2 text-sm text-cream/60">
            Storefront preview — prices are fixtures until checkout goes live.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-cream/55">
          <span>© 2026 Kayamrut Farms</span>
          <span>Made for simple, everyday wellness</span>
        </div>
      </div>
    </footer>
  );
}
