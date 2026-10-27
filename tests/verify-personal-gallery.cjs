/* v0.10A2: separate user photo persistence and offline cinema wall contracts. */
const fs=require('fs'),path=require('path'),assert=require('assert'),ts=require('typescript');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'src/App.tsx'),'utf8');
const gallery=fs.readFileSync(path.join(root,'src/components/PersonalFrames.tsx'),'utf8');
const storage=fs.readFileSync(path.join(root,'src/state/personal-frames.ts'),'utf8');
const css=fs.readFileSync(path.join(root,'src/components/personal-frames.css'),'utf8');
for(const [filename,code] of [['src/App.tsx',app],['src/components/PersonalFrames.tsx',gallery],['src/state/personal-frames.ts',storage]]){
  const parsed=ts.createSourceFile(filename,code,ts.ScriptTarget.Latest,true,filename.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  assert.equal(parsed.parseDiagnostics.length,0,filename+' must parse');
}
assert(app.includes('<PersonalFrames />'),'Home mounts personal frames');
assert(app.includes("route.page==='home' ? <PersonalFrames />"),'only mount image theatre on Home');
assert(app.indexOf("<PersonalFrames />")<app.indexOf('<div id="content"'),'personal frames precede welcome artwork');
assert(app.includes('frameone:frames-add-request'),'plus control opens the gallery picker');
assert(gallery.includes('accept="image/*" multiple'),'use system gallery picker and multiple images');
for(const s of ['data-gallery-ready','frames-stage','frames-touch','frames-more','Add images','Edit image','Remove image','frames-editor','changeFocus','moveFrame','prepareFrame','persistFrameOrder','setInterval','visibilityState'])assert(gallery.includes(s),'photo gallery feature '+s);
for(const s of ['indexedDB.open','frameone-personal-frames-v1','MAX_FRAMES=24','image/jpeg','createImageBitmap','deleteFrame','sortOrder','25 MB'])assert(storage.includes(s),'local storage feature '+s);
for(const s of ['frames-effect-dissolve','frames-effect-push','frames-effect-drift','frames-effect-reveal','prefers-reduced-motion','frames-toolbar'])assert(css.includes(s),'cinematic transitions '+s);
assert(!storage.includes('frameone-progress-v01'),'gallery must not modify learner progress');
assert(!storage.includes('frameone-scene-v07'),'gallery must not modify learner storyboard');
assert(!storage.includes('frameone-practice-v07'),'gallery must not modify learner notes');
console.log('PASS: private offline IndexedDB gallery, cinematic transitions, picker, actions and untouched learner schema.');