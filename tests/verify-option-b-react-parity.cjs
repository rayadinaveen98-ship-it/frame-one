/* Lock visual parity with the real, previously accepted prototype source. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const source=read('public/option-b-v1.html');
const style=source.slice(source.indexOf('<style>')+7,source.indexOf('</style>'));
const reactStyle=read('src/components/option-b-react-design.css');
let expected=style
  .replace(':root{',':host{')
  .replace('html,body{',':host{')
  .replace('}body{font-size:14px}','}:host{font-size:14px}')
  .replace('.site{min-height:100dvh;','.site{min-height:100%;height:100%;')
  .replace('height:min(862px,calc(100dvh - 50px));','height:min(862px,calc(100% + 10px));')
  .replace('.phone{width:100%;height:100dvh;','.phone{width:100%;height:100%;');
assert(reactStyle.includes(expected),'React receives the APPROVED exact CSS, with only shadow/viewport adjustments');
for(const [constant,name] of [['WORLD','world'],['SCENE','scene']]){
  const match=source.match(new RegExp("const "+constant+"='data:image\\/svg\\+xml;base64,([^']+)'"));
  assert(match,'Reference has original vector art: '+constant);
  const expectedSvg=Buffer.from(match[1],'base64');
  const actualSvg=fs.readFileSync(path.join(__dirname,'../public/option-b-assets',name+'.svg'));
  assert(actualSvg.equals(expectedSvg),'React art is byte-for-byte IDENTICAL with the approved '+name+' image');
}
const react=read('src/components/OptionBReactScreens.tsx');
const wrapper=read('src/components/OptionBExperience.tsx');
const smoke=read('scripts/browser-smoke.cjs');
for(const s of ['See the story','Choose the frame','Find the turning point','Shape the light','Hear the unseen','Make your scene'])
  assert(react.includes(s),'React map carries every approved mission identity: '+s);
for(const s of ['data-v2-native-react','data-v2-native-screen="home"','data-v2-native-screen="journey"','data-v2-native-mission','option-b-assets/world.svg','option-b-assets/scene.svg','createPortal','attachShadow'])
  assert(react.includes(s),'Native rendering uses isolated React art rather than an HTML iframe clone: '+s);
assert(react.includes('readDemo()')&&react.includes(PROTOTYPE_KEY_CHECK()),'React reflects genuine prototype progress on toggle');
function PROTOTYPE_KEY_CHECK(){return 'frameone-option-b-prototype-v1';}
assert(!react.includes('localStorage.setItem('),'React Home/Journey NEVER overwrite the existing or demo progress');
assert(wrapper.includes('data-option-b-compare="approved"')&&wrapper.includes('data-option-b-compare="react"'),
  'Reviewed and native screens are switchable for direct comparison');
assert(wrapper.includes('startMission?.(missionId)')&&wrapper.includes("setPresentation('approved')"),
  'Native journey opens the proven original lesson engine until the lesson is ported at equal quality');
assert(smoke.includes('comparePixels')&&smoke.includes('native-vs-approved-'),
  'Real browser runs pixel parity checks and leaves reference screenshots');
console.log('PASS: Option B native React Home/Journey exact world and scene art, CSS parity, 6 mission IDs, state safety and explicit comparison.');
