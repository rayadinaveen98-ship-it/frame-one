/* v0.16A2 framing: direct a story using the actual existing crop preview. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const frame=read('src/components/labs/FrameLab.tsx');
const brief=read('src/components/labs/FramingIntention.tsx');
const css=read('src/components/labs/framing-intention.css');
const app=read('src/App.tsx');
const qa=read('scripts/browser-smoke.cjs');
assert(frame.includes("import { FramingIntention }"),'existing framing lab embeds the optional workshop');
assert(frame.includes('<FramingIntention mode={mode} zoom={bounded} guides={guides}'),'workshop observes real lab controls');
for(const action of ['setMode(nextMode)','setZoom(nextZoom)','setGuides(nextGuides)','setCompare(false)'])
  assert(frame.includes(action),'story preset changes actual lab state: '+action);
assert(brief.includes('<details>')&&!brief.includes('<details open'),'brief starts closed, no visual clutter');
for(const id of ['arrival','conversation','reaction'])assert(brief.includes("id: '"+id+"'"),'three real story situations');
for(const mode of ['wide','medium','close'])assert(brief.includes(mode+':'),'all three crop interpretations exist');
assert(brief.includes('mode: \'wide\', zoom: 1')&&brief.includes('mode: \'medium\', zoom: 2')&&brief.includes('mode: \'close\', zoom: 3'),'brief presets align with actual crop controls');
assert(brief.includes('setReviewed(false)'),'changing story or preset clears old discussion');
assert(brief.includes('aria-pressed={active === item.id}'),'scene choice accessible');
assert(brief.includes('data-framing-starter')&&brief.includes('data-framing-discuss'),'working start and feedback actions');
assert(brief.includes('data-framing-feedback role="status" aria-live="polite"'),'outcomes accessible');
assert(brief.includes('not a camera, optical or acting simulator'),'technical honesty retained');
assert(!/localStorage|sessionStorage|indexedDB|fetch\(|navigator\.mediaDevices|AudioContext/.test(brief),'new workshop has no new storage or network access');
assert(css.includes('grid-template-columns:minmax(0,1fr)'),'small screen choices stack');
assert(css.includes(':focus-visible')&&css.includes('prefers-reduced-motion'),'accessibility and motion rules exist');
assert(app.includes("const [frameMode,setFrameMode]")&&app.includes("const [frameZoom,setFrameZoom]"),'original shared React state remains');
assert(qa.includes('framing-intention')&&qa.includes('data-framing-discuss'),'browser QA covers live framing intentions');
console.log('PASS: optional motivated framing workshop, accurate crop presets, a11y, mobile and unchanged saved state.');
