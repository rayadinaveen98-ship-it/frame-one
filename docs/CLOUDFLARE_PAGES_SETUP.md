# Frame One — Cloudflare Pages deployment and frequent-update workflow

**Decision:** Cloudflare Pages with **GitHub integration**. No Vercel deployment for Frame One. This repository remains source of truth.

## Readiness status

- Source-side Cloudflare configuration is committed and validated through GitHub CI.
- **Cloudflare account Git authorization/project creation is not done from this chat.** The Cloudflare dashboard owner must authorize the GitHub app and create the Pages project once. Do not claim a live URL until the dashboard confirms a successful deployment.
- We will use **Cloudflare Pages**, not a separate Workers Git build or a Wrangler Direct Upload project.

## One-time Cloudflare dashboard connection

1. Open [Cloudflare dashboard → Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages). Choose **Create** → **Pages** → **Connect to Git / Import Git repository** (wording may vary).
2. Authorize Cloudflare's GitHub integration if prompted, granting access to **`rayadinaveen98-ship-it/frame-one`**. Do not copy a personal GitHub token or Cloudflare API secret into chat or commit credentials to Git.
3. Select the repository, set project name to `frame-one-learn-cinema` if Cloudflare says it is available, and use these *exact build settings*:

   | Setting | Value |
   |---|---|
   | Framework preset | **React (Vite)** or Vite |
   | Production branch | `main` |
   | Root directory | `/` (repository root) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node.js version | `22` (pinned by `.node-version`) |
   | Environment variables / secrets | **None** for this static prototype |

4. Click **Save and Deploy**; wait for the deployment to show **Success**. Cloudflare supplies a real address such as `https://<chosen-project>.pages.dev`. This example is **not a verified current URL**.
5. Open the URL on desktop and phone. Test Home, Learn, 33 lessons, each of the seven labs, saved storyboard, export/restore, and install/offline. Copy the **exact** verified Pages URL to `docs/DEPLOYMENT_STATUS.md` after it succeeds.

## Every later development iteration

- On `main` push → Cloudflare automatically builds/publishes the new production version to the **same address**. The change goes live after a *successful* deployment, **not instantaneously during editing**.
- The separate GitHub Actions Chromium suite runs on source/tests changes; Cloudflare may deploy in parallel unless branch protections/release branches are configured.
- For riskier redesigns, push an `experiment/*` branch and use Cloudflare's **preview deployment** link, then merge after QA. Preview URLs can be shared without changing production.
- Pages already revalidates assets by default. `public/_headers` explicitly revalidates `/`, `/index.html`, `/sw.js` and `/manifest.webmanifest`; the Vite build creates hashed JS/CSS and `scripts/generate-offline.cjs` produces an offline service worker with a content-specific cache version.
- To see new changes, **reload the same site** after Cloudflare marks the deployment successful. When a newer service worker takes control, Frame One shows a **Refresh now** notice rather than silently discarding the current UI.
- Saved lessons, notes and storyboards use **origin-local browser storage**, not a server database. Staying on the same `*.pages.dev` URL keeps the same origin and stored data; preview URLs/custom domains are *different origins* and do not automatically share saved state. Use the built-in JSON export/import to migrate data when switching sites.

## Important acceptance / troubleshooting

- Confirm a real Cloudflare build logs `npm run build`, output `dist`, and no Cloudflare/Vite/TypeScript errors.
- Verify response headers on deployed `/sw.js` and `/index.html` and confirm that browser reload after deployment shows the newly generated app version.
- Verify PWA navigation and an offline reload after first online load. Service workers require HTTPS (except localhost).
- If the browser seems stale after Cloudflare says success, refresh, close/reopen the installed PWA, then inspect service-worker updates / browser storage without deleting saved learner data.
- **Do not publish a guessed pages.dev URL.** The project name might be taken or the account might choose another name.
- HTTPS deployment is **not** the same as Android APK or iOS/TestFlight validation. Filmmaking/Telugu factual review, real audio-device testing and accessibility review are separate pending release gates.

Official reference: [Cloudflare Pages GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/), [Cloudflare Pages build image](https://developers.cloudflare.com/pages/configuration/build-image/) and [Vite's Cloudflare Pages guide](https://vite.dev/guide/static-deploy).
