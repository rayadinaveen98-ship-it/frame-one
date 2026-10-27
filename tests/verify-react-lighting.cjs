/* Fourth native-React Creative Lab migration contract.
 * Browser QA separately checks the actual SVG and responsive controls.
 */
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('src/App.tsx'),lab=read('src/components/labs/LightingLab.tsx'),
      drawing=read('src/components/labs/LightingScene.tsx'),old=read('src/legacy/runtime.js'),
      css=read('src/legacy/legacy.css'),browser=read('scripts/browser-smoke.cjs');
assert(app.includes("import { LightingLab }"),'App imports Lighting Lab');
assert(app.includes("route.lab==='light' ? <LightingLab"),'React renders selected Lighting Lab');
assert(app.includes('setLightingMode')&&app.includes('setLightPower')&&app.includes('setLightSoft'),'lighting state lives in App');
assert(old.includes("['continuity','colour','frame','light','cut'].includes(state.lab)?'':"),'legacy yields the fourth lab DOM');
assert(old.includes(".react-frame-lab,.react-lighting-lab')"),'global legacy input avoids React lab sliders');
assert(lab.includes('event.stopPropagation()'),'direction choice avoids legacy click handler');
assert(lab.includes('onInput={event=>{event.stopPropagation()')&&lab.includes('onChange={event=>{event.stopPropagation()'),'slider gestures avoid legacy input handler');
for(const name of ['front','side','back']){
  assert(drawing.includes(name+':{label:'),'original lighting lesson mode preserved: '+name);
}
assert(drawing.includes('Original illustration of a person with'),'original authored SVG teaching artwork present');
assert(drawing.includes('lightOpts')===false, 'scene imports typed options rather than old global lookup');
assert(drawing.includes("Math.max(20,Math.min(100,brightness))"),'brightness bounded');
assert(drawing.includes("Math.max(0,Math.min(100,softness))"),'shadow softness bounded');
assert(drawing.includes("f1-light-"),'original SVG defs safely scoped');
assert(lab.includes('aria-pressed={mode===id}'),'mode controls accessible');
assert(lab.includes('id="lightPower"')&&lab.includes('id="lightSoft"'),'both sliders preserved');
assert(lab.includes('Shadow softness is clearest with side light'),'teaching limitations retained');
assert(lab.includes('Avoid overheating lights and never look directly at bright bulbs'),'safe practical lighting lesson retained');
assert(lab.includes('data-lesson="lighting"'),'lesson deep-link retained');
for(const cls of ['lighting-stage','lighting-badge','light-question','light-practice','cinematic-lab-shell']) assert(css.includes('.'+cls),'original lighting styles kept: '+cls);
for(const key of ['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'])assert(old.includes(key),'data key unchanged: '+key);
assert(browser.includes('React must own Lighting Lab')&&browser.includes('14-react-lighting-'),'Chromium smoke contains lighting mode/mobile contract');
console.log('PASS: React Lighting Lab: vector illustration, original wording, controlled sliders, accessibility, routing and storage.');
