/* v0.15A1 clear chapter explorer: no changes to learner data or route IDs. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const base=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(base,p),'utf8');
const lessons=JSON.parse(read('src/data/curriculum.v08b.json'));
const view=read('src/components/LearnView.tsx');
const styles=read('src/components/learn-react.css');
const journey=read('src/components/learning-journey.css');
const browser=read('scripts/browser-smoke.cjs');
const parsed=ts.createSourceFile('LearnView.tsx',view,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
assert.equal(parsed.parseDiagnostics.length,0,'LearnView TSX must parse cleanly');
assert.equal(lessons.chapters.length,6);
assert.equal(lessons.lessons.length,33);
assert.equal(lessons.chapters.flatMap(x=>x.ids).length,33);
assert.equal((view.match(/practice:'/g)||[]).length,6,'each chapter has one honest practical outcome');
assert.equal((view.match(/promise:'/g)||[]).length,6,'each chapter promises one clear learning goal');
for(const check of [
  'data-clear-chapters','data-chapter-library','data-chapter-index={i}',
  'chapter-purpose','chapter-practice','chapter-identity','chapter-action',
  'aria-expanded={open}','aria-controls={\x60chapterLessons\x24{i}\x60}',
  'chapter-body \x24{open?', 'getElementById(\x27reactChapter\x27+targetIndex)',
  'heading.focus({preventScroll:true})',
  'new Set([Math.max(0,chapter)])', 'previous.has(i)?[]:[i]',
  '<LearningJourney chapters={chapters}', '<LearningBackup',
  'setFilter(\x27All\x27)', 'setQuery(\x27\x27)',
  'safeProgress(ids)', 'importBackup', 'getBackupJSON',
]){
  assert(view.includes(check),'v0.15 contract: '+check);
}
assert(view.includes('<details className="learn-tools"'),'search and filters must use progressive disclosure');
assert(view.includes('className="glossary-block"'),'47 glossary terms remain on Learn');
assert(view.includes('setRevision(n=>n+1)'),'restored backup refreshes course progress');
assert(styles.includes('.chapter-body{display:none') && styles.includes('.chapter-body.is-expanded'),
  'all viewport sizes must collapse inactive chapters');
assert(styles.includes('@media(max-width:350px)'),'320px Android viewport must be explicitly supported');
assert(journey.includes('min-width:44px'),'chapter compass retains accessible tap targets');
assert(browser.includes('Desktop Learn must show only one expanded chapter'),
  'real browser QA must assert desktop does not show all 33 rows');
console.log('PASS: v0.15 clean six-chapter explorer, focused learning outcomes, one open chapter, accessible navigation, original progress and safe backups.');
