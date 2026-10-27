const fs=require('fs'),os=require('os'),path=require('path'),assert=require('assert'),cp=require('child_process');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'frame-one-offline-'));
try {
  fs.mkdirSync(path.join(dir,'assets'));
  fs.writeFileSync(path.join(dir,'index.html'),'<h1>Offline practice</h1>');
  fs.writeFileSync(path.join(dir,'assets','app-deadbeef.js'),'console.log("hello")');
  fs.writeFileSync(path.join(dir,'assets','app-deadbeef.css'),'body{color:white}');
  fs.writeFileSync(path.join(dir,'manifest.webmanifest'),'{}');
  const script=path.join(__dirname,'../scripts/generate-offline.cjs');
  const run=()=>cp.execFileSync(process.execPath,[script],{env:{...process.env,FRAMEONE_DIST:dir},encoding:'utf8',stdio:['ignore','pipe','pipe']});
  const a=run();const content=fs.readFileSync(path.join(dir,'sw.js'),'utf8');
  assert(a.includes('Offline worker ready'));
  assert(content.includes('assets/app-deadbeef.js'));
  assert(content.includes('assets/app-deadbeef.css'));
  assert(content.includes("caches.match('./index.html')"));
  assert(!content.includes('https://'));
  const same=run();assert(same.includes(a.match(/frame-one-pwa-[0-9a-f]+/)[0]));
  fs.writeFileSync(path.join(dir,'assets','app-deadbeef.js'),'console.log("changed")');
  assert(!run().includes(a.match(/frame-one-pwa-[0-9a-f]+/)[0]),'cache version changes with contents');
  fs.rmSync(path.join(dir,'assets','app-deadbeef.css'));
  let rejected=false;
  try{run()}catch(e){rejected=true;assert(String(e.stderr).includes('Missing compiled JS/CSS'));}
  assert(rejected,'missing CSS is rejected');
  console.log('PASS: precache generator contains compiled assets and offline navigation fallback, changes cache versions and rejects incomplete builds.');
} finally {fs.rmSync(dir,{recursive:true,force:true});}
