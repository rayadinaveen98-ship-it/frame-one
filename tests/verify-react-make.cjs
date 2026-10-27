/* v0.9D sixth React lab: legacy backup and storyboard compatibility contract. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('src/App.tsx'),lab=read('src/components/labs/MakeLab.tsx'),
      model=read('src/components/labs/story-data.ts'),
      art=read('src/components/labs/StoryboardArt.tsx'),
      legacy=read('src/legacy/runtime.js'),bridge=read('src/legacy/bridge.ts'),
      css=read('src/legacy/legacy.css'),qa=read('scripts/browser-smoke.cjs');
assert(app.includes("import { MakeLab }"),'React App imports Make Lab');
assert(app.includes("route.lab==='story' ? <MakeLab"),'React owns Make screen');
assert(legacy.includes("['continuity','colour','frame','light','cut','story'].includes(state.lab)?'':"),'legacy yields Make DOM');
assert(legacy.includes('.react-cut-lab,.react-make-lab') ,'legacy delegated inputs cannot mutate React notes');
assert(bridge.includes('getStoryboard: () => StoryPlan')&&bridge.includes('saveStoryboard: (plan: StoryPlan) => boolean'),'typed old backup bridge');
assert(legacy.includes('getStoryboard:()=>JSON.parse(JSON.stringify(state.story))'),'old engine provides an independent story snapshot');
assert(legacy.includes('saveStoryboard:(plan)=>{'),'old engine accepts React storyboard saves');
assert(legacy.includes('window.dispatchEvent(new Event(\'frameone:story-restored\'))'),'backup restores notify React');
assert(lab.includes('frameone:story-restored'),'React updates when backup import replaces data');
assert(lab.includes('window.frameOneLegacy?.saveStoryboard(sanitized)'),'all changes persist through old serializer');
assert(lab.includes('window.frameOneLegacy.exportShotList()'),'same text shot-list export retained');
assert(lab.includes('event.stopPropagation()')&&lab.includes('onInput={event=>event.stopPropagation()}'),'React controls never trigger document listeners');
for(const q of ['mystery','reunion','decision'])assert(model.includes(q+':{label:'),'story question '+q);
assert(model.includes("STORY_KEY='frameone-scene-v07'"),'same storage key');
assert(model.includes('notes:[0,1,2].map')&&model.includes('.slice(0,240)'),'notes bounded to original 240 characters');
assert(art.includes('Original illustration of a person at a bus stop'),'original bus-stop storyboard SVG preserved');
assert(art.includes('frameone-make-scene-sky'),'SVG gradient ID unique');
for(const selector of ['data-story-question={id}','data-story-shot={id}','data-story-step={index}','id="storyNote"','data-story-export'])assert(lab.includes(selector),'storyboard functionality '+selector);
for(const cls of ['story-lead','story-workspace','story-inspector','story-film-frame','story-panel-steps'])assert(css.includes('.'+cls),'existing Make layout style '+cls);
for(const key of ['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'])assert(legacy.includes(key),'data key preserved '+key);
assert(qa.includes('React must own Make Lab')&&qa.includes('18-react-make-'),'browser tests storyboard/backup/mobile');
console.log('PASS: React Make Lab original SVG, three scenes, v0.7 notes, backup sync, exports and accessibility contracts.');
