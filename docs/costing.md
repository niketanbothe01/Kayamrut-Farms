# Kayamrut Farms — run-cost estimate

**Purpose:** Ballpark **operating cost** for the hybrid stack in `architecture-plan.md` (Next on Cloudflare + Laravel origin + India PG).  
**Not included:** product COGS, packaging, shipping, ads, accounting, or engineering build effort (those are separate from monthly run cost).  
**Currency:** USD list prices from vendor pages (late 2026); INR ≈ **₹85 / $1** for rough conversion — verify FX. Fees change; treat as planning ranges.

---

## 1. Cost map (what you pay for)

| Layer | What | Typical bill |
| --- | --- | --- |
| Edge UI | Cloudflare Pages (storefront + admin) | Free → ~$5+/mo if Workers Paid |
| Media | Cloudflare R2 product images | Free tier often enough early |
| DNS / TLS / WAF | Cloudflare | Free plan OK for MVP |
| API | Laravel (web + queue) on Fly / Railway / Render / VPS | **Main fixed cost** |
| Data | Postgres (or MySQL) + Redis | **Often largest fixed line** |
| Email | Transactional (Resend / SES / Mailgun) | ~$0–20/mo early |
| Domain | `.com` renewal | ~$10–15/yr |
| Payments | Razorpay / Cashfree / PhonePe | **% of successful GMV** (variable) |

---

## 2. Fixed monthly infra — three scenarios

Assumes hybrid deploy from the architecture plan. Figures are **order-of-magnitude**, not quotes.

### A) Lean MVP (first go-live, low traffic)

| Item | Choice | Est. USD/mo | ≈ INR/mo |
| --- | --- | --- | --- |
| Storefront + admin | Cloudflare Pages Free | $0 | ₹0 |
| Workers Paid (optional headroom) | Skip until needed | $0 | ₹0 |
| R2 media | ≤10 GB free tier | $0 | ₹0 |
| Laravel web | Fly `shared-cpu-1x` ~1 GB **or** Railway Hobby usage | $7–15 | ₹600–1,300 |
| Queue worker | Same host, small machine / shared process early | $0–7 | ₹0–600 |
| Database | Railway/Render small Postgres **or** cheap managed | $6–20 | ₹500–1,700 |
| Redis | Tiny / free-tier / shared | $0–10 | ₹0–850 |
| Transactional email | Free tier | $0–5 | ₹0–400 |
| Domain + misc | amortized | ~$1 | ~₹85 |
| **Fixed total** | | **~$15–55** | **≈ ₹1,300–4,700** |

**Cheapest practical path early:** Cloudflare free edge + **Railway Hobby** (~$5 plan fee with included usage) *or* a **₹500–1,000/mo Indian VPS** (Docker Compose) for Laravel+MySQL+Redis — lower $ than Fly Managed Postgres ($38 Basic alone).

### B) Recommended production starter (comfortable)

| Item | Choice | Est. USD/mo | ≈ INR/mo |
| --- | --- | --- | --- |
| Pages + Workers Paid | Cloudflare $5 base (shared account) | $5 | ₹425 |
| R2 | ~20–50 GB product media | $0–1 | ₹0–85 |
| Laravel web | Fly 1 GB always-on **or** Render/Railway ~1–2 GB | $7–25 | ₹600–2,100 |
| Queue + scheduler | Separate small worker | $5–15 | ₹425–1,300 |
| Postgres | Managed Basic-ish (Fly MPG $38 **or** Render ~$19–40) | $20–40 | ₹1,700–3,400 |
| Redis | 256 MB–1 GB managed | $10–20 | ₹850–1,700 |
| Email | Resend/SES light volume | $5–15 | ₹425–1,300 |
| Backups / monitoring | Sentry free→team, DB backups | $0–25 | ₹0–2,100 |
| **Fixed total** | | **~$50–140** | **≈ ₹4,000–12,000** |

**Default recommendation in plan terms:** ~**$60–100 / mo (≈ ₹5k–8.5k)** once you want managed DB + separate queue + CF paid headroom — before payment % fees.

### C) Growing store (more traffic / catalog / peak festivals)

| Item | Est. USD/mo | ≈ INR/mo |
| --- | --- | --- |
| Larger API + worker | $30–80 | ₹2,500–6,800 |
| Larger DB + Redis | $40–100 | ₹3,400–8,500 |
| CF Workers usage overages | $5–30 | ₹425–2,500 |
| R2 + Images | $1–15 | ₹85–1,300 |
| Email / SMS OTPs (if any) | $20–80 | ₹1,700–6,800 |
| **Fixed total** | **~$100–300** | **≈ ₹8,500–25,000** |

