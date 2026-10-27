# Frame One — web deployment status

**Hosting decision:** Cloudflare Pages (Git integration), not Vercel.  
**Last checked:** 27 October 2026.

## GitHub source is prepared

- `.node-version` fixes the Cloudflare Pages build runtime to Node.js 22.
- `npm run build` compiles TypeScript/React/Vite, generates actual offline precache; Pages publishes `dist/`.
- `public/_headers` revalidates the HTML shell, manifest and service worker so frequent GitHub redeployments do not leave stale browser resources.
- `src/pwa.ts` requests worker update on load; `App.tsx` offers a safe, user-driven **Refresh now** notice after an updated worker takes control. No forced refresh while writing.
- `tests/verify-cloudflare.cjs` guards the source setup; `scripts/verify-pages-dist.cjs` checks the *actual* built output. Both are part of GitHub browser CI.
- Instructions for one-time authorization: [Cloudflare Pages setup](CLOUDFLARE_PAGES_SETUP.md).

## Still pending — account-side, cannot be completed via currently connected tools

- Cloudflare Pages project creation and **GitHub repository authorization** must be carried out in the Cloudflare account dashboard. ChatGPT's available connected tools can update GitHub but do not have direct access to the Cloudflare account.
- Therefore there is **no verified live Frame One `pages.dev` address yet**. Do not infer one from proposed project names.
- First real Cloudflare Pages build and public site inspection are pending, even after GitHub Actions succeeds.
- Android APK, iOS package, independent learner-device/audio/accessibility/content review are separate release gates.

## Intended operational flow

GitHub push to `main` → Cloudflare Git integration builds `npm run build` → publishes `dist` to the same HTTPS Pages URL → user opens/reloads that link. Production deploy after successful build, not instantly while code is being written. For risky experiments, use GitHub feature branches and Cloudflare preview URLs.

**Next action:** connect [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages) to the existing GitHub repository using the exact values in [setup](CLOUDFLARE_PAGES_SETUP.md). Once the first successful deployment exists, add its actual dashboard URL here and conduct the live-update/offline/backup QA.

## Verified GitHub preparation gate

- [GitHub Actions run 40468085250](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40468085250): **SUCCESS** after adding the built-`dist` verification; the production Vite output contains the Cloudflare-ready PWA, offline worker, icons and `_headers`.
- [GitHub Actions run 40468172467](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40468172467): **SUCCESS** for the in-app user-controlled refresh notice after a new service worker takes control, alongside the full desktop/mobile browser smoke test.
- **Result:** repository is ready to connect to Cloudflare Pages. This is proof of the source/build pipeline, **not** a Cloudflare dashboard deployment or public link.


## New account evidence: Cloudflare Workers project, not Pages (27 October 2026)

The screenshot from Cloudflare shows **Workers & Pages → frame-one → Production → Deployments**, connected to `rayadinaveen98-ship-it/frame-one` with build command `npm run build` and deploy command `npx wrangler deploy`. This is a **Workers Builds** project; it was **Deploying**, not yet verified successful at screenshot time.

To reuse the existing setup, `wrangler.jsonc` now defines the same Worker `frame-one`, serves `./dist` as static assets and enables SPA routing. Cloudflare Workers Builds supports automatic GitHub deploys, and Workers static assets reads our existing `_headers`. A new [Workers setup guide](CLOUDFLARE_WORKERS_SETUP.md) supersedes the earlier [Pages-only instructions](CLOUDFLARE_PAGES_SETUP.md) for this already-created Cloudflare service.

**Current blocker:** we cannot directly query this Cloudflare account. The actual `workers.dev` URL and whether the latest Cloudflare deploy succeeded are still unverified. Confirm both in Cloudflare's **Overview/Deployments** after the new GitHub commit.
