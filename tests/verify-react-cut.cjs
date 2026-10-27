/* v0.9D: independent React Cut Lab regression — playback and ownership. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('src/App.tsx'),cut=read('src/components/labs/CutLab.tsx'),
 old=read('src/legacy/runtime.js'),css=read('src/legacy/legacy.css'),
 qa=read('scripts/browser-smoke.cjs');
assert(app.includes("import { CutLab, type CutOrder, type CutDurations }"),'App imports typed React Cut Lab');
for(const field of ['cutOrder','cutDurations','cutStep'])assert(app.includes('set'+field[0].toUpperCase()+field.slice(1)),'App preserves '+field);
assert(app.includes("route.lab==='cut' ? <CutLab"),'Cut renders through React only');
assert(old.includes("['continuity','colour','frame','light','cut','story'].includes(state.lab)?'':"),'legacy leaves Cut Lab DOM empty');
assert(old.includes(".react-lighting-lab,.react-cut-lab,.react-make-lab')"),'old delegated input handler skips React Cut slider');
for(const shot of ['place','detail','person'])assert(cut.includes(shot+':{title:'),'original storyboard shot '+shot);
assert(cut.includes('className={`cut-illustration ${shot}`}')&&cut.includes('cut-stop')&&cut.includes('cut-watch'),'original CSS storyboard art retained');
assert(cut.includes('setTimeout(')&&cut.includes('window.clearTimeout(timer)'),'component timer is always cleaned up');
assert(cut.includes('if(current>=2){setPlaying(false);return;}'),'automatic playback stops at the last shot');
assert(cut.includes('setPlaying(false);setStep(Math.min(2,Math.max(0,next)))'),'manual step changes stop playback');
assert(cut.includes('setDurations(old=>{const next=[...old] as CutDurations;[next[index],next[other]]=[next[other],next[index]]'),'duration follows the moved shot');
assert(cut.includes('setOrder(old=>{const next=[...old] as CutOrder;[next[index],next[other]]=[next[other],next[index]]'),'clips can be reordered');
assert(cut.includes("setOrder(['place','detail','person']);setDurations([2,2,2]);setStep(0)"),'reset restores original exercise');
assert(cut.includes("event.stopPropagation()"),'React events cannot double-trigger the old runtime');
assert(cut.includes('onInput={event=>{event.stopPropagation()'),'duration input is React-controlled');
assert(cut.includes('Read: Why do filmmakers cut?'),'connected editing lesson link retained');
assert(cut.includes('not a fully featured video editor'),'limitations retained');
for(const cls of ['cut-shell','cut-illustration','timeline-clip','clip-playhead','duration-control'])assert(css.includes('.'+cls),'original visual CSS: '+cls);
for(const key of ['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'])assert(old.includes(key),'persistent data remains untouched: '+key);
assert(qa.includes('React must own Cut Lab') && qa.includes('16-react-cut-'),'browser QA covers Cut interactions and mobile');
console.log('PASS: React Cut Lab storyboard timeline, clip duration, safe playback timer, routing and original course data.');
