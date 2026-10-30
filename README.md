# Kayamrut Farms

Monorepo for Kayamrut Farms — organic superfoods ecommerce.

## Apps

- `frontend/` — customer storefront (Next.js, **Forest Gold** theme) → `:3000`
- `admin/` — ops admin (Next.js, fixture-driven) → `:3001`
- `backend/` — Laravel API + MySQL via Docker Compose → `:8080`

## Docs

- [Architecture plan](./docs/architecture-plan.md)
- [Costing](./docs/costing.md)
- [Theme brief](./docs/theme-brief.md)

## Quick start

```bash
# API + MySQL (JSON only — no Laravel UI)
make up
# → http://localhost:8080/          (API index JSON)
# → http://localhost:8080/api/health

# Storefront UI
cd frontend && npm install && npm run dev   # :3000

# Admin UI
cd admin && npm install && npm run dev     # :3001
```

| Port | What you see |
| --- | --- |
| `:3000` | Forest Gold storefront |
| `:3001` | Ops admin |
| `:8080` | Laravel **API** (JSON). Opening `/` is not a dashboard. |

Admin API login: `admin@kayamrut.local` / `password`  

API sketch: [docs/api-requirements-draft.md](./docs/api-requirements-draft.md).
