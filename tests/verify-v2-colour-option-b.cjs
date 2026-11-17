/* Frame One 2.0 — production Colour Lab Option B quality lock.
 * The original SVG comparison, 42%-cap tint, honest caveat, keyboard input,
 * three storyboard situations, seven real tabs and storage remain unchanged. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const lab=read('src/components/labs/ColourLab.tsx');
const style=read('src/components/labs/option-b-colour-lab.css');
const scenes=read('src/components/labs/CinemaScene.tsx');
const briefs=read('src/components/labs/ColourStoryBriefs.tsx');
const qa=read('scripts/browser-smoke.cjs');
const app=read('src/App.tsx');
assert(lab.includes('react-colour-lab colour-v2')&&lab.includes('data-v2-colour-screen="true"'),
 'Option B styling must apply to actual React Colour Lab, not a demo replica');
assert(lab.includes('data-v2-colour-stage')&&lab.includes('data-v2-colour-controls')&&
 lab.indexOf('data-v2-colour-stage')<lab.indexOf('data-v2-colour-controls'),
 'Real original before/after illustration must be the primary stage before editor controls');
assert(lab.includes('colour-v2-live-status')&&lab.includes('{selected.label}')&&
 lab.includes("Math.round(opacity*100)"),
 'Studio header derives status from the actual selected overlay alpha');
for(const mode of ['neutral','warm','cool']){
 assert(lab.includes(mode+': {label:'),'All three original modes retained: '+mode);
}
assert(lab.includes("mode === 'neutral' ? 0")&&lab.includes('/100*.42'),
 'Neutral must stay ungraded and maximum original coloured overlay alpha is 42%');
assert(lab.includes('CinemaScene variant="original"')&&lab.includes('CinemaScene variant="graded"')&&
 lab.includes('style={{background:selected.swatch,opacity}}'),
 'Two actual copies of original authored SVG and real colour overlay retained');
assert(lab.includes('id="colourStrength"')&&lab.includes('id="colourStrengthValue"')&&
 lab.includes('min="0" max="100" step="5"')&&
 lab.includes('onInput={event=>{event.stopPropagation();updateStrength(event.currentTarget.value);}}'),
 'Original keyboard/drag slider, 0–100 bounds and isolated React handlers preserved');
assert(lab.includes('data-colour={id}')&&lab.includes('aria-pressed={id===mode}'),
 'Real selected overlay states must be accessible');
assert(lab.includes('a coloured overlay is not colour grading'),
 'Do not represent simplified tint as a calibrated grade');
assert(lab.includes('<ColourStoryBriefs mode={mode} strength={strength}')&&
 briefs.includes('data-colour-brief-starter')&&briefs.includes('data-colour-brief-feedback')&&
 briefs.includes("id: 'last-bus'"),
 'All three original story-driven presets/reviews remain connected to actual overlay settings');
assert(lab.includes('colour-v2-quick-jump')&&
 lab.includes('data-lab="story">✎ Make')&&lab.includes('data-lab="continuity">↔ Match'),
 'Compact real-lab shortcuts must remain visible near the start on Android');
assert(lab.includes('data-lesson="colour"')&&lab.includes('data-lab={tab.id}'),
 'Original connected lesson and seven real Creative Labs retained');
assert(style.includes('.react-colour-lab.colour-v2')&&
 style.includes('max-width:360px')&&style.includes('prefers-reduced-motion:reduce'),
 'Mobile styles, accessible focus and motion reduction are required');
for(const token of ['#f7fbf9','#1c3442','#55b97b'])assert(style.includes(token),
 'Use original approved Option B design tokens '+token);
assert(style.includes('grid-template-columns:minmax(0,1fr)')&&style.includes('.colour-compare .scene-stage'),
 'Keep two real SVGs large, legible and vertically stacked on 320px phones');
assert(scenes.includes('Original storyboard image showing the same person at a bus stop'),
 'Re-use original locally authored art; do not replace with fake mood image');
assert(qa.includes('data-v2-colour-stage')&&qa.includes('data-v2-colour-controls'),
 'Browser QA must inspect actual live original/graded comparisons at desktop and phone');
assert(app.includes("route.lab==='colour' ? <ColourLab"),
 'React App must remain the working lab state owner');
assert(!lab.includes('localStorage.setItem(')&&!lab.includes('fetch('),
 'Never introduce second storage owner or external image APIs');
console.log('PASS: real Colour Lab Option B original SVG comparison, 42% overlay, scene briefs, mobile and data parity.');
