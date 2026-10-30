# Deploy — Cloudflare account + hybrid origin

**Ops email (locked):** `vksorganicfoods@gmail.com`  
**Cloudflare account id:** `5aa6a6fea6b78242cb6dd7e1cbb0ed9f`  
**Workers & Pages:** https://dash.cloudflare.com/5aa6a6fea6b78242cb6dd7e1cbb0ed9f/workers-and-pages  
**GitHub:** personal account owns `niketanbothe01/Kayamrut-Farms` (email may differ — OK)  
**Budget:** Lean MVP · first deploys on `*.pages.dev` (custom domain later)

## What goes where

| Piece | Host |
| --- | --- |
| Storefront | Cloudflare Pages → root dir `frontend` |
| Admin | Cloudflare Pages → root dir `admin` |
| DNS / TLS / R2 | Cloudflare |
| Laravel + MySQL | Railway or VPS (not CF Workers) |

## Create Pages projects (do this in your Chrome)

You are already on **Workers & Pages**. The agent **cannot** open this dashboard.

**Domain not required.** Use free `*.pages.dev` until you buy one.

**Wrong path to avoid:** URL containing `/create/workers` with deploy command `npx wrangler deploy` — that is a **Worker**, not Next.js Pages. Hit **Back** and choose **Pages**.

### 1) Storefront

1. **Create** → choose **Pages** (not Workers) → **Connect to Git**  
2. Authorize GitHub account that owns `Kayamrut-Farms`  
3. Select repo `niketanbothe01/Kayamrut-Farms`  
4. Settings:
   - **Project name:** `kayamrut-storefront`
   - **Production branch:** `cursor/frontend-forest-gold-4b1a` *(or `main` once merged)*
   - **Root directory:** `frontend`
   - **Framework preset:** Next.js (or None)
   - **Build command:** `npm run build`
   - **Build output / deploy command:** follow CF Next.js preset if shown; otherwise we will add OpenNext next
5. **Save and Deploy**

### 2) Admin

Repeat Create → Pages → same repo:

- **Project name:** `kayamrut-admin`
- **Root directory:** `admin`
- **Production branch:** same as above
- **Build command:** `npm run build`

### 3) Reply here with

- Storefront URL (`*.pages.dev`)
- Admin URL (`*.pages.dev`)
- Any build error screenshot/text

## Still needed

| Account | Notes |
| --- | --- |
| Railway (or VPS) | Laravel API + MySQL — same ops email |
| Domain on CF | optional until `pages.dev` looks good |
| Razorpay / Resend | before paid checkout |

## Agent limitation

No access to your Chrome session or `dash.cloudflare.com` while logged in. Paste status/URLs/errors; do not paste API tokens into chat unless you intend to rotate them after.
