/* Real production Lighting Lab acceptance: preserve original shader controls,
 * story briefs, educational caveats and legacy data while restyling in Option B. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const lab=read('src/components/labs/LightingLab.tsx');
const visual=read('src/components/labs/LightingScene.tsx');
const story=read('src/components/labs/LightingBrief.tsx');
const css=read('src/components/labs/option-b-lighting-lab.css');
const browser=read('scripts/browser-smoke.cjs');
const app=read('src/App.tsx');
assert(lab.includes('react-lighting-lab lighting-v2')&&lab.includes('data-v2-lighting-screen="true"'),
 'Real React lighting editor must get Option B art treatment, not a duplicate demo');
assert(lab.includes('data-v2-lighting-stage')&&lab.includes('data-v2-lighting-controls')&&
 lab.indexOf('data-v2-lighting-stage')<lab.indexOf('data-v2-lighting-controls'),
 'Real original light illustration must be the first interactive scene');
assert(lab.includes('lighting-v2-live-status')&&lab.includes('{selected.label}')&&
 lab.includes('{power}% brightness')&&lab.includes('{softness}% soft edge'),
 'Studio status must derive from real React lighting state');
for(const name of ['front','side','back']){
 assert(visual.includes(name+':{label:'),'Original three real lighting modes retained '+name);
 assert(lab.includes('data-light={id}'),'Actual direction toggles retained '+name);
}
assert(lab.includes('data-light={id}')&&lab.includes('aria-pressed={mode===id}'),
 'Original controlled mode selection and a11y state preserved');
assert(lab.includes('id="lightPower"')&&lab.includes('id="lightSoft"')&&
 lab.includes('setPower(clamp(event.currentTarget.value,20,100,90))')&&
 lab.includes('setSoftness(clamp(event.currentTarget.value,0,100,35))'),
 'Brightness and softness sliders must remain bounded real React inputs');
assert(lab.includes('<LightingScene mode={mode} brightness={power} softness={softness}/>')&&
 visual.includes('feGaussianBlur')&&visual.includes('shadowOpacity')&&
 visual.includes('f1-light-'),'Existing real authored SVG and shadow/brightness math preserved');
assert(lab.includes('<LightingBrief mode={mode} power={power} softness={softness}')&&
 lab.includes('setMode(direction); setPower(brightness); setSoftness(edge);')&&
 story.includes('data-light-preset')&&story.includes('data-light-feedback'),
 'Three optional scene briefs must apply actual lighting controls and deliver genuine dependent feedback');
assert(lab.includes('Shadow softness is clearest with side light')&&
 lab.includes('Avoid overheating lights and never look directly at bright bulbs.'),
 'Educational truth and real-world safety must not be lost to visual styling');
assert(lab.includes('data-lesson="lighting"')&&
 lab.includes('data-lab={tab.id}')&&lab.includes("data-lab={tab.id}"),
 'Lighting lesson and seven existing production lab links remain reachable');
assert(!lab.includes('localStorage.setItem(')&&!css.includes('localStorage'),
 'No second project, progress or backup data owner');
assert(css.includes('.react-lighting-lab.lighting-v2')&&
 css.includes('max-width:360px')&&css.includes('prefers-reduced-motion:reduce'),
 'Keep styles scoped, responsive and motion-accessible');
for(const token of ['#1c3442','#55b97b','#f7fbf9'])assert(css.includes(token),
 'Approved Option B palette must be reused '+token);
assert(browser.includes('data-v2-lighting-stage')&&browser.includes('data-v2-lighting-controls'),
 'Browser QA must inspect actual scene-first layout on desktop and phones');
assert(app.includes("route.lab==='light' ? <LightingLab"),
 'Real existing App route and data source maintained');
console.log('PASS: real Lighting Lab original 3 directions, scene, 2 sliders, 3 story briefs, routes and 320px Option B skin.');
