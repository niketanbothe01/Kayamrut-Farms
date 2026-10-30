import Link from "next/link";

export const metadata = {
  title: "Our story",
};

export default function AboutPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">
        Our story
      </p>
      <h1 className="font-display mt-2 max-w-2xl text-4xl text-forest md:text-5xl">
        Nurturing health with nature
      </h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 text-base leading-relaxed text-ink/85">
          <p>
            Kayamrut Farms™ is an organic superfoods brand focused on purity and
            everyday use — A2 Gir cow ghee, cold-pressed oils, herbal powders,
            seeds, and makhana.
          </p>
          <p>
            We keep the shopping experience simple: clear categories, honest
            sizes, and products you can cook with every day.
          </p>
          <p className="text-muted">
            Follow along on Instagram{" "}
            <a
              href="https://www.instagram.com/kayamrutfarms"
              className="font-semibold text-gold-ink underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              @kayamrutfarms
            </a>
            .
          </p>
        </div>
        <div className="surface-card p-6">
          <p className="font-display text-2xl text-forest">What we stand for</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>Organic · Herbal · Pure</li>
            <li>Farm-to-home sourcing</li>
            <li>Traditional preparation where it matters</li>
            <li>Friendly, uncluttered shopping</li>
          </ul>
          <Link href="/shop" className="btn btn-forest mt-6">
            Shop the range
          </Link>
        </div>
      </div>
    </div>
  );
}
