# DNS & Deployment Setup for performalytic.com

Domain registered at **Google Domains**. Two paths:

---

## Option A: GitHub Pages Only (via Google Domains DNS)

Skip Cloudflare. Point Google Domains directly to GitHub Pages.

### 1. Google Domains DNS Records

In [domains.google.com](https://domains.google.com) → performalytic.com → DNS → **Manage custom records**:

| Type | Name  | Data                                     |
|------|-------|------------------------------------------|
| A    | `@`   | `185.199.108.153`                        |
| A    | `@`   | `185.199.109.153`                        |
| A    | `@`   | `185.199.110.153`                        |
| A    | `@`   | `185.199.111.153`                        |
| CNAME | `www` | `performalytic.github.io`               |

Delete any existing A, AAAA, or CNAME records for the root/www.

### 2. GitHub Pages

Repo **Performalytic/.com** → Settings → Pages:
- **Source**: GitHub Actions (already configured)
- **Custom domain**: `performalytic.com` → **Save**
- Wait for DNS check to pass (green tick, may take a few minutes)

### 3. Limitations (no Cloudflare)

- No custom HTTP response headers (CSP stays as `<meta>` tag)
- No HSTS, no `X-Content-Type-Options` header enforcement
- CDN provided by GitHub Pages only

---

## Option B: Cloudflare in Front (Recommended)

Add Cloudflare between Google Domains and GitHub Pages for full header control, CDN, DDoS protection, and SSL management.

### 1. Add Site to Cloudflare

- Go to [cloudflare.com](https://cloudflare.com) → **Add site**
- Enter `performalytic.com`
- Select **Free** plan
- Cloudflare will scan existing DNS records

### 2. Update Nameservers in Google Domains

Cloudflare will show two nameservers (e.g. `arch.ns.cloudflare.com`, `zara.ns.cloudflare.com`).

In [domains.google.com](https://domains.google.com) → performalytic.com → **DNS** → **Nameservers** → **Use custom name servers** → enter Cloudflare's nameservers.

### 3. DNS Records in Cloudflare

| Type  | Name | Target                    | Proxy |
|-------|------|---------------------------|-------|
| CNAME | `@`  | `performalytic.github.io` | ✅    |
| CNAME | `www` | `performalytic.github.io` | ✅    |

(Remove any existing A/AAAA records for `@` — Cloudflare's proxied CNAME uses CNAME flattening for the apex.)

### 4. Verify GitHub Pages

In GitHub repo **Performalytic/.com** → Settings → Pages:
- **Source**: GitHub Actions
- **Custom domain**: `performalytic.com` (should show **DNS check successful**)

### 5. SSL/TLS

Cloudflare Dashboard → SSL/TLS → **Full (strict)**

### 6. Response Headers via Transform Rules

Cloudflare Dashboard → Rules → Transform Rules → **HTTP Response Headers** → Create rule:

**Rule 1 — Security headers** (apply to all requests)
```
Strict-Transport-Security:        max-age=63072000; includeSubDomains; preload
X-Content-Type-Options:           nosniff
X-Frame-Options:                  DENY
Referrer-Policy:                  strict-origin-when-cross-origin
Permissions-Policy:               geolocation=(), microphone=(), camera=(), payment=(), usb=()
```

**Rule 2 — Content-Security-Policy** (apply to all requests — after this is live, **remove** `<meta http-equiv="Content-Security-Policy">` from `index.html`)
```
Content-Security-Policy:          default-src 'self'; script-src 'self' 'nonce-P3rf0rm4lyt1c' 'strict-dynamic'; style-src 'self' https://fonts.googleapis.com 'nonce-P3rf0rm4lyt1c'; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' https://performalytic.com data:; form-action https://performalytic.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests
```

### 7. HSTS Preload (Optional)

After HSTS is live for a few days, submit to [hstspreload.org](https://hstspreload.org).
