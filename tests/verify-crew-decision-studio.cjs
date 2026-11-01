/* v0.15A6: original offline craft collaboration experiment contract. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),ts=require('typescript');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const file='src/components/CrewDecisionStudio.tsx';
const view=read(file),css=read('src/components/crew-decision-studio.css'),app=read('src/App.tsx');
const legacy=read('src/legacy/runtime.js'),browser=read('scripts/browser-smoke.cjs');
const tree=ts.createSourceFile(file,view,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
assert.equal(tree.parseDiagnostics.length,0,'React crew diagram TSX parses');
assert(app.includes("import { CrewDecisionStudio }"),'App imports the visual crew exercise');
assert(app.includes("route.page==='crafts' ? <CrewDecisionStudio />"),'real film roles route mounts workshop');
for(const issue of ["id:'face'","id:'dialogue'","id:'reaction'"])
 assert(view.includes(issue),'real filmmaking production problem: '+issue);
for(const role of ["id:'direction'","id:'camera'","id:'sound'","id:'editing'"])
 assert(view.includes(role),'an existing crew department: '+role);
assert(view.includes("selected?roles.find(r=>r.id===selected)?.label:'none yet'"),'vector diagram describes current department');
assert(view.includes('data-crew-problem={item.id}')&&view.includes('setRole(null)'), 'changing problem resets old response');
assert(view.includes('data-crew-role={item.id}')&&view.includes('aria-pressed={role===item.id}'),'accessible real choice controls');
assert(view.includes('<details>')&&view.includes('data-crew-feedback aria-live="polite"'),'uncluttered, optional collaboration feedback');
assert(view.includes('challenge.notes[role]')&&view.includes('challenge.partnership'),'each role gets meaningful feedback and cross-team notes');
assert(view.includes('no universal first department')&&view.includes('not a camera simulation')===false,'avoids fake correct answer or calibration');
assert(!view.includes('localStorage')&&!view.includes('fetch(')&&!view.includes('getUserMedia'), 'no new storage, network or camera permission');
assert(legacy.includes('function craftsPage()')&&legacy.includes('crewMap()')&&legacy.includes('crafts-grid'), 'existing crew teaching and nine-card roles stay');
assert(css.includes('@media(max-width:600px)')&&css.includes('@media(max-width:350px)'),'mobile 320px layout');
assert(browser.includes('[data-crew-problem="dialogue"]')&&browser.includes('[data-crew-feedback]'),'desktop real Chromium scenario coverage');
assert(browser.includes('Crew Decision Studio overflow at '),'mobile overflow checked');
for(const key of ['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'])
 assert(legacy.includes(key),'original learning data retained: '+key);
console.log('PASS: original film-craft scenario SVG, three scene problems, department collaboration, accessibility and unchanged offline data.');
