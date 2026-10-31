# What’s done vs still remaining

## Live on production

| Piece | URL |
| --- | --- |
| Storefront | https://kayamrutfarms.in |
| Admin | https://admin.kayamrutfarms.in |
| API (tunnel) | https://api.kayamrutfarms.in |
| SSL | Cloudflare Universal SSL |

## Built in this commerce pass

- Guest cart (localStorage) + PDP add-to-cart
- Checkout → `POST /api/checkout` (COD + prepaid placeholder)
- Order confirm page (`/order/confirm`)
- Customer register/login API + `/account` UI
- Admin product image upload (`POST /api/admin/products/{id}/image`)
- Admin password via `ADMIN_PASSWORD` env on seed

## Still remaining (honest)

| Area | Status |
| --- | --- |
| Razorpay / Cashfree webhooks | Prepaid flag only — wire keys next |
| Order email notifications | Not sent yet |
| `@kayamrutfarms.in` mailbox | Add MX at Cloudflare / Hostinger Email |
| CMS home/about APIs | Admin content shell still placeholder |
| Customer order history UI | Auth exists; history screen next |
| Change live admin password | Set `ADMIN_PASSWORD` on VPS `.env` and re-seed admin, or `php artisan tinker` |

## Local run

```bash
make up
cd frontend && npm run dev   # :3000
cd admin && npm run dev      # :3001
# admin: admin@kayamrut.local / password (or ADMIN_PASSWORD)
```

## VPS refresh after pull

```bash
cd /opt/Kayamrut-Farms
git pull origin cursor/api-integration-4b1a
docker compose up -d --build
```
