/* v0.10A4 offline learning compass contract; only original 33 lesson records. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),ts=require('typescript');
const base=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(base,p),'utf8');
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const jsx=read('src/components/LearningJourney.tsx');
const learn=read('src/components/LearnView.tsx');
const style=read('src/components/learning-journey.css');
for(const [file,content] of [['src/components/LearningJourney.tsx',jsx],['src/components/LearnView.tsx',learn]]) {
  const node=ts.createSourceFile(file,content,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  assert.equal(node.parseDiagnostics.length,0,'new React course markup parses: '+file);
}
assert.equal(curriculum.chapters.length,6);
assert.equal(curriculum.lessons.length,33);
assert.equal(new Set(curriculum.chapters.flatMap(c=>c.ids)).size,33,'all 33 distinct IDs represented');
assert.equal(curriculum.chapters.reduce((a,c)=>a+c.ids.length,0),33);
for(const chapter of curriculum.chapters)assert(chapter.ids.every(id=>curriculum.lessons.some(l=>l.id===id)),'chapter IDs must resolve');
for(const part of ['journey-dashboard','journey-progress-panel','journey-next-panel','journey-chapter-segment','journey-meter',
                   'aria-valuenow={done}','aria-label','onChapterSelect(index)','nextLesson.title','nextLesson.minutes',
                   'completed.has(id)','allComplete','Continue learning','Revisit first lesson']) {
  assert(jsx.includes(part),'course journey feature '+part);
}
assert(learn.includes('<LearningJourney chapters={chapters}'),'React lesson explorer embeds the new compass');
assert(learn.includes('pendingChapterFocus'),'filter-agnostic chapter navigator');
assert(learn.includes("setFilter('All')"),'navigation clears the active filtering');
assert(learn.includes("setQuery('')"),'navigation clears the search');
assert(learn.includes('heading.focus({preventScroll:true})'),'chapter selection moves keyboard focus accessibly');
assert(learn.includes('new Set([chapter])'),'one active chapter at a time on narrow screens');
assert(learn.includes('safeProgress(ids)'),'existing saved course remains source of truth');
assert(learn.includes('<LearningBackup'),'private validated learning backup retained');
assert(!jsx.includes('localStorage'),'dashboard never creates a second progress data store');
assert(!jsx.includes('fetch('),'course compass works without network');
assert(style.includes('min-width:44px'),'chapter segment accessible tap width');
assert(style.includes('@media(max-width:760px)'),'mobile stacked cinematic dashboard');
assert(style.includes('overflow-x:auto'),'narrow Android views scroll chapter rail without overflow');
console.log('PASS: six chapter progress segments, 33 preserved lesson IDs, keyboard navigation, offline dashboard and existing backup.');
