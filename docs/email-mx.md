# Email for @kayamrutfarms.in

Website DNS is on Cloudflare. The MX/SPF warning is only about **mail**, not the shop.

## Option A — Hostinger Email

1. Hostinger → Emails → create mailbox (e.g. `hello@kayamrutfarms.in`)
2. Copy the MX / SPF / DKIM records Hostinger shows
3. Cloudflare → DNS → add those records (**DNS only** / grey cloud for MX)

## Option B — Google Workspace / Microsoft 365

Same idea: add their MX + SPF/DKIM in Cloudflare DNS.

## Not required for checkout

Orders are created in the API/admin today without transactional email. Add mail when you want customer receipts.
