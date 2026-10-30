# What’s done vs still remaining

## Polished locally (this pass)

- 8 catalog products with photos in DB + `public/products/`
- Richer seed: powders (moringa/ashwa/shatavari), seeds, makhana, 4 demo orders
- Storefront cards/PDP show real images from API
- Admin product list shows thumbnails
- Storefront + admin call Laravel (`NEXT_PUBLIC_API_URL`)

**Local run**

```bash
make up
cd frontend && npm run dev   # :3000
cd admin && npm run dev      # :3001
# admin login: admin@kayamrut.local / password
```

## Still remaining (honest)

| Area | Status |
| --- | --- |
| Cart / checkout / payment webhooks | Not built |
| CMS APIs (home/about/testimonials) | UI shell only |
| Image upload in admin | Seeded files only; no upload UI |
| Customer auth / accounts | Not built |
| Admin Pages on Cloudflare | Create project (`/admin`, `out`) |
| Railway API host | Blocked until Railway is up |
| CF env `NEXT_PUBLIC_API_URL` | Needed when API is public (pages.dev can’t use localhost) |
| Custom domain | Optional later |
| Point CF Pages branch to `cursor/api-integration-4b1a` | So live site gets this polish |

## Deploy sequence after Railway returns

1. Deploy Laravel+MySQL on Railway from this repo `backend/`
2. Set Pages env `NEXT_PUBLIC_API_URL=https://<railway>/api`
3. Switch/storefront Pages production branch → `cursor/api-integration-4b1a`
4. Create `kayamrut-admin` Pages project
5. Then cart/checkout + Razorpay
