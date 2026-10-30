# Kayamrut Farms — theme brief & frontend-first plan

**Goal:** Lock a premium visual direction, then finish the **Next.js storefront** against mock APIs before backend build → integration → lean deploy.

## Delivery sequence (agreed)

1. **Theme direction** (this doc) → you pick A / B / C (or hybrid)  
2. **Frontend storefront** — Next.js App Router, brand theme tokens, pages with fixtures  
3. **Backend requirements freeze** — API contract from real UI needs  
4. **Laravel API + admin**  
5. **Integration** (auth, cart, Razorpay/Cashfree, webhooks)  
6. **Lean MVP deploy** (~₹1.3k–4.7k/mo, MySQL 8)

---

## Brand constraints (from IG + product)

- Organic • Herbal • Pure; farm-to-home Ayurvedic D2C  
- Colors already in creatives: **forest / olive greens**, **ghee gold / sunflower yellow**, clean whites  
- Hero must feel **full-bleed product/atmosphere**, not a SaaS dashboard  
- Avoid generic AI looks (purple gradients, cream+terracotta newspaper, glow pills)

---

## Three custom directions (mockups)

| ID | Name | Feel | Best if you want… |
| --- | --- | --- | --- |
| **A** | Forest Gold | Deep green + golden ghee jar, luxury D2C | Premium ghee-led brand, high perceived value |
| **B** | Sunlit Pantry | Bright daylight oils/seeds, open & fresh | Everyday cooking oils + approachable shop |
| **C** | Ritual Green | Moody ritual / Bilona / diya amber | Ayurveda storytelling, “liquid gold” mystique |

Files:
- Project media: `media/theme-directions/a-forest-gold.jpg`, `b-sunlit-pantry.jpg`, `c-ritual-green.jpg`
- Repo: `docs/theme-directions/*.jpg`

**Working recommendation:** **A (Forest Gold)** as primary system, with **B’s daylight product photography** on category/PDP grids — closest to IG jar shots + premium shelf.

---

## Ready-made premium themes (inspiration / optional buy)

We are building **custom Next.js**, not Shopify — use these as **IA + section pattern** references only (or buy later if you ever run a Shopify experiment).

| Theme | Price ballpark | Why relevant |
| --- | --- | --- |
| [Shopify Craft](https://themes.shopify.com) | ~$350 | Artisan / natural / maker-story — closest aesthetic to organic farm brands |
| [Shopify Prestige](https://themes.shopify.com) | ~$350 | Editorial luxury wellness |
| [Ignite · Peak](https://themes.shopify.com/themes/ignite/presets/peak) | ~$380 | Wellness food / supplements / nutrition sections |
| [Eurus · Arise](https://themes.shopify.com/themes/eurus/presets/arise) | ~$350 | Educate → convert for wellness catalogs |
| [Lumin “Organic”](https://lumintheme.com/products/organic) | ~€150 | Food / bakery / provenance-led organic |

Praakritik remains the **commerce IA** reference (collections, variant add, badges); theme look should feel **more premium and brand-led** than a generic grocery grid.

---

## Frontend MVP scope (after you pick a direction)

**Pages:** Home, Shop/Category, PDP, Cart, Checkout shell, About/Process, basic Account stub  
**Theme system:** CSS variables (green/gold/cream-white carefully — not the terracotta cliché), expressive display font + clean body, motion on hero/nav only  
**Data:** JSON fixtures mirroring future Laravel resources (products, categories, variants)  
**Out of scope until backend:** real payments, real auth, admin CRUD  

---

## Decision needed from you

Reply with one of:
- **A** Forest Gold  
- **B** Sunlit Pantry  
- **C** Ritual Green  
- **A+B** (recommended hybrid)  
- Or paste another URL you love as the north star  

Then we scaffold `frontend/` Next.js with that theme and start the storefront.
