/* Android backup-first UX and release publisher rollback protection. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const moduleValue={exports:{}};
const navigationCalls=[];
const nav=ts.transpileModule(read('src/state/backup-navigation.ts'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}
}).outputText;
vm.runInNewContext(nav,{module:moduleValue,exports:moduleValue.exports,
  require:()=>({navigate:(page)=>navigationCalls.push(page)})});
const bridge=moduleValue.exports;
assert.equal(bridge.consumeLearningBackupRequest(),false);
bridge.openLearningBackup();
assert.deepEqual(navigationCalls,['learn']);
assert.equal(bridge.consumeLearningBackupRequest(),true);
assert.equal(bridge.consumeLearningBackupRequest(),false,
  'Focus intent is one-shot, never persisted across unrelated navigations');
for(const file of ['src/components/LearnView.tsx','src/components/CinemaLibraryHome.tsx']){
 const node=ts.createSourceFile(file,read(file),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 assert.equal(node.parseDiagnostics.length,0,file+' must parse');
}
const home=read('src/components/CinemaLibraryHome.tsx');
const reader=read('src/components/LearnView.tsx');
const css=read('src/components/cinema-library.css');
const learncss=read('src/components/learn-react.css');
assert(home.includes('data-android-backup-shortcut'));
assert(home.includes('isAndroidBackupAvailable()?'));
assert(home.includes('onClick={openLearningBackup}'));
assert(reader.includes('consumeLearningBackupRequest()'));
assert(reader.includes('panel.open=true'));
assert(reader.includes('panel.scrollIntoView('));
assert(reader.includes("panel.querySelector<HTMLElement>('summary')?.focus"));
assert(reader.includes('id="learningBackupPanel" ref={panelRef}'));
assert(reader.includes('An Android share sheet alone does not mean the file was saved.'));
assert(reader.includes("shareAndroidLearningBackup(window.frameOneLegacy.getBackupJSON())"),
  'Backup content and external save path are unchanged');
assert(css.includes('.cinema-backup-shortcut button:focus-visible'));
assert(learncss.includes('.backup-upgrade-warning'));
assert(!read('src/state/backup-navigation.ts').includes('localStorage.setItem'),
  'Do not create extra persistence keys for navigation');
const workflow=read('.github/workflows/publish-android-preview.yml');
for(const line of [
  'Reject rollback builds and report real signing compatibility',
  'compare/${previous_sha}...${SOURCE_SHA}',
  'if [ "$ancestry" != ahead ] && [ "$ancestry" != identical ]; then',
  'Refusing to replace preview',
  'Persistent QA signer: YES (managed by GitHub Secret)',
  'Persistent QA signer: NO (temporary runner signer; not upgrade-safe)',
  'Certificate changed from the previous published APK.',
  'cat release/UPGRADE_NOTE.md >> release/NOTES.md',
  "gh release download \"$RELEASE_TAG\"",
  'Current public certificate SHA-256'
]) assert(workflow.includes(line),'Publisher safety contract missing: '+line);
assert(!workflow.includes('FRAMEONE_QA_DEBUG_KEYSTORE_B64'),
  'Public release publisher never reads or outputs the private signing secret');
assert(workflow.includes('bash scripts/check-android-signing-continuity.sh release/android-qa-signature.txt previous/android-qa-signature.txt'),
  'Publisher must enforce permanent signer continuity before changing public release');

const os=require('node:os'),child=require('node:child_process');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'frameone-release-signing-'));
const gate=path.join(root,'scripts/check-android-signing-continuity.sh');
const certA='a'.repeat(64),certB='b'.repeat(64);
const modeYes='Persistent QA signer: YES (managed by GitHub Secret)';
const modeNo='Persistent QA signer: NO (temporary runner signer; not upgrade-safe)';
function receipt(name,cert,mode){
  const file=path.join(tmp,name);
  fs.writeFileSync(file,'Signer #1 certificate SHA-256 digest: '+cert+'\n'+mode+'\n');
  return file;
}
function verify(label,next,previous,shouldPass,contains){
  const res=child.spawnSync('bash',[gate,next,previous],{encoding:'utf8'});
  const output=(res.stdout||'')+(res.stderr||'');
  assert.equal(res.status===0,shouldPass,label+' exit '+res.status+': '+output);
  if(contains) assert(output.includes(contains),label+' missing '+contains+': '+output);
}
try{
  const oldTemp=receipt('old-temp.txt',certA,modeNo);
  const newTemp=receipt('new-temp.txt',certB,modeNo);
  const oldStable=receipt('old-stable.txt',certA,modeYes);
  const sameStable=receipt('same-stable.txt',certA,modeYes);
  const newStable=receipt('new-stable.txt',certB,modeYes);
  const malformed=receipt('malformed.txt','NOT_SHA256',modeYes);
  const conflicting=receipt('conflicting.txt',certA,modeYes+'\n'+modeNo);
  verify('Initial preview',newTemp,path.join(tmp,'no-existing-release'),true,'accepted');
  verify('Temporary to temporary still supported',newTemp,oldTemp,true,'temporary');
  verify('One-time temporary to persistent migration',newStable,oldTemp,true,'First permanent QA signer');
  verify('Matching permanent identity',sameStable,oldStable,true,'accepted');
  verify('Permanent to temporary is blocked',newTemp,oldStable,false,'BLOCKED:');
  verify('Permanent identity rotation is blocked',newStable,oldStable,false,'BLOCKED:');
  verify('Malformed certificate fails closed',malformed,oldTemp,false,'Invalid Android signing certificate');
  verify('Conflicting signing status fails closed',conflicting,oldStable,false,'Missing or conflicting');
} finally {
  fs.rmSync(tmp,{recursive:true,force:true});
}
console.log('PASS: one-tap backup, rollback protection, and eight executable public signing-continuity policy scenarios.');
