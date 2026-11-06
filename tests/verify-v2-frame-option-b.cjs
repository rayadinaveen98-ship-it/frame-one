/* Option B real Frame Lab acceptance. The previous original illustration
 * and crop mechanics cannot be traded away for a static demo visual. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const editor=read('src/components/labs/FrameLab.tsx');
const scene=read('src/components/labs/CinemaScene.tsx');
const brief=read('src/components/labs/FramingIntention.tsx');
const style=read('src/components/labs/option-b-frame-lab.css');
const smoke=read('scripts/browser-smoke.cjs');
const bridge=read('src/legacy/bridge.ts');
assert(editor.includes('react-frame-lab frame-v2')&&
 editor.includes('data-v2-frame-screen="true"'),
 'Production React editor, not the approved pilot, must receive the scoped Option B redesign');
assert(editor.includes('frame-v2-quick-jump')&&
 editor.includes('data-lab="story">✎ Make</button>')&&editor.includes('data-lab="cut">✂ Cut</button>')&&
 style.includes('.frame-v2-quick-jump button'),
 'Default Frame Lab must provide 44px real Make/Cut shortcuts without forcing a long scroll');
assert(editor.includes('data-v2-frame-stage')&&editor.includes('data-v2-frame-controls')&&
 editor.indexOf('data-v2-frame-stage')<editor.indexOf('data-v2-frame-controls'),
 'The original dynamic picture must precede the controls');
assert(editor.includes('One moment. Many frames.')&&editor.includes('YOUR VISUAL LANGUAGE STUDIO'),
 'Keep the known real-lab screen title for Android and maintain cinematic visual hierarchy');
for(const key of ['wide','medium','close']){
 assert(editor.includes(key+':{label:'),'Retain original frame size '+key);
 assert(editor.includes("data-frame={key}"),'Retain visible selectable '+key+' crop');
}
assert(editor.includes('setZoom(frameOptions[next].zoom)')&&
 editor.includes('setMode(frameForZoom(next))')&&
 editor.includes('const bounded = Math.max(1,Math.min(3,zoom))'),
 'Crop state and selected mode must stay coupled to real 1–3× zoom');
assert(editor.includes('id="frameZoom"')&&
 editor.includes('aria-label="Crop the existing illustration tighter"')&&
 editor.includes('data-guides')&&editor.includes('data-compare'),
 'Keep live crop slider, optional guides and real two-image comparison');
assert(editor.includes('CinemaScene variant="frame" zoom={bounded} guides={guides}')&&
 editor.includes('CinemaScene variant="reference" zoom={referenceZoom} guides={guides}')&&
 editor.includes('const referenceZoom=bounded>=2.5?1:3;'),
 'Comparison must use two meaningfully different original SVG crops at either extreme');
assert(scene.includes('viewBox')&&scene.includes('640/safeZoom')&&
 scene.includes('originalMarkup')&&
 scene.includes('never a lens or perspective simulation'),
 'Real original vector and mathematically true static picture crop must remain');
assert(editor.includes('<FramingIntention mode={mode} zoom={bounded} guides={guides}')&&
 editor.includes('setCompare(false);')&&
 brief.includes('data-framing-starter')&&brief.includes('data-framing-discuss')&&
 brief.includes('data-framing-feedback'),
 'Optional three-scenario practice and meaningful real crop changes retained');
assert(editor.includes('data-lesson="shot"')&&
 editor.includes('data-lab="sound"')&&
 bridge.includes("'frame'"),'Existing cross-craft and curriculum links retained');
assert(style.includes('.react-frame-lab.frame-v2')&&
 style.includes('max-width:360px')&&
 style.includes('prefers-reduced-motion:reduce'),
 'Only real Frame Lab is restyled; compact touch and reduced-motion variants required');
for(const token of ['#1c3442','#55b97b','#f7fbf9'])assert(style.includes(token),
 'Reuse approved Option B design tokens '+token);
assert(style.includes('frame-comparison')&&style.includes('grid-template-columns:minmax(0,1fr)'),
 'Two picture comparison must stack on a 320px phone');
assert(smoke.includes('data-v2-frame-stage')&&smoke.includes('data-v2-frame-controls'),
 'Browser acceptance must inspect new scene-first real UI');
assert(!editor.includes('localStorage.setItem('),'Framing presets must not fork the project or backup database');
console.log('PASS: real Frame Lab, live SVG crop/slider/guides/comparison, scene intentions and mobile Option B design preserved.');
