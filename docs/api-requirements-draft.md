# API requirements draft (from storefront + admin UI)

Derived from fixture-driven UIs — **not implemented yet**. Laravel should expose roughly this surface.

## Auth

| Endpoint | Notes |
| --- | --- |
| `POST /api/auth/login` | Customer (storefront) |
| `POST /api/auth/register` | Optional if guest checkout only at first |
| `POST /api/admin/auth/login` | Separate admin guard |
| `POST /api/auth/logout` | Both |
| `GET /api/me` | Current customer |
| `GET /api/admin/me` | Current admin |

## Catalog (public)

| Endpoint | Used by |
| --- | --- |
| `GET /api/categories` | Storefront nav / shop chips |
| `GET /api/products?category=` | Shop grid |
| `GET /api/products/:slug` | PDP |
| Product payload | `name`, `slug`, `description`, `badges[]`, `category`, `images[]`, `variants[]` |
| Variant payload | `id`, `sku`, `label`, `price_inr`, `compare_at_inr?`, `stock`, `in_stock` |

## Cart / checkout (public)

| Endpoint | Used by |
| --- | --- |
| `GET/POST/PATCH/DELETE /api/cart` | Cart (guest cookie or user) |
| `POST /api/checkout` | Create order + payment session |
| `POST /api/payments/webhook/:provider` | Razorpay/Cashfree confirm |
| `GET /api/orders/:id` | Confirmation (scoped to owner/guest token) |

## Admin — products & categories

| Endpoint | Used by admin screen |
| --- | --- |
| `GET /api/admin/products` | Products table |
| `POST /api/admin/products` | Add product |
| `GET/PATCH /api/admin/products/:id` | Edit product |
| `POST /api/admin/products/:id/images` | Media upload → R2/MinIO |
| Variant nested create/update | Edit form |
| `GET/POST/PATCH /api/admin/categories` | Categories |

## Admin — orders & customers

| Endpoint | Used by |
| --- | --- |
| `GET /api/admin/orders?status=` | Orders list |
| `GET /api/admin/orders/:id` | Order detail + line items |
| `PATCH /api/admin/orders/:id` | Status: processing / shipped / cancelled + tracking |
| `GET /api/admin/customers` | Customers list |
| `GET /api/admin/customers/:id` | Detail + addresses + orders |

## Admin — CMS / dashboard

| Endpoint | Used by |
| --- | --- |
| `GET /api/admin/dashboard` | Counts: active products, open orders, low stock, GMV |
| `GET/PATCH /api/admin/cms/home` | Home hero |
| `GET/PATCH /api/admin/cms/pages/:slug` | About etc. |
| `CRUD /api/admin/testimonials` | Content |
| Optional promotions banner | Content |

## Cross-cutting

- JSON:API or plain JSON resources — prefer plain Laravel API Resources  
- Admin routes: Sanctum + `admin` ability / guard  
- Money: integer **paise** or INR major units — pick one and stick (UI currently shows INR majors)  
- DB: **MySQL 8**  
- File storage: S3-compatible (MinIO local, R2 prod)

## Out of MVP API

Subscriptions / fruit boxes, multi-warehouse, advanced coupons engine, full OMS.
