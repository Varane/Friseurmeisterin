# Ina Dalinger – Friseurmeisterin

Static, no-build website for GitHub Pages.

**Live URL:** https://varane.github.io/Friseurmeisterin/

## GitHub Pages setup (no Actions)

1. Go to **Settings → Pages**.
2. Set **Source** to **Deploy from a branch**.
3. Select **Branch: main** and **Folder: /(root)**.
4. Save. The site will be served at `https://varane.github.io/Friseurmeisterin/`.

## Editing content

All content is stored as JSON placeholders (no real business data):

- `/data/site.json` — business info, hero text, services, contact placeholders
- `/data/products.json` — product catalog, Stripe Payment Links
- `/data/policies.json` — shipping/returns placeholders

## Shop behavior

- `/shop/` renders products from `/data/products.json`.
- `/shop/product.html?slug=...` renders a product detail page with Stripe Payment Link.
- If `paymentLinkUrl` is empty, the checkout button is disabled.

## Images

Add images under `/images/`:

- `/images/hero/`
- `/images/portfolio/`
- `/images/products/`
- `/images/uploads/` (used by CMS)

The site is resilient if some images are missing.

## Admin (Decap CMS)

The CMS is available at `/admin/` and edits JSON files in `/data/`.

### OAuth proxy setup (GitHub Pages requirement)

Decap CMS needs an OAuth proxy because GitHub Pages is static.

1. Create a GitHub OAuth App
   - **Homepage URL:** `https://varane.github.io/Friseurmeisterin/`
   - **Authorization callback URL:** `https://AUTH.your-domain.com/callback`
2. Create a Cloudflare Worker using the Decap OAuth proxy template:
   - https://github.com/decaporg/decap-cms-oauth-provider
3. In the Worker settings, add secrets:
   - `OAUTH_CLIENT_ID`
   - `OAUTH_CLIENT_SECRET`
4. Deploy the Worker and copy the public URL (e.g. `https://AUTH.your-domain.com`).
5. Update `/admin/config.yml` → `backend.base_url` with your Worker URL.

> Never commit OAuth secrets into this repo. They must remain in the Worker environment.

## No build step

This repo contains only static HTML/CSS/JS/JSON. No npm, no bundlers, no GitHub Actions builds.
