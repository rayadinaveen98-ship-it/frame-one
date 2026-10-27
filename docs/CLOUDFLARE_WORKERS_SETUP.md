# Frame One — Cloudflare Workers static-site deployment

**Confirmed from Cloudflare account screenshot, 27 October 2026:** A Cloudflare **Workers** project called `frame-one` is connected to the GitHub repository `rayadinaveen98-ship-it/frame-one` on `main`. Its build command is `npm run build`, deploy command is `npx wrangler deploy`, and root directory is `/`. The provided screenshot showed **Deploying in progress**, not completed.

## Why we are keeping this setup

Cloudflare Workers Builds, like Cloudflare Pages Git integration, can automatically rebuild and publish on every push to the connected GitHub branch. The existing Cloudflare account project does **not** have to be discarded or recreated to meet the user's rapid live-preview goal. The distinction is the deploy command: **Workers uses `wrangler deploy`, not Pages' `dist` output setting**.

## Repository configuration

`wrangler.jsonc` now explicitly matches the existing project:

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "frame-one",
  "compatibility_date": "2026-10-27",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

- **Build:** `npm run build` compiles Vite into `dist`, including app HTML, hashed JS/CSS, icons, manifest, `_headers`, and the generated offline service worker.
- **Deploy:** `npx wrangler deploy` uploads `dist` assets and serves the app from the Worker. No Worker JS API script is required for this static React SPA.
- `assets.not_found_handling` handles client-side SPA navigation.
- `public/_headers` sets safe revalidation behavior for the PWA shell and service worker. Cloudflare Workers static assets supports this same `_headers` convention.
- **Automation:** Workers Builds can trigger on GitHub `main` pushes; confirm this is enabled under the Cloudflare project's **Settings → Builds**. The first screenshot says "Manually deployed" and showed an active build; that alone does not prove subsequent automatic production deploys.
- **CI:** GitHub Actions checks `npm test`, `npm run build`, production assets, `npx --yes wrangler@4 deploy --dry-run` and full desktop/mobile Chromium smoke. The dry run validates deployment *without publishing or requiring the Cloudflare account token*.

## Verifying first actual deployment

1. In the existing Cloudflare project `frame-one`, open **Deployments** and examine the **latest** build after the `wrangler.jsonc` commit. Confirm **Deploying** finishes as **Success**. The initial in-progress build may have used an older commit, and can fail without the new Wrangler file.
2. Go to **Overview** or **Domains** and copy the **actual HTTPS Worker URL** from Cloudflare. Do not guess a `workers.dev` address, project name or account subdomain.
3. Open the Worker URL and check Home, all seven labs, chapter/lesson routes and draft persistence. Export a JSON backup before changing URL or browser data.
4. Confirm **Settings → Builds** has production branch `main`, Git repository connected and automatic build/deploy on pushes enabled. A push after this configuration should trigger a new build without pressing a manual Deploy button.
5. After a future update succeeds, reload the **same** Worker URL. The PWA has a content-hashed offline cache and a non-disruptive refresh notice.

## Work not yet proven by the screenshot

- Cloudflare **deployment success** and real site URL
- The Worker URL actually serving Frame One
- Automatic *subsequent* GitHub pushes triggering production builds
- Real-device Sound/WebAudio, iPhone Safari and Android PWA installation
- Native APK/iOS application packaging, accessibility/educational content review

We are using **Cloudflare Workers static assets** for the repository's *existing* Cloudflare integration. Cloudflare Pages was the initial recommendation, and its separate setup is documented in [CLOUDFLARE_PAGES_SETUP.md](CLOUDFLARE_PAGES_SETUP.md), but a second Pages project is unnecessary unless specifically requested.

Official: [Workers static assets](https://developers.cloudflare.com/workers/static-assets/), [SPA routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/), [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).
