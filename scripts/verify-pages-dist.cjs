/** Ensures Cloudflare Pages will receive a complete, installable Vite output.
 * Run only AFTER npm run build; intentionally no Cloudflare API credentials.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
function exists(relative){return fs.existsSync(path.join(dist,relative));}
for(const file of ['index.html','sw.js','manifest.webmanifest','_headers','icon-192.png','icon-512.png']){
  assert(exists(file),'Vite dist/ must include '+file);
}
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(dist,'sw.js'),'utf8');
const headers=fs.readFileSync(path.join(dist,'_headers'),'utf8');
assert(html.includes('manifest.webmanifest'),'built HTML must link the PWA manifest');
assert(/assets\/[^"']+\.js/.test(html),'built HTML must include a compiled JS asset');
assert(sw.includes('frame-one-pwa-'),'offline worker cache must be content-addressed');
assert(sw.includes('const PRECACHE='),'offline worker must precache production assets');
assert(sw.includes('assets/')&&sw.includes('.js')&&sw.includes('.css'),'offline cache must include compiled JS and CSS');
assert(headers.includes('/sw.js')&&headers.includes('Cache-Control: no-cache'),'Pages must revalidate its service worker');
assert(!exists('404.html'),'SPA fallback requires no top-level 404.html');
console.log('PASS: Cloudflare Pages dist includes HTML, hashed assets, offline PWA, icons and cache-refresh headers.');
