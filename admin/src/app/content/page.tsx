import { AdminShell } from "@/components/AdminShell";

export const metadata = { title: "Content" };

export default function ContentPage() {
  return (
    <AdminShell title="Content / CMS">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Home hero",
            body: "Headline, supporting line, CTA labels, hero image.",
            api: "GET/PATCH /api/admin/cms/home",
          },
          {
            title: "About page",
            body: "Story blocks for farm-to-home / Bilona narrative.",
            api: "GET/PATCH /api/admin/cms/pages/about",
          },
          {
            title: "Testimonials",
            body: "Quote, name, optional product link, sort order.",
            api: "CRUD /api/admin/testimonials",
          },
          {
            title: "Promotions banner",
            body: "Optional site-wide promo strip copy + link.",
            api: "GET/PATCH /api/admin/promotions/banner",
          },
        ].map((card) => (
          <section key={card.title} className="panel p-5">
            <h2 className="font-display text-xl text-forest">{card.title}</h2>
            <p className="mt-2 text-sm text-muted">{card.body}</p>
            <p className="mt-4 text-xs text-gold-ink">
              <code>{card.api}</code>
            </p>
            <button type="button" className="btn btn-ghost mt-4">
              Edit (soon)
            </button>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}
