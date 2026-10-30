# Deploy — Cloudflare account + hybrid origin

**Ops email (locked):** `vksorganicfoods@gmail.com`  
**GitHub:** keep on the existing personal account (`niketanbothe01/Kayamrut-Farms`) — separate is fine.  
**Budget:** Lean MVP.

## What goes where

| Piece | Host | Cloudflare account? |
| --- | --- | --- |
| DNS / TLS / WAF | Cloudflare | Yes — `vksorganicfoods@gmail.com` |
| Storefront Next | Cloudflare **Pages** | Yes |
| Admin Next | Cloudflare **Pages** (2nd project) | Yes |
| Product images | Cloudflare **R2** (soon) | Yes |
| Laravel API + MySQL | **Not** CF Workers (no PHP) → Railway or VPS | DNS CNAME on CF only |

## You create (with `vksorganicfoods@gmail.com`)

1. **Cloudflare account** → https://dash.cloudflare.com/sign-up  
2. Add domain (existing `kayamrutfarms.com` or new) → switch nameservers at registrar.  
3. In Cloudflare dashboard → **Workers & Pages** → create two Pages projects later (we’ll wire GitHub).  
4. Optional: create **API Token** (template “Edit Cloudflare Workers” + Zone DNS Edit) and store it for deploy — do **not** paste tokens into chat if avoidable; use CF dashboard GitHub integration instead.

## Connect GitHub (other account) to Cloudflare

In Pages → Connect to Git → authorize **the GitHub account that owns** `niketanbothe01/Kayamrut-Farms`.  
Cloudflare login email ≠ GitHub account is normal.

## Still needed (not Cloudflare)

| Account | Email suggestion |
| --- | --- |
| Railway (or VPS) | same `vksorganicfoods@gmail.com` |
| Razorpay / Cashfree | business email when checkout is ready |
| Resend | same ops email |

## After accounts exist

Tell the agent: Cloudflare login done + domain added (or “using `*.pages.dev` first”).  
Then we add Pages build config for `frontend/` and `admin/` and deploy API to Railway.
