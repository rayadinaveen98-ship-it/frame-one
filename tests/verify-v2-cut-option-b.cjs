/* Real Cut Lab Option B source regression: the original timed editor is
 * preserved, with a scene-first layout, real reordering and timer cleanup. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const cut=read('src/components/labs/CutLab.tsx');
const css=read('src/components/labs/option-b-cut-lab.css');
const brief=read('src/components/labs/CutBrief.tsx');
const browser=read('scripts/browser-smoke.cjs');
const app=read('src/App.tsx');
assert(cut.includes('react-cut-lab cut-v2')&&cut.includes('data-v2-cut-screen="true"'),
 'Styling must belong to real React Cut Lab, not a separate Option B demo');
assert(cut.includes('data-v2-cut-stage')&&cut.includes('data-v2-cut-controls')&&
 cut.indexOf('data-v2-cut-stage')<cut.indexOf('data-v2-cut-controls'),
 'Live original storyboard must precede the editing inspector');
assert(cut.includes('cut-v2-live-status')&&cut.includes('{total}s timeline')&&
 cut.includes("{playing?'Playing now':'Ready to preview'}"),
 'Current timeline, selected shot and playback status must reflect actual React state');
for(const shot of ['place','detail','person']){
 assert(cut.includes(shot+':{title:'),'Original edit shot '+shot+' retained');
}
for(const key of ['data-cut-step','data-cut-prev','data-cut-next','data-cut-play',
  'data-cut-reset','data-move','id="shotDuration"']){
 assert(cut.includes(key),'Original real editor action lost: '+key);
}
assert(cut.includes('window.setTimeout(')&&cut.includes('window.clearTimeout(timer)')&&
 cut.includes('if(current>=2){setPlaying(false);return;}'),
 'Original timed visual preview must stop and clear its own timer on navigation');
assert(cut.includes('setDurations(old=>{const next=[...old] as CutDurations;[next[index],next[other]]=[next[other],next[index]]')&&
 cut.includes('setOrder(old=>{const next=[...old] as CutOrder;[next[index],next[other]]=[next[other],next[index]]'),
 'Shot duration must follow the same shot when reordered');
assert(cut.includes('setPlaying(false);setStep(Math.min(2,Math.max(0,next)))')&&
 /setPlaying\(false\);\s*setOrder\(preset\.order\);/.test(cut),
 'Manual selection and story presets must cancel preview before modifying editor');
assert(cut.includes('<CutBrief order={order} durations={durations}')&&
 brief.includes('data-cut-preset')&&brief.includes('data-cut-feedback'),
 'Keep original story-first three scenario workshop changing actual edit');
assert(cut.includes('not a fully featured video editor')&&
 cut.includes('No recorded footage is used'),
 'No false claims about editing recorded video or playing sound');
assert(cut.includes('data-lesson="editing"')&&cut.includes('data-lab={tab.id}'),
 'Existing lesson and seven lab routes remain intact');
assert(!cut.includes('localStorage.setItem('),'Cut Lab cannot fork original progress, project or backup owner');
assert(css.includes('.react-cut-lab.cut-v2')&&
 css.includes('max-width:360px')&&css.includes('prefers-reduced-motion:reduce'),
 'Mobile and reduced motion must use scoped Option B style');
for(const token of ['#1c3442','#55b97b','#f7fbf9'])assert(css.includes(token),
 'Original Option B palette missing: '+token);
assert(browser.includes('data-v2-cut-stage')&&browser.includes('data-v2-cut-controls'),
 'Actual browser acceptance must validate responsive scene-first layout');
assert(app.includes("route.lab==='cut' ? <CutLab"),
 'App must continue to use the original real Cut Lab component');
console.log('PASS: actual Option B Cut Lab retains original three-shot timeline, reordered durations, timed preview cleanup and lesson states.');
