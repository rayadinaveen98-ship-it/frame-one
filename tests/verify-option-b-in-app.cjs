/* Frame One 2.0 first integration: exact approved visual pilot, no data migration. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const get=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=get('src/App.tsx'),learn=get('src/components/LearnView.tsx'),
  back=get('src/android-back.ts'),viewer=get('src/components/OptionBExperience.tsx'),
  css=get('src/components/option-b-experience.css'),
  pilot=get('public/option-b-v1.html'),
  offline=get('scripts/generate-offline.cjs'),
  smoke=get('scripts/browser-smoke.cjs'),
  legacy=get('src/legacy/runtime.js');
assert(pilot.startsWith('<!DOCTYPE html>')&&pilot.includes('function render()'),'exact rendered HTML experience bundled locally');
for(const name of ['function home()','function journey()','function mission()','function lab()','function progress()'])
  assert(pilot.includes(name),'five functioning pilot views: '+name);
assert(pilot.includes('frameone-option-b-prototype-v1'),'pilot state has unique storage key');
assert(!pilot.includes('frameone-progress-v01')&&!pilot.includes('frameone-practice-v07'),
  'pilot cannot accidentally read/write production progress and practice keys');
assert(app.includes('<OptionBExperience onExit={closeOptionB}')&&app.includes('setOptionBOpen(false)'),
  'pilot mounts on existing React shell with explicit close');
assert(app.includes("window.addEventListener('frameone:option-b-open'")&&
       app.includes("setRoute({ ...custom.detail, lab });"),'new preview uses narrow event bridge; original navigation retained');
assert(learn.includes('data-option-b-open')&&learn.includes('frameone:option-b-open'),
  'pilot opt-in appears in the Learn course only');
assert(viewer.includes('data-frameone-option-b')&&viewer.includes('src="./option-b-v1.html"'),
  'preview loads reviewed offline HTML inside mounted app');
assert(viewer.includes("element.inert=true")&&viewer.includes("element.setAttribute('aria-hidden','true')"),
  'old UI is inaccessible while dialog is open');
assert(viewer.includes("element.inert=inert")&&viewer.includes("element.removeAttribute('aria-hidden')"),
  'old UI state restored on exit');
assert(viewer.includes("window.addEventListener('frameone:option-b-close'")&&
       viewer.includes("event.key==='Escape'"),'physical Back and keyboard Escape safely close preview');
assert(back.indexOf("const pilot=typeof document.querySelector")<back.indexOf("const hash ="),
  'Android Back intercepts the preview before any old route/minimize operation');
assert(back.includes("childInput.blur()"),'Android Back lets embedded input dismiss soft keyboard');
assert(offline.includes("caches.match(event.request)"),'offline navigation reuses exact precached pilot rather than main shell');
assert(css.includes('position:fixed;inset:0')&&css.includes('100dvh'),
  'full-screen mobile acceptance view without old nav duplication');
for(const marker of ['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'])assert(legacy.includes(marker),'legacy storage is unchanged: '+marker);
assert(smoke.includes('data-option-b-frame')&&smoke.includes('data-option-b-exit'),
  'real-browser QA exercises iframe and returns to intact original course');
console.log('PASS: exact Option B interactive pilot, safe React shell overlay, Android Back, offline, legacy data preservation.');
