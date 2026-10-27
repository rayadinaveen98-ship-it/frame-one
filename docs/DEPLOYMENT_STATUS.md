# Frame One — Cloudflare web deployment truth

**Checked:** 27 October 2026. **Chosen provider and existing account project: Cloudflare Workers (static assets), project `frame-one`**, connected to the GitHub repository `rayadinaveen98-ship-it/frame-one`. A **verified live HTTPS URL has not been provided or independently checked**.

## Confirmed repository configuration

- `wrangler.jsonc` identifies the Worker `frame-one`, publishes `./dist` static assets and uses SPA fallback.
- Worker build settings previously shown in the Cloudflare account screenshot: `npm run build` followed by `npx wrangler deploy`; repository branch `main`.
- Node 22, TypeScript/Vite production build, offline precache, PWA assets and refresh UI are present.
- GitHub Actions builds and performs **Wrangler dry runs**, plus full Chromium desktop/phone tests. A dry run proves source configuration, **not actual Cloudflare account deployment**.
- The Worker guide is [CLOUDFLARE_WORKERS_SETUP.md](CLOUDFLARE_WORKERS_SETUP.md). The earlier [Pages guide](CLOUDFLARE_PAGES_SETUP.md) is historical, not a reason to create a second Pages project.

## Still unverified, must not be claimed

- The Cloudflare dashboard's latest production deployment actually completed successfully
- Exact Cloudflare `workers.dev` / custom-domain URL serving current Frame One
- Whether pushing `main` updates the connected live Worker automatically
- Live HTTPS PWA install, service-worker refresh, real offline reopen and origin-specific backup migration

No Cloudflare account-management connector is currently available, and prior project records contain **no user-confirmed Frame One live URL**. Do not invent a `workers.dev` account subdomain or reuse other project links.

## How to close this gate

1. Inspect the existing Cloudflare **Workers & Pages → frame-one → Deployments** view, confirm the latest production deployment is **Success**, and copy the displayed production URL from **Domains/Overview**.
2. Test that exact production URL for the Frame One home, chapter explorer, a lesson, all seven labs and offline reload.
3. Confirm a later GitHub `main` push triggers a new Cloudflare production deployment and update notice without a new domain.
4. Test moving local progress by exporting a JSON backup (or the v0.9G private copy/paste fallback) and importing it in a separate origin/profile. Do not overwrite real learner data without a verified backup.

## Technical verification already achieved

- [Web build and Cloudflare dry run 40478349107](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478349107) — success for v0.9F.
- [Compiled Chromium QA 40478349333](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478349333) — success for v0.9F.
- [v0.9G PR browser QA 40480298910](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40480298910) — success, including portable text backup. **Post-merge checks are separate.**

## Release boundary

Public GitHub Android debug APK downloads are verified separately. A published APK **does not** prove a Cloudflare-hosted site has deployed, and a green Chrome browser run **does not** replace physical Android/iPhone QA.
