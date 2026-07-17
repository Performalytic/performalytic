# Security Audit Report — Performalytic

**Date:** July 17, 2026  
**Scope:** Full codebase audit  
**Target:** https://performalytic.com  

---

## 1. Executive Summary

The Performalytic website codebase is a **legitimate business website** for a data analytics / AI / DevOps consulting firm. No phishing, fraud, credential harvesting, obfuscation, or malicious code was found. Security vendor flags (alphaMountain.ai, BitDefender, Fortinet, etc.) are likely **domain/reputation-based false positives** — not code-level threats.

---

## 2. Scan Results by Category

| # | Check | Status | Details |
|---|-------|--------|---------|
| 1 | Hardcoded suspicious URLs/domains | ✅ Clean | Only `performalytic.com` and legitimate third-party services |
| 2 | Form data exfiltration | ✅ Clean | Contact form submits to **Google Forms** (standard pattern) |
| 3 | Credential/payment collection | ✅ Clean | Only name, email, phone, company, message collected with consent checkbox |
| 4 | Login page mimicry | ✅ Clean | No login, sign-in, or credential pages exist |
| 5 | Obfuscated JavaScript | ✅ Clean | All JS is readable, well-structured |
| 6 | eval() / dynamic code execution | ✅ Clean | None found |
| 7 | Redirects to unknown URLs | ✅ Clean | Only HTTPS upgrade in web.config |
| 8 | Iframes/embeds loading external content | ✅ Clean | Tawk.to chat widget (legitimate live chat) |
| 9 | Base64-encoded suspicious strings | ✅ Clean | None found |
| 10 | Crypto-mining scripts | ✅ Clean | None found |
| 11 | Tracking / analytics | ✅ Declared | Google Analytics 4 (G-FV09CSCD2C) — declared in CSP |

---

## 3. External Services Used

| Service | Purpose | CSP Allowed |
|---------|---------|-------------|
| Google Analytics 4 | Analytics | ✅ script-src, img-src, connect-src |
| Tawk.to | Live chat widget | ✅ script-src, style-src, font-src, img-src, frame-src, connect-src |
| Google Fonts | Typography | ✅ style-src, font-src |
| Google Forms | Form backend | ✅ form-action, connect-src |
| LinkedIn | Social link | ✅ (external link, no script) |

---

## 4. Security Posture

| Measure | Status |
|---------|--------|
| Content-Security-Policy | ✅ Strict — nonce-based, `strict-dynamic`, `upgrade-insecure-requests` |
| form-action restriction | ✅ Restricted to `self` and `docs.google.com` |
| X-Content-Type-Options | ✅ `nosniff` |
| Referrer-Policy | ✅ `strict-origin-when-cross-origin` |
| Permissions-Policy | ✅ Camera, mic, geolocation, interest-cohort all denied |
| HTTPS enforcement | ✅ `upgrade-insecure-requests` in CSP |
| No cookies / sessions | ✅ No login system, no session cookies |
| Robots directives | ✅ `index, follow` with snippet/image controls |

---

## 5. File Inventory

### HTML Pages (15)
- `index.html` — Homepage
- `404.html` — Custom 404
- `about/index.html` — About page
- `contact/index.html` — Contact page
- `careers/index.html` — Careers
- `privacy-policy/index.html` — Privacy policy
- `terms-conditions/index.html` — Terms & conditions
- `enterprise-solution-development/index.html` — Service page
- `advanced-analytics-ai/index.html` — Service page
- `bi-integration/index.html` — Service page
- `application-development-and-system-integration/index.html` — Service page
- `blog/index.html` — Blog listing
- `blog/data-driven-decision-making/index.html` — Blog post
- `blog/ai-business-intelligence/index.html` — Blog post
- `blog/devops-best-practices/index.html` — Blog post

### Assets
- `assets/js/main.js` — Main JavaScript
- `assets/css/styles.css` — Stylesheet
- `assets/docs/csp-policy.md` — CSP documentation
- 35+ images in `assets/images/`

### Config / Infrastructure
- `web.config` — IIS/Static hosting config
- `robots.txt` — Search engine directives
- `sitemap.xml` — XML sitemap
- `CNAME` — Custom domain config
- `.github/workflows/static.yml` — GitHub Pages deploy workflow

---

## 6. Contact Form Analysis

| Field | Type | Required | Destination |
|-------|------|----------|-------------|
| First name | text | Yes | Google Forms |
| Last name | text | Yes | Google Forms |
| Company | text | No | Google Forms |
| Work email | email | Yes | Google Forms |
| Phone | tel | No | Google Forms |
| Service interest | select | No | Google Forms |
| Message | textarea | No | Google Forms |
| Consent checkbox | checkbox | Yes | Not submitted |

**Submission method:** `fetch()` with `mode: 'no-cors'` to Google Forms endpoint.  
**Privacy:** Consent checkbox required with link to Privacy Policy.  
**No credentials, no payment data, no sensitive personal information collected.**

---

## 7. Recommendations

1. **Dispute false positives** — Submit a re-evaluation request to each flagged security vendor:
   - alphaMountain.ai
   - BitDefender
   - Fortinet
   - G-Data
   - Sophos
   - Gridinsoft
   - ADMINUSLabs
   - Chong Lua Dao
   - CyRadar
   - Lionic

2. **Consider DNSSEC** — Add DNSSEC records at your DNS provider to strengthen domain reputation.

3. **Monitor regularly** — Use a tool like VirusTotal or URLScan.io to monitor domain reputation over time.

---

## 8. Verdict

**LEGITIMATE** — No phishing, fraud, or malicious code detected. The codebase is clean, well-structured, and security-conscious.
