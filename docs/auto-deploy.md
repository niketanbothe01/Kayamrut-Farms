# Auto-deploy (push → live)

Ops email: `vksorganicfoods@gmail.com` · GitHub: `niketanbothe01/Kayamrut-Farms`

## Already live

| App | Cloudflare Pages | Branch | Root | Output |
| --- | --- | --- | --- | --- |
| Storefront | https://kayamrut-farms.pages.dev | `cursor/frontend-forest-gold-4b1a` | `frontend` | `out` |

Push to that branch → Pages rebuilds automatically.

## Create next (admin)

Same CF account → **Workers & Pages** → **Create** → **Pages** → Connect Git → same repo:

| Field | Value |
| --- | --- |
| Project name | `kayamrut-admin` |
| Production branch | `cursor/frontend-forest-gold-4b1a` |
| Root directory | `/admin` |
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |

Then: https://kayamrut-admin.pages.dev (name may vary).

## API (not Cloudflare Workers)

Laravel + MySQL **cannot** run as a CF Worker. Use **Railway** (same ops email) with GitHub auto-deploy from this repo (`backend/`). Put the public API URL into both Pages projects as:

```text
NEXT_PUBLIC_API_URL=https://<your-api-host>/api
```

Later: point a custom domain at CF; CNAME `api.` to Railway.

## Integration workflow

1. Change frontend/admin locally → push branch → Pages updates.  
2. Change Laravel → push → Railway updates.  
3. Set `NEXT_PUBLIC_API_URL` on both Pages projects (and local `.env.local`) to the public API base ending in `/api`.

## Local API

```bash
make up   # http://localhost:8080/api/health
```

Storefront + admin already call the Laravel API (catalog, admin auth, products, orders, customers). CMS endpoints still pending.
