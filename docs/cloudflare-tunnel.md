# Permanent API HTTPS — Cloudflare Tunnel

Storefront is HTTPS (`*.pages.dev`). Browsers block calls to plain `http://VPS:8080` (mixed content).

**Ops Cloudflare:** `vksorganicfoods@gmail.com` · account `5aa6a6fea6b78242cb6dd7e1cbb0ed9f`  
**VPS:** `root@200.234.39.233` · Docker API on `127.0.0.1:8080`

## Named tunnel (stable URL)

Needs a domain in this Cloudflare account (Hostinger free claim is fine).

### 1) Domain

1. Hostinger → claim free domain (or use one you own).
2. Cloudflare → **Add a site** → that domain → Free plan.
3. At the registrar, set the Cloudflare nameservers Cloudflare shows you.
4. Wait until Cloudflare marks the zone **Active**.

### 2) Create tunnel

1. https://one.dash.cloudflare.com/ → **Networks** → **Tunnels** → **Create a tunnel**
2. Connector: **Cloudflared**
3. Name: `kayamrut-api`
4. Copy the **install token** command (Debian / `cloudflared service install …`)

### 3) Install on VPS (keep quick tunnel open until this works)

```bash
# stop the temporary trycloudflare process only AFTER the named tunnel answers HTTPS
# (Ctrl+C in that SSH window later)

# run the install command Cloudflare shows, e.g.:
# sudo cloudflared service install <TOKEN>

sudo systemctl enable --now cloudflared
sudo systemctl status cloudflared --no-pager
```

### 4) Public hostname

In the tunnel → **Public Hostname** → **Add**:

| Field | Value |
| --- | --- |
| Subdomain | `api` |
| Domain | your domain |
| Type | HTTP |
| URL | `http://127.0.0.1:8080` |

Save. Test:

```bash
curl -sS https://api.YOUR_DOMAIN/api/health
```

### 5) Point Pages at it

Cloudflare Pages → `kayamrut-farms` → Settings → Variables:

`NEXT_PUBLIC_API_URL` = `https://api.YOUR_DOMAIN/api`

Redeploy production. Hard-refresh the shop.

## Temporary (what we used first)

```bash
cloudflared tunnel --url http://127.0.0.1:8080
# → https://….trycloudflare.com  (dies when the process stops)
```
