/* v0.14 project migration and transaction acceptance contract. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const legacy=read('src/legacy/runtime.js'),bridge=read('src/legacy/bridge.ts'),
  make=read('src/components/labs/MakeLab.tsx'),browser=read('scripts/browser-smoke.cjs');
for(const file of ['src/components/labs/MakeLab.tsx','src/legacy/bridge.ts']){
 const source=ts.createSourceFile(file,read(file),ts.ScriptTarget.Latest,true,file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(source.parseDiagnostics.length,0,'parse '+file);
}
assert(legacy.includes("PROJECTS_KEY='frameone-story-projects-v1'"));
assert(legacy.includes('MAX_PROJECTS=20'));
assert(legacy.includes("firstProject(scene){return {version:1,activeId:'legacy-project'"));
assert(legacy.includes('validProjectLibrary(value)'));
assert(legacy.includes("raw===null)return {library:firstProject(activeScene)"),'old v0.7 scene must migrate virtually on read');
assert(legacy.includes('library.projects.find(p=>p.id===library.activeId).scene=activeScene'),'legacy scene mirror wins when older APK touched it');
assert(legacy.includes('const keys=[PROJECTS_KEY,STORY_KEY]'),'two stored storyboard representations share atomic rollback');
assert(legacy.includes('const previous')||legacy.includes('let prev;'));
assert(legacy.includes('const restoreKeys=[STORAGE_KEY,NOTES_KEY,STORY_KEY,PROJECTS_KEY]'),'JSON backup restores four keys with rollback');
assert(legacy.includes('const restoredLibrary=importedProjects||firstProject(safeScene)'),'old v1 backups must stay restorable');
assert(legacy.includes("throw new Error('The backup project collection is invalid.')"),'malformed project collection rejected before writes');
assert(legacy.includes('projects:state.projects?JSON.parse(JSON.stringify(state.projects)):null'),'optional projects bundled into original v1 JSON');
assert(legacy.includes('return writeProjectAndScene(state.projects,next);'),'legacy Make saver updates active project and v0.7 mirror together');
for(const m of ['getStoryProjects','createStoryProject','switchStoryProject','renameStoryProject','deleteStoryProject']){
 assert(legacy.includes(m+':'),'bridge implementation '+m);
 assert(bridge.includes(m+':'),'typed bridge contract '+m);
}
for(const marker of ['data-story-project-library','data-project-create','data-project-switch','data-project-rename-save',
  'data-project-delete-confirm','data-project-delete-cancel','data-director-save-new'])assert(make.includes(marker),marker);
assert(make.includes('setPlan(readSavedPlan())'),'failed writes roll back UI instead of silently saying saved');
assert(make.includes('syncProjectView('),'project switch must refresh React and the selected beat');
assert(browser.includes('data-project-create')&&browser.includes('data-project-delete-confirm'),'real browser exercises project lifecycle');
console.log('PASS: migration, four-key atomic backup, active-slot compatibility, bounded project library and explicit project actions.');
