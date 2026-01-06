# Ina Dalinger – Friseurmeisterin

Static Astro + Tailwind site built for GitHub Pages at https://varane.github.io/Friseurmeisterin/.

## Quick start

```bash
npm install
npm run dev
```

## Deployment (GitHub Pages)

1. Go to **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` and the workflow in `.github/workflows/deploy.yml` will build and deploy.

## Content editing (Decap CMS)

The CMS lives at `/admin` (e.g. `https://varane.github.io/Friseurmeisterin/admin`). It edits JSON content stored in the repo.

### OAuth proxy setup (Cloudflare Workers)

Decap CMS requires an OAuth proxy for GitHub authentication on GitHub Pages.

1. Create a GitHub OAuth App
   - **Homepage URL:** `https://varane.github.io/Friseurmeisterin/`
   - **Authorization callback URL:** `https://AUTH.your-domain.com/callback`
2. Create a Cloudflare Worker using the Decap OAuth proxy template.
   - Example repo: https://github.com/decaporg/decap-cms-oauth-provider
3. In the Worker settings, add the secrets:
   - `OAUTH_CLIENT_ID`
   - `OAUTH_CLIENT_SECRET`
4. Deploy the Worker and note the public URL (e.g. `https://AUTH.your-domain.com`).
5. Update `/public/admin/config.yml` → `backend.base_url` with your Worker URL.

> Never commit OAuth secrets into this repo. They belong in the Worker environment only.

## Managing images

Place images in `/public/images/`:

- `hero/` → hero image
- `portfolio/` → gallery images
- `products/` → product shots
- `uploads/` → CMS uploads

The site will still build if some images are missing.

## Data files

- `/src/data/site.json` → business info + landing page content placeholders
- `/src/data/products.json` → product catalog for the shop
- `/src/data/policies.json` → shipping/returns placeholders

## Stripe payment links

Each product includes a `paymentLinkUrl`. If missing or empty, the “Buy now” button is disabled and a placeholder message appears.

## Notes

- No backend required.
- All content is placeholder text until updated.
