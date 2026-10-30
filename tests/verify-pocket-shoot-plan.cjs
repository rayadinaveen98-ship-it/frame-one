/* v0.13A10: in-session pocket shoot plans cover all original offline missions. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const dataFile='src/data/film-it-yourself.ts',sheetFile='src/data/practice-sheet.ts';
for(const p of [dataFile,sheetFile,'src/components/FilmItYourself.tsx']){
  const tree=ts.createSourceFile(p,read(p),ts.ScriptTarget.Latest,true,
    p.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  assert.equal(tree.parseDiagnostics.length,0,'Valid TS: '+p);
}
function load(file){
  const mod={exports:{}};
  vm.runInNewContext(ts.transpileModule(read(file),{compilerOptions:{
    module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022
  }}).outputText,{module:mod,exports:mod.exports});
  return mod.exports;
}
const {practiceMissions}=load(dataFile);
const {formatPracticeSheet}=load(sheetFile);
assert.equal(practiceMissions.length,4);
for(const mission of practiceMissions){
  const txt=formatPracticeSheet(mission);
  assert(txt.includes('FRAME ONE — POCKET SHOOT PLAN'));
  assert(txt.includes(mission.title)&&txt.includes(mission.time));
  assert(txt.includes(mission.observation));
  assert(txt.includes('Film safely and with permission'));
  assert(txt.includes('MY OBSERVATION'));
  assert(txt.includes('Prepared offline with Frame One.'));
  assert.equal((txt.match(/SHOT \/ STEP 0[123]/g)||[]).length,3);
  for(const step of mission.steps){
    assert(txt.includes(step.title)&&txt.includes(step.instruction)&&txt.includes(step.purpose));
  }
  assert(!txt.includes('undefined')&&!txt.includes('[object Object]'));
  assert.equal(txt,formatPracticeSheet(mission),'Formatting must be deterministic offline');
  const added=formatPracticeSheet(mission,'My shot was more legible in the second take.');
  assert(added.includes('My shot was more legible in the second take.'));
  assert(!added.includes('(Write something you noticed after filming.)'));
  assert.equal(formatPracticeSheet(mission,'x'.repeat(1000)).split('MY OBSERVATION\n')[1].split('\n')[0].length,240,
    'User note is bounded to 240 chars');
}
const ui=read('src/components/FilmItYourself.tsx');
const css=read('src/components/film-it-yourself.css');
const browser=read('scripts/browser-smoke.cjs');
assert(ui.includes('data-practice-pocket-toggle'));
assert(ui.includes('data-practice-pocket-copy'));
assert(ui.includes('data-practice-plan-text'));
assert(ui.includes('data-practice-observation'));
assert(ui.includes('formatPracticeSheet(mission,myObservation)'));
assert(ui.includes('navigator.clipboard?.writeText'),'Clipboard API must be optional');
assert(ui.includes('planTextRef.current?.select()'),'Manual selection fallback required');
assert(ui.includes('setMyObservation(\'\')'),'Changing exercise resets unsaved observations');
assert(ui.includes('Changing exercises or leaving the page clears it'));
assert(ui.includes('aria-live="polite"'));
assert(!ui.includes('localStorage')&&!ui.includes('fetch(')&&!ui.includes('getUserMedia'));
assert(!read(sheetFile).includes('fetch(')&&!read(sheetFile).includes('localStorage'));
assert(css.includes('@media(max-width:350px)')&&css.includes('.practice-pocket-text'));
assert(browser.includes('[data-practice-pocket-copy]'),'Browser must exercise pocket card');
console.log('PASS: four pocket film guides, 3 steps each, bounded notes, manual-copy fallback, offline and unchanged storage.');