Scale is driven by **DB + API size**, not by Cloudflare Pages static/SSR at Kayamrut’s early volume.

---

## 3. Variable cost — payment gateway (this dominates once sales start)

Architecture default: **Razorpay** (~**2% + 18% GST on the fee** ≈ **~2.36%** of GMV on the public domestic card). Alternatives ~**1.95–1.99%** headline (Cashfree / PhonePe) — confirm **UPI** in writing.

| Monthly successful GMV (INR) | @ ~2.36% (Razorpay-like) | @ ~2.30% (≈1.95%+GST) |
| --- | ---: | ---: |
| ₹1,00,000 | ~₹2,360 | ~₹2,300 |
| ₹5,00,000 | ~₹11,800 | ~₹11,500 |
| ₹10,00,000 | ~₹23,600 | ~₹23,000 |
| ₹25,00,000 | ~₹59,000 | ~₹57,500 |

**Rule of thumb:** after ~₹2–3L GMV/month, **PG fees usually exceed all fixed hosting**. Hosting is the small line; **take-rate is the big line**.

Other commerce variables (not PG, but budget):

| Item | Typical |
| --- | --- |
| Shipping / courier | Per order (Delhivery, Shiprocket, etc.) — often ₹50–100+ inland |
| COD (if offered) | Extra courier COD fee + higher RTO risk — defer for MVP |
| GST on your product sales | Tax on goods — accounting, not “hosting” |

---

## 4. One-time / annual (small)

| Item | Est. |
| --- | --- |
| Domain `kayamrutfarms.com` | ~$12–15 / yr |
| Apple/Google not needed for web MVP | $0 |
| SSL | $0 via Cloudflare |
| PG activation | Usually ₹0 setup on standard plans; KYC time cost only |
| Local Docker on your Mac | $0 (beyond Docker Desktop) |

---

## 5. Worked examples (all-in monthly)

Assumes Recommended starter fixed (**≈ ₹6,500 / ~$75**) + PG on GMV.

| Month type | GMV | Infra (approx) | PG (~2.36%) | **All-in run** |
| --- | ---: | ---: | ---: | ---: |
| Soft launch | ₹50,000 | ₹6,500 | ₹1,180 | **≈ ₹7,700** |
| Early traction | ₹3,00,000 | ₹6,500 | ₹7,080 | **≈ ₹13,600** |
| Healthy D2C | ₹10,00,000 | ₹8,000* | ₹23,600 | **≈ ₹31,600** |

\*Slightly higher infra if traffic forces a bigger DB/API.

**Lean MVP month with almost no sales:** roughly **₹1,500–5,000** fixed only.

---

## 6. Cost levers (what to choose to stay cheap)

1. **Edge free as long as possible** — CF Pages Free; upgrade Workers Paid ($5) when you hit request limits.  
2. **Avoid Fly Managed Postgres Basic ($38) on day one** if budget is tight — Railway/Render small DB or a single VPS with Docker is usually cheaper for MVP.  
3. **One Laravel process early** — run `queue:work` on the same box until volume needs a second machine.  
4. **Payment gateway** — Cashfree/PhonePe if negotiated/UPI fee beats Razorpay; keep the adapter pattern so switching is cheap engineering-wise.  
5. **No COD in MVP** — reduces ops loss more than any hosting tweak.  
6. **R2 free tier** — compress images; 10 GB free is a lot of product shots.

---

## 7. What this is *not*

- Not a vendor quote or invoice  
- Not engineering / agency build price  
- Not inventory, packaging, or Meta/Google ads  
- Cloudflare Containers / “all on CF” would change this sheet — current plan is **hybrid**

---

## 8. Suggested budget to approve

| Phase | Monthly run budget to plan for |
| --- | --- |
| Local / staging only | **$0** cloud (Docker on Mac) |
| Public MVP | **$20–60 / mo** (≈ ₹1.7k–5k) + PG % on sales |
| Stable production | **$60–120 / mo** (≈ ₹5k–10k) + PG % |
| Festival peaks | Expect infra + PG to spike with GMV; PG first |

**Decision ask:** prefer **absolute cheapest lean** (VPS/Railway) or **managed comfort** (Fly/Render managed DB ~₹5k–10k/mo fixed)? That choice moves the fixed line more than Cloudflare does.

---

*Related: [`architecture-plan.md`](./architecture-plan.md) · prices sampled from Cloudflare / Fly.io / Railway / Render / Razorpay public pages — re-check before signing up.*
