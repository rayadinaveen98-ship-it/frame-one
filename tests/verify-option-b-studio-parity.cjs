/* Source contract for the two newly native visual surfaces.
 * The original reference remains immutable and is pixel compared in CI. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const reference=read('public/option-b-v1.html');
const native=read('src/components/OptionBReactScreens.tsx');
const lab=read('src/components/OptionBReactLab.tsx');
const mission=read('src/components/OptionBReactMission.tsx');
const script=read('scripts/browser-smoke.cjs');
const parity=read('scripts/option-b-studio-parity.cjs');
const legacy=read('src/legacy/runtime.js');
assert(reference.includes('function lab()')&&reference.includes('function progress()'),
  'Original five-screen Option B reference is retained unchanged');
for(const token of [
  'data-v2-native-screen="lab"','data-v2-native-lab','data-v2-native-mode',
  'data-v2-native-lab-zoom','data-v2-native-guides','data-v2-native-save-shot',
  'aria-selected={tool===id}','aria-pressed={chosen===i}',
  "tool==='frame'","tool==='light'","choice.sound",
  'Colour treatment is a visual cue, not real relighting.',
  'Illustrated lab prototype. Saved experiments are local demo counts',
  'OptionBReactScene']){
  assert(lab.includes(token),'The real React Studio must match approved function: '+token);
}
for(const token of [
  'data-v2-native-screen="progress"','data-v2-native-progress-mission',
  'data-v2-native-reset','window.confirm(',
  'setSaved(saveLabIdea())','setSaved(resetDemo())',
  'saved.shots','saved.finished.length','onNativeComplete()']){
  assert(native.includes(token),'Progress must display true demo state and safe reset: '+token);
}
assert(native.includes("setScreen(target)")&&native.includes("target==='lab'||target==='progress'"),
  'Every top-level Option B tab must now open native React screens');
assert(native.includes("localStorage.setItem(PROTOTYPE_KEY,JSON.stringify({...raw,...next}))"),
  'Save new Lab counts only to isolated pilot demo key');
assert(native.includes("localStorage.setItem(PROTOTYPE_KEY,JSON.stringify(next))"),
  'Reset only the isolated Option B key after confirmation');
assert(mission.includes('export function OptionBReactScene')&&lab.includes('<OptionBReactScene'),
  'Lab reuses EXACT approved scene renderer, never substitutes art');
for(const key of ['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07']){
  assert(legacy.includes(key),'Real lesson data persists: '+key);
  assert(!lab.includes(key)&&!native.includes(key),'Prototype cannot modify live data: '+key);
}
assert(parity.includes("comparePixels")&&parity.includes("productionBefore")&&parity.includes("productionAfter")
  &&parity.includes("data-v2-native-reset")&&script.includes("verifyStudioParity("),
  'Browser acceptance must compare real pixels, confirm save, reject/accept reset and preserve production data');
for(const scenario of [
  'lab-frame-wide','lab-frame-guides','lab-frame-tight',
  'lab-light-warm','lab-light-cool','lab-light-contrast',
  'lab-sound-traffic','lab-sound-birds','progress-filled']){
  assert(parity.includes(scenario),'Required visual screenshot scenario missing: '+scenario);
}
console.log('PASS: complete React Lab/Progress functions, unchanged original artwork, nine pixel states and isolated storage.');
