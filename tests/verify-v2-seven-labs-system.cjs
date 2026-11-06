/* All seven real Creative Labs: cross-screen integration and visual fidelity lock.
 * Source-level guard complements production Chromium 320px/390px/desktop QA,
 * original educational-data migration, and full DocumentsUI backup/restore. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('src/App.tsx');
const source=read('src/legacy/runtime.js');
const bridge=read('src/legacy/bridge.ts');
const studio=read('src/components/OptionBRealLabs.tsx');
const smoke=read('scripts/browser-smoke.cjs');
const individual=[
 ['story','MakeLab','make-v2','src/components/labs/option-b-make-lab.css','data-v2-make-screen','data-v2-make-scene-first','data-story-project-library','28-real-option-b-frame-desktop.png'],
 ['frame','FrameLab','frame-v2','src/components/labs/option-b-frame-lab.css','data-v2-frame-screen','data-v2-frame-stage','data-v2-frame-controls','29-real-option-b-frame-320px.png'],
 ['light','LightingLab','lighting-v2','src/components/labs/option-b-lighting-lab.css','data-v2-lighting-screen','data-v2-lighting-stage','data-v2-lighting-controls','31-real-option-b-lighting-320px.png'],
 ['cut','CutLab','cut-v2','src/components/labs/option-b-cut-lab.css','data-v2-cut-screen','data-v2-cut-stage','data-v2-cut-controls','33-real-option-b-cut-320px.png'],
 ['sound','SoundLab','sound-v2','src/components/labs/option-b-sound-lab.css','data-v2-sound-screen','data-v2-sound-stage','data-v2-sound-controls','35-real-option-b-sound-320px.png'],
 ['colour','ColourLab','colour-v2','src/components/labs/option-b-colour-lab.css','data-v2-colour-screen','data-v2-colour-stage','data-v2-colour-controls','37-real-option-b-colour-320px.png'],
 ['continuity','ContinuityLab','continuity-v2','src/components/labs/option-b-continuity-lab.css','data-v2-continuity-screen','data-v2-continuity-stage','data-v2-continuity-controls','39-real-option-b-continuity-320px.png']
];
const seen=new Set();
for(const [id,name,styleClass,cssPath,root,stage,control,screenshot] of individual){
 assert(!seen.has(id),'Lab IDs must be unique: '+id);seen.add(id);
 assert(bridge.includes("'"+id+"'"),'Must use original typed LabName: '+id);
 assert(studio.includes("id:'"+id+"'"),'Option B studio must link the real existing '+id+' lab');
 assert(app.includes("route.lab==='"+id+"'")||app.includes("route.lab==='"+id+"' ?"),
  'App must render original production component for '+id);
 const component=read('src/components/labs/'+name+'.tsx');
 const style=read(cssPath);
 assert(component.includes(styleClass),'Real '+id+' JSX must adopt approved Option B style');
 assert(component.includes(root),'Real '+id+' must expose the production QA root');
 assert(component.includes("import './"+path.basename(cssPath)+"'"),
  'Real '+id+' JSX must load exactly its own isolated stylesheet');
 assert(style.includes('max-width:360px')||style.includes('max-width:360px)'),
  'Actual responsive 320px breakpoint missing for '+id);
 assert(style.includes('prefers-reduced-motion:reduce'),
  'Production lab must respect reduced-motion settings: '+id);
 assert(style.includes('#f7fbf9')&&style.includes('#55b97b'),
  'Production '+id+' lab must follow the approved canvas/mint token palette');
 assert(component.includes('data-lab={tab.id}')||id==='story'&&component.includes('data-lab={tab.id}'),
  'Seven real labs remain interlinked from '+id);
 assert(!component.includes('localStorage.setItem('),'Do not fork original backup/progress owner: '+id);
 assert(!component.includes('fetch('),'Working labs must remain original offline tools: '+id);
 if(id!=='story'){
  assert(component.indexOf(stage)<component.indexOf(control),
   'Scene must precede controls in real document order: '+id);
 }
 assert(smoke.includes(screenshot),'Actual mobile screenshot QA missing for '+id);
}
assert(seen.size===7,'Exactly seven original creative studios');
for(const id of ['story','frame','light','cut','sound','colour','continuity']){
 assert(studio.includes('id:\''+id+'\''),'Original seven production lab identifiers preserved');
}
assert(source.includes('frameone-progress-v01')&&source.includes('frameone-scene-v07')&&
 source.includes('frameone-practice-v07'),'Original saved user records preserved');
assert(source.includes('getBackupJSON')&&source.includes('function restoreBackup(payload)')&&
 source.includes('importBackup:(payload)'),
 'Existing central export and import must remain the one backup owner');
const color=read('src/components/labs/ColourLab.tsx');
const continuity=read('src/components/labs/ContinuityLab.tsx');
const sound=read('src/components/labs/SoundLab.tsx');
const cut=read('src/components/labs/CutLab.tsx');
const make=read('src/components/labs/MakeLab.tsx');
assert(color.includes("mode === 'neutral' ? 0")&&color.includes('/100*.42'),
 'Colour: original neutral and 42%-cap overlay are educationally true');
assert(continuity.includes("moved?'moved':''")&&
 continuity.includes('Different camera angles can change left/right'),
 'Continuity: true moving cup and real-world camera-angle limitation');
assert(sound.includes('useEffect(()=>()=>{session.current?.stop();session.current=null;},[])')&&
 sound.includes("mode==='silence'&&!ambience"),
 'Sound: silence and audio cleanup cannot be sacrificed');
assert(cut.includes('window.clearTimeout(timer)')&&
 cut.includes('setDurations(old=>{const next=[...old] as CutDurations'),
 'Cut: live timer and per-shot duration ownership remain');
assert(make.includes('window.frameOneLegacy?.saveStoryboard(sanitized)')&&
 make.includes('window.frameOneLegacy?.createStoryProject(title)')&&
 make.includes('data-director-confirm'),
 'Make: original project store and guarded Director Handoff remain working');
const lesson=read('src/components/OptionBReactScreens.tsx');
assert(lesson.includes("realChapterIndex===5")&&
 lesson.includes('FirstFilmJourney')&&
 lesson.includes('OptionBRealLabs'),
 'Seven real labs remain reachable from the actual complete 33-lesson guided journey');
console.log('PASS: All 7 actual production Creative Labs, Option B styles, original tools, no duplicate user storage, original 33-lesson link and responsive QA.');
