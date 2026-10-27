/** Cloudflare Pages deployment contract without dashboard credentials.
 * CI checks source; the browser workflow separately verifies built dist.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const pkg=JSON.parse(read('package.json'));
const worker=JSON.parse(read('wrangler.jsonc'));
assert.equal(worker.name,'frame-one','Wrangler targets the existing Cloudflare Worker');
assert.equal(worker.assets.directory,'./dist','Worker deploys the complete Vite dist');
assert.equal(worker.assets.not_found_handling,'single-page-application','Workers serves React routes');
assert(!('main' in worker),'Static-only Worker needs no server-side script');
const vite=read('vite.config.ts');
const headers=read('public/_headers');
const pwa=read('src/pwa.ts');
const app=read('src/App.tsx');
const html=read('index.html');
const worker=read('scripts/generate-offline.cjs');
assert.equal(read('.node-version').trim(),'22','Pages uses same Node.js major as GitHub Actions');
assert.match(pkg.scripts.build,/tsc --noEmit && vite build && node scripts\/generate-offline\.cjs/,'Cloudflare builds compiled React + offline worker');
assert.match(vite,/outDir:\s*'dist'/,'Cloudflare serves the dist directory');
assert.match(vite,/base:\s*'\.\/'/,'all PWA paths remain relative');
for(const endpoint of ['/','/index.html','/sw.js','/manifest.webmanifest']){
  const target=endpoint.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  assert.match(headers,new RegExp('(?:^|\\n)'+target+'\\n\\s+Cache-Control: no-cache, max-age=0, must-revalidate'),'revalidate '+endpoint);
}
assert.match(html,/rel="manifest"/,'PWA manifest linked from production shell');
assert.match(pwa,/serviceWorker\.register/,'app registers offline service worker');
assert.match(pwa,/registration\.update\(\)/,'updates checked on application open');
assert.match(pwa,/controllerchange/,'worker activation monitored');
assert.match(pwa,/frameone:pwa-update-ready/,'new worker announces a user-controlled refresh');
assert.match(app,/setUpdateReady\(true\)/,'React responds to a new deployment');
assert.match(app,/window\.location\.reload\(\)/,'refresh button actually reloads');
assert.match(app,/Finish what you're doing/,'unsaved editing not interrupted without prompt');
assert.match(worker,/frame-one-pwa-/,'service worker cache uses built hash');
assert.match(worker,/caches\.match\('\.\/index.html'\)/,'offline shell navigation kept');
console.log('PASS: Cloudflare Workers static-asset deployment plus Pages-compatible Vite/PWA build contract.');
