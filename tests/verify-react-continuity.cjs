/* First native-React Creative Lab contract.
 * Structural checks complement the production Chromium browser journey:
 * compilation + actual click/save/navigation behaviors are checked in CI.
 */
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const read = relative => fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');

const app = read('src/App.tsx');
const continuity = read('src/components/labs/ContinuityLab.tsx');
const runtime = read('src/legacy/runtime.js');
const qa = read('scripts/browser-smoke.cjs');
const css = read('src/legacy/legacy.css');

assert(app.includes("import { ContinuityLab, type ContinuityMode }"), 'React Continuity Lab is part of App');
assert(app.includes("setRoute({ ...custom.detail, lab })"), 'route bridge observes lab selections');
assert(app.includes("custom.detail.lab"), 'bridge reads explicit lab route field');
assert(runtime.includes("state.page==='lab'&&['continuity','colour','frame','light'].includes(state.lab)?'':"), 'legacy never renders either React-owned lab markup');
assert(runtime.includes("lab:state.page==='lab'?state.lab:undefined"), 'route event carries current lab explicitly');
assert(app.includes("route.lab==='continuity'"), 'React renders only when Continuity Lab is selected');
assert(app.includes("<ContinuityLab mode={continuityMode} setMode={setContinuityMode} />"), 'React lab receives state');
assert(app.includes("const [continuityMode, setContinuityMode]"), 'continuity choice persists between lab visits');
assert(continuity.includes('event.stopPropagation()'), 'React lab state never double-mutated by legacy handler');
assert(continuity.includes("data-lab={tab.id}"), 'all seven tabs continue to use interoperable legacy navigation');
assert(continuity.includes('aria-pressed={changed}') && continuity.includes('aria-pressed={!changed}'), 'accessible continuity choice state');
assert(continuity.includes('continuity-cup') && continuity.includes("moved?'moved':''"), 'original desk drawing with moved prop preserved');
assert(continuity.includes('Different camera angles can change left/right'), 'educational camera-angle caveat retained');
assert(continuity.includes('data-lesson="continuity"'), 'lab-to-lesson link retained');
for (const cls of ['continuity-desk','continuity-cup','continuity-letter','continuity-shell']) assert(css.includes('.' + cls), 'original visual CSS retained: ' + cls);
assert(runtime.includes('frameone-progress-v01') && runtime.includes('frameone-scene-v07') && runtime.includes('frameone-practice-v07'),'legacy data identifiers preserved');
assert(qa.includes('.react-continuity-lab') && qa.includes("React must own continuity markup"), 'compiled-browser QA asserts migrated component ownership');
console.log('PASS: v0.9D React Continuity Lab component, accessible choices, old styles, navigation and saved-data compatibility.');
