# Kayamrut Farms

Monorepo for Kayamrut Farms — organic superfoods ecommerce.

## Apps

- `frontend/` — customer storefront (Next.js, **Forest Gold** theme) → `:3000`
- `admin/` — ops admin (Next.js, fixture-driven) → `:3001`
- `backend/` — Laravel API (not scaffolded yet)

## Docs

- [Architecture plan](./docs/architecture-plan.md)
- [Costing](./docs/costing.md)
- [Theme brief](./docs/theme-brief.md)

## Quick start

```bash
# Storefront
cd frontend && npm install && npm run dev

# Admin (other terminal)
cd admin && npm install && npm run dev
```

API sketch from the UIs: [docs/api-requirements-draft.md](./docs/api-requirements-draft.md).
