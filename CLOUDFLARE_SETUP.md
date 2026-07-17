# DNS & Deployment Setup for performalytic.com

Domain registered at **Squarespace Domains** (legacy Google Domains migrated to Squarespace). Two paths:

---

## Option A: GitHub Pages Only (via Squarespace DNS)

Skip Cloudflare. Point Squarespace DNS directly to GitHub Pages.

### 1. Squarespace DNS Records

In [account.squarespace.com/domains](https://account.squarespace.com/domains) → performalytic.com → **DNS Settings** → **Add Record**:

| Type | Host/Name | Data                                     |
|------|-----------|------------------------------------------|
| A    | `@`       | `185.199.108.153`                        |
| A    | `@`       | `185.199.109.153`                        |
| A    | `@`       | `185.199.110.153`                        |
| A    | `@`       | `185.199.111.153`                        |
| CNAME | `www`    | `performalytic.github.io`                |

Delete any existing A, AAAA, or CNAME records for the root/www.

### 2. GitHub Pages

Repo **Performalytic/.com** → Settings → Pages:
- **Source**: GitHub Actions (already configured)
- **Custom domain**: `performalytic.com` → **Save**
- Wait for DNS check to pass (green tick, may take a few minutes)

### 3. Limitations (no Cloudflare)

| Feature                    | Status |
|----------------------------|--------|
| CSP (meta tag)             | ✅     |
| Referrer-Policy (meta tag) | ✅     |
| HSTS                       | ❌     |
| X-Content-Type-Options (HTTP header) | ❌ (meta works in some browsers but not enforced) |
| X-Frame-Options            | ❌     |
| Permissions-Policy (HTTP)  | ❌     |
| Remove `Server` header     | ❌     |
| Security Headers score     | ~D     |
| Mozilla Observatory        | ~D     |

---

## Option B: Cloudflare in Front (Recommended)

Add Cloudflare between Squarespace and GitHub Pages for full header control, CDN, DDoS protection, and SSL management.

### 1. Add Site to Cloudflare

- Go to [cloudflare.com](https://cloudflare.com) → **Add site**
- Enter `performalytic.com`
- Select **Free** plan
- Cloudflare will scan existing DNS records

### 2. Update Nameservers in Squarespace

Cloudflare will show two nameservers (e.g. `arch.ns.cloudflare.com`, `zara.ns.cloudflare.com`).

In [account.squarespace.com/domains](https://account.squarespace.com/domains) → performalytic.com → **DNS Settings** → **Nameservers** → **Use custom name servers** → enter Cloudflare's nameservers.

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
- Enforces HTTPS end-to-end
- Enables TLS 1.2 and 1.3 only (disables older protocols)
- This alone earns an **A** on SSL Labs; **A+** requires HSTS (see below)

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

### 7. HSTS Preload

After HSTS is live for a few days, submit to [hstspreload.org](https://hstspreload.org).
SSL Labs score: **A+** once HSTS preload is approved.

### 8. Remove Server Header (Optional Workaround)

Cloudflare strips its own `Server: cloudflare` header on Free plan — you can't remove `cf-ray` but that's fine. No action needed.

---

## Additional Security Hardening (Applies to Both Paths)

### Subresource Integrity (SRI)

Add `integrity` attributes to external resources to prevent CDN compromise.

For Google Fonts stylesheet: fetch the current hash and add `integrity="sha384-..." crossorigin="anonymous"`.

If you add any third-party JS (analytics, etc.), always include SRI.

### Email Obfuscation

The contact email in the HTML uses machine-readable `mailto:` — acceptable for a contact form, but to further reduce spam:

- Use Cloudflare's **Email Address Obfuscation** (Cloudflare dashboard → Scrape Shield → Email Address Obfuscation) — automatically enabled for proxied traffic.

### Cookie-less Origin

No cookies, no tracking scripts, no `Set-Cookie` headers — this is ideal for both security and performance. Maintain this unless analytics are required.

If analytics are added later, prefer:
- Cloudflare Web Analytics (privacy-first, no cookies)
- Plausible / Fathom / Umami (GDPR-compliant, cookie-less)
- Avoid Google Analytics (requires cookie consent banner)

### Remove Server-Side Fingerprints

GitHub Pages does not expose a `Server` header beyond `server: GitHub.com`. This is acceptable. No `X-Powered-By`, no framework fingerprints.

### Logout / Session (N/A)

Static site — no login, no sessions. This eliminates entire attack classes (session fixation, CSRF, XSS sessions).

### Form Security

Already implemented: `form-action https://performalytic.com` in CSP prevents form-jacking. Form handler (server-side) should additionally validate `Content-Type` and origin.

---

## Scoring Targets

Once Option B + hardening is complete:

| Tool                 | Target Score |
|----------------------|--------------|
| securityheaders.com  | **A+**       |
| SSL Labs             | **A+**       |
| Mozilla Observatory  | **A+** ~130  |
| Google PageSpeed     | **90+**      |
| GTmetrix             | **A**        |
| Core Web Vitals      | **Pass**     |
