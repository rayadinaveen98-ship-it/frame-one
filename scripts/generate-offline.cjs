/* Dependency-free postbuild step: precache the actual hashed production JS/CSS and static art.
 * This avoids an installable PWA whose shell is cached while its lesson code isn't.
 */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const dist=path.resolve(process.env.FRAMEONE_DIST||path.join(root,'dist'));
const suffix=/\.(?:html|js|css|json|png|jpe?g|svg|webp|woff2?|webmanifest)$/i;
function collect(folder){return fs.readdirSync(folder,{withFileTypes:true}).flatMap(entry=>{
  const abs=path.join(folder,entry.name);
  return entry.isDirectory()?collect(abs):entry.isFile()&&suffix.test(entry.name)?[abs]:[];
});}
if(!fs.existsSync(path.join(dist,'index.html')))throw new Error('No Vite dist/index.html found. Build the web app first.');
const files=collect(dist).filter(x=>!x.endsWith('/sw.js')).sort();
const rels=files.map(file=>'./'+path.relative(dist,file).replaceAll(path.sep,'/'));
if(files.length<4||!rels.some(f=>f.endsWith('.js'))||!rels.some(f=>f.endsWith('.css')))throw new Error('Missing compiled JS/CSS. Refusing to publish incomplete offline cache.');
const total=files.reduce((n,f)=>n+fs.statSync(f).size,0);
if(total>20*1024*1024)throw new Error('Offline assets exceed 20 MiB; inspect large images/media before caching.');
const hash=crypto.createHash('sha256');
for(const file of files){hash.update(path.relative(dist,file));hash.update(fs.readFileSync(file));}
const name='frame-one-pwa-'+hash.digest('hex').slice(0,14);
const sw=`/* Generated only from built local assets. No external requests, user data or telemetry. */
const CACHE=${JSON.stringify(name)};
const PRECACHE=${JSON.stringify(rels)};
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('frame-one-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(res=>res.ok?res:Promise.reject(Error('offline'))).catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(res=>{
    if(!res.ok||res.type!=='basic')return res;
    const copy=res.clone();
    event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)));
    return res;
  })));
});
`;
fs.writeFileSync(path.join(dist,'sw.js'),sw);
console.log(`Offline worker ready: ${files.length} assets, ${(total/1024).toFixed(1)} KiB (${name}).`);
