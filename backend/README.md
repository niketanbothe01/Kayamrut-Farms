# Kayamrut Farms — API (Laravel)

Laravel 13 API with MySQL 8. Patterns inspired by PDS layout (controllers / models / migrations) — **no proprietary rental code**.

## Quick start (Docker)

From repo root:

```bash
docker compose up -d --build
```

API base: http://localhost:8080  

Opening `/` in a browser returns a small JSON index (this is **not** a Laravel dashboard).  
UIs live on the Next apps: storefront `:3000`, admin `:3001`.

Health: `GET /api/health`  
Catalog: `GET /api/products`  
Admin login:

```bash
curl -s -X POST http://localhost:8080/api/admin/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@kayamrut.local","password":"password"}'
```

Use `Authorization: Bearer <token>` for `/api/admin/*`.

## What’s included (MVP slice)

- Categories + products + variants (public catalog)
- Admin auth (Sanctum) + dashboard
- Admin products / categories CRUD
- Admin orders: list/detail, status patch, shipment patch, **bulk** fulfillment
- Admin customers list
- Seed data aligned with storefront/admin fixtures

## Not yet

- Cart / checkout / payment webhooks
- CMS endpoints
- Image upload to R2/MinIO

See `../docs/api-requirements-draft.md`.
