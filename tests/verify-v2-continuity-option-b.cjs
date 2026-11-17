/* Frame One 2.0 — seventh genuine production lab: Continuity / Match.
 * The real two-frame CSS drawing and React mode are authoritative; new
 * paper/mint styles must not substitute a fake image or alter saved progress. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const lab=read('src/components/labs/ContinuityLab.tsx');
const css=read('src/components/labs/option-b-continuity-lab.css');
const legacy=read('src/legacy/legacy.css');
const app=read('src/App.tsx');
const browser=read('scripts/browser-smoke.cjs');
assert(lab.includes('react-continuity-lab continuity-v2')&&
 lab.includes('data-v2-continuity-screen="true"'),
 'Only real React Continuity editor must receive Option B art treatment');
assert(lab.includes('data-v2-continuity-stage')&&
 lab.includes('data-v2-continuity-controls')&&
 lab.indexOf('data-v2-continuity-stage')<lab.indexOf('data-v2-continuity-controls'),
 'True two-shot matching art must appear before the live selection controls');
assert(lab.includes('continuity-v2-live-status')&&
 lab.includes("{changed?'Prop position changed':'Prop positions match'}"),
 'Studio header must derive matching feedback from the real React mode');
assert(lab.includes('<IllustratedDesk title="SHOT A · BEFORE THE CUT" moved={false}/>')&&
 lab.includes('<IllustratedDesk title="SHOT B · AFTER THE CUT" moved={changed}/>'),
 'Both drawn desks retained: fixed reference vs real changed prop state');
assert(lab.includes("const changed = mode === 'changed';")&&
 lab.includes("setMode(next);")&&lab.includes("event.stopPropagation();"),
 'Original real state selection and event isolation retained');
assert(lab.includes("moved?'moved':''")&&legacy.includes('.continuity-cup.moved{left:74%}'),
 'Actual cup repositioning must stay visible in the second original shot');
assert(lab.includes('data-continuity="match"')&&lab.includes('data-continuity="changed"')&&
 lab.includes('aria-pressed={changed}')&&lab.includes('aria-pressed={!changed}'),
 'Both match/mismatch options and their accessible checked states preserved');
assert(lab.includes('Different camera angles can change left/right')&&
 lab.includes('A deliberate jump may also be a storytelling choice'),
 'Continuity must remain educationally correct and acknowledge angle/jump cuts');
assert(lab.includes('data-lesson="continuity"')&&lab.includes('data-lab={tab.id}')&&
 lab.includes('continuity-v2-quick-jump'),
 'Original linked lesson, seven lab tabs and real Make/Colour/Frame shortcuts intact');
assert(css.includes('.react-continuity-lab.continuity-v2')&&
 css.includes('max-width:360px')&&
 css.includes('prefers-reduced-motion:reduce'),
 'Scoped approved design, readable 320px art, focus and reduced motion required');
for(const token of ['#f7fbf9','#1c3442','#55b97b'])assert(css.includes(token),
 'Approved original Option B colour token missing '+token);
assert(css.includes('continuity-desk')&&css.includes('grid-template-columns:minmax(0,1fr)'),
 'Two real 16:9 desk pictures must be large and vertically stacked on phones');
assert(browser.includes('data-v2-continuity-stage')&&browser.includes('data-v2-continuity-controls'),
 'Real desktop/mobile browser acceptance must verify new working art hierarchy');
assert(app.includes("route.lab==='continuity'")&&
 !lab.includes('localStorage.setItem(')&&!lab.includes('fetch('),
 'Existing App must own React state; never fork storage or load external media');
console.log('PASS: original dual desk continuity, moving cup, camera-angle caveat, accessible choices and 320px Option B art.');
