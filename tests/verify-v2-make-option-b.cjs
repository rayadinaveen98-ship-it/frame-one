/* Production Make Lab Option B redesign: no functionality lost to cosmetic refactor.
 * The original v0.7 persistent projects, notes, export and Director Handoff
 * actions stay in the real React editor, never a duplicate demo.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const make=read('src/components/labs/MakeLab.tsx');
const style=read('src/components/labs/option-b-make-lab.css');
const labStyle=read('src/components/labs/react-labs.css');
const bridge=read('src/legacy/bridge.ts');
const original=read('src/components/labs/StoryboardArt.tsx');
const browser=read('scripts/browser-smoke.cjs');
assert(make.includes('data-v2-make-screen')&&make.includes('data-v2-make-scene-first'),
 'Actual editor—not the static Option B demo—must gain the new visual system');
assert(make.indexOf('data-v2-make-scene-first')<make.indexOf('data-story-project-library'),
 'See the live storyboard before the project-management section');
assert(make.includes('data-v2-make-manage')&&make.includes('scrollIntoView')&&
 make.includes('make-v2-active-project'),'Current project and project management must remain easy to find');
assert(make.includes('activeProject?.name')&&make.includes('library.projects.length'),
 'Project banner must display real active project data');
assert(make.includes('const current=storyQuestions[plan.question]')&&
 make.includes('const framing=plan.shots[step]')&&make.includes('<StoryboardArt shot={framing}/>'),
 'Main stage must render the original reactive scene');
for(const id of ['data-story-question','data-story-step','data-story-shot','data-story-save','data-story-export',
 'data-story-project-library','data-project-create','data-project-switch','data-project-rename',
 'data-project-rename-save','data-project-delete','data-project-delete-confirm','data-project-delete-cancel',
 'data-director-handoff','data-director-keep','data-director-save-new','data-director-confirm',
 'data-director-export-existing']){
 assert(make.includes(id),'Original real action missing after the redesign: '+id);
}
assert(make.includes('window.frameOneLegacy?.saveStoryboard(sanitized)')&&
 make.includes('window.frameOneLegacy?.createStoryProject(title)')&&
 make.includes('window.frameOneLegacy?.switchStoryProject(id)')&&
 make.includes('window.frameOneLegacy?.renameStoryProject(id,renameDraft.trim())')&&
 make.includes('window.frameOneLegacy?.deleteStoryProject(id)')&&
 make.includes('window.frameOneLegacy.exportShotList()'),
 'All production saves, projects and exports must stay with original backup owner');
assert(make.includes('JSON.stringify(latest)!==JSON.stringify(savedAtOffer)')&&
 make.includes('savedAtOffer'),'Director Handoff cannot silently replace modified work');
assert(original.includes('originalStoryboardSvg')&&original.includes('frameone-make-scene-sky'),
 'Original bus-stop vector artwork stays unchanged and shows correct framing');
assert(style.includes('.react-make-lab.make-v2')&&style.includes('.story-film-frame')&&
 style.includes('max-width:360px')&&style.includes('prefers-reduced-motion:reduce'),
 'New design styles must be strictly scoped, readable on 320px and motion respectful');
assert(style.includes('#1c3442')&&style.includes('#55b97b')&&style.includes('#f7fbf9'),
 'Live editor shares approved Option B art tokens, not unrelated dark UI');
assert(labStyle.includes('.react-make-lab .make-project-library')&&
 bridge.includes('getStoryProjects: () => StoryProjectsSnapshot'),
 'Existing multi-project editor and typed bridge still exist');
assert(browser.includes('data-v2-make-manage')&&browser.includes('data-v2-make-scene-first'),
 'Real browser tests must cover scene-first and Manage projects navigation');
assert(!make.includes('localStorage.setItem('),'Production editor must not fork its own project storage');
console.log('PASS: Real Make Lab scene-first Option B style, all original project/export/Director Handoff actions and backup owner intact.');
