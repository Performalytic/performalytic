# Content Security Policy (CSP)

All CSP policies are set via `<meta http-equiv="Content-Security-Policy">` in the `<head>` of each page.

## Two CSP Variants

### 1. Main Pages (11 files + Blog Index)

**Files:**
- `/index.html`
- `/about/index.html`
- `/contact/index.html`
- `/careers/index.html`
- `/advanced-analytics-ai/index.html`
- `/bi-integration/index.html`
- `/enterprise-solution-development/index.html`
- `/application-development-and-system-integration/index.html`
- `/terms-conditions/index.html`
- `/privacy-policy/index.html`
- `/blog/index.html`

**Policy:**
```
default-src 'self';
script-src 'self'
    https://www.googletagmanager.com
    https://www.google-analytics.com
    https://embed.tawk.to
    'nonce-P3rf0rm4lyt1c'
    'strict-dynamic';
style-src 'self'
    'unsafe-inline'
    https://fonts.googleapis.com
    https://embed.tawk.to;
font-src 'self'
    https://fonts.gstatic.com
    https://embed.tawk.to
    data:;
img-src 'self'
    https://www.google-analytics.com
    https://*.tawk.to
    https://cdn.jsdelivr.net
    data:;
connect-src 'self'
    https://www.google-analytics.com
    https://analytics.google.com
    https://*.tawk.to
    wss://*.tawk.to;
frame-src 'self'
    https://docs.google.com
    https://*.tawk.to;
base-uri 'self';
object-src 'none';
upgrade-insecure-requests
```

### 2. Blog Articles (3 files)

**Files:**
- `/blog/devops-best-practices/index.html`
- `/blog/ai-business-intelligence/index.html`
- `/blog/data-driven-decision-making/index.html`

**Policy:**
```
default-src 'self';
script-src 'self'
    https://www.googletagmanager.com
    https://www.google-analytics.com
    'nonce-P3rf0rm4lyt1c'
    'strict-dynamic';
style-src 'self'
    https://fonts.googleapis.com
    'nonce-P3rf0rm4lyt1c';
font-src 'self'
    https://fonts.gstatic.com
    data:;
img-src 'self'
    https://www.google-analytics.com
    data:;
connect-src 'self'
    https://www.google-analytics.com
    https://analytics.google.com;
frame-src 'self'
    https://docs.google.com;
base-uri 'self';
object-src 'none';
upgrade-insecure-requests
```

### 3. 404 Page

**File:** `/404.html`

**Policy:**
```
default-src 'self';
style-src 'self'
    https://fonts.googleapis.com;
font-src 'self'
    https://fonts.gstatic.com;
img-src 'self';
base-uri 'self';
object-src 'none';
upgrade-insecure-requests
```

## Source-to-Service Map

| Directive | Allowed Source | Purpose |
|-----------|---------------|---------|
| `script-src` | `https://www.googletagmanager.com` | Google Tag Manager |
| `script-src` | `https://www.google-analytics.com` | Google Analytics 4 |
| `script-src` | `https://embed.tawk.to` | Tawk.to live chat widget |
| `script-src` | `'nonce-P3rf0rm4lyt1c'` | Inline scripts on the page |
| `style-src` | `'unsafe-inline'` | Inline CSS (main pages only) |
| `style-src` | `https://fonts.googleapis.com` | Google Fonts stylesheets |
| `style-src` | `https://embed.tawk.to` | Tawk.to chat bubble styles |
| `font-src` | `https://fonts.gstatic.com` | Google Fonts font files |
| `font-src` | `data:` | Embedded fonts (if any) |
| `img-src` | `https://www.google-analytics.com` | Analytics tracking pixels |
| `img-src` | `https://*.tawk.to` | Tawk.to avatar/media |
| `img-src` | `https://cdn.jsdelivr.net` | CDN images |
| `img-src` | `data:` | Inline images |
| `connect-src` | `https://www.google-analytics.com` | GA4 data collection |
| `connect-src` | `https://analytics.google.com` | GA4 data collection |
| `connect-src` | `https://*.tawk.to` | Tawk.to API calls |
| `connect-src` | `wss://*.tawk.to` | Tawk.to WebSocket (live chat) |
| `frame-src` | `https://docs.google.com` | Google Forms iframe |
| `frame-src` | `https://*.tawk.to` | Tawk.to iframe |

## Notes

- `'strict-dynamic'` is used in `script-src` to allow trusted scripts to load additional scripts dynamically
- The nonce `P3rf0rm4lyt1c` is applied to all inline `<script>` and `<style>` blocks
- `'unsafe-inline'` in `style-src` is a fallback for browsers that don't support `strict-dynamic`
- `upgrade-insecure-requests` forces all HTTP requests to HTTPS
- Blog article pages and the 404 page have a more restrictive CSP (no Tawk.to, no `unsafe-inline`)
- The 404 page has no `script-src` directive (scripts are blocked entirely)
