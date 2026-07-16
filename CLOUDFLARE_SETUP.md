# Cloudflare Setup for performalytic.com

## 1. Add Site to Cloudflare

- Go to [cloudflare.com](https://cloudflare.com) → **Add site**
- Enter `performalytic.com`
- Select **Free** plan
- Cloudflare will scan existing DNS records

## 2. Update Nameservers

At your domain registrar, replace current nameservers with Cloudflare's (shown in Cloudflare dashboard):

```
arch.ns.cloudflare.com
zara.ns.cloudflare.com
```

## 3. DNS Records

| Type  | Name | Target                    | Proxy |
|-------|------|---------------------------|-------|
| CNAME | `@`  | `performalytic.github.io` | ✅    |
| CNAME | `www` | `performalytic.github.io` | ✅    |

(Remove any existing A/AAAA records for `@` that point to raw IPs.)

> Cloudflare's proxied (orange cloud) CNAME at the apex works via CNAME flattening; no A record needed.

## 4. Verify GitHub Pages

In GitHub repo **Performalytic/.com** → Settings → Pages:
- **Source**: Deploy from a branch (or GitHub Actions)
- **Custom domain**: `performalytic.com` (should show **DNS check successful** — the CNAME file already sets this)

## 5. Response Headers via Transform Rules

In Cloudflare dashboard → Rules → Transform Rules → **HTTP Response Headers** → Create rule:

**Rule 1 — Security headers** (apply to all requests)
```
Strict-Transport-Security:        max-age=63072000; includeSubDomains; preload
X-Content-Type-Options:           nosniff
X-Frame-Options:                  DENY
Referrer-Policy:                  strict-origin-when-cross-origin
Permissions-Policy:               geolocation=(), microphone=(), camera=(), payment=(), usb=()
```

**Rule 2 — Content-Security-Policy** (apply to all requests, **remove** `<meta http-equiv="Content-Security-Policy">` from `index.html` first)
```
Content-Security-Policy:          default-src 'self'; script-src 'self' 'nonce-P3rf0rm4lyt1c' 'strict-dynamic'; style-src 'self' https://fonts.googleapis.com 'nonce-P3rf0rm4lyt1c'; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' https://performalytic.com data:; form-action https://performalytic.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests
```

## 6. SSL/TLS

Cloudflare Dashboard → SSL/TLS → **Full (strict)** — requires a valid SSL cert on origin (GitHub Pages provides one for custom domains automatically).

## 7. HSTS Preload (Optional)

After HSTS is live for a few days, submit to [hstspreload.org](https://hstspreload.org).
