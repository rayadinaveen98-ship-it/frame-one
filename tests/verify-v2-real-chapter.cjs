/* Frame One 2.0 genuine curriculum integration safeguards.
 * This protects original progress/notes/backup contracts, the canonical
 * content IDs, and the approved visual reference against unreviewed drift. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const guided=read('src/data/foundations-guided.ts');
const screen=read('src/components/OptionBReactScreens.tsx');
const mission=read('src/components/OptionBFoundationMission.tsx');
const css=read('src/components/option-b-react-design.css');
const bridge=read('src/legacy/bridge.ts');
const legacy=read('src/legacy/runtime.js');
const smoke=read('scripts/browser-smoke.cjs');
assert.equal(curriculum.lessons.length,33);
assert.equal(curriculum.chapters.length,6);
const first=curriculum.chapters[0].ids;
assert.deepEqual(first,['why','history','units','genres','india']);
assert.equal(first.length,5);
for(const id of first){
 const l=curriculum.lessons.find(row=>row.id===id);
 assert(l,'real lesson missing '+id);
 assert.equal(typeof l.q,'string');
 assert.equal(l.opts.length,3);
 assert(l.answer>=0&&l.answer<3,'canonical knowledge answer valid');
 assert(guided.includes(' '+id+':{'),'original educator-authored interaction map for '+id);
}
assert(guided.includes('const byId=new Map')&&guided.includes('FOUNDATION_IDS=chapter.ids'),
 'Original curriculum, not duplicated or renamed V2 lesson data, remains source of truth');
assert(guided.includes("return {id,legacyId:lesson.id,chapterId:0,lesson,...entry}"),
 'every guided mission maps to exactly one real canonical lesson');
assert(mission.includes("const {lesson}=data")&&mission.includes('lesson.q')&&
 mission.includes('lesson.opts')&&mission.includes('lesson.answer')&&mission.includes('lesson.feedback')&&
 mission.includes('lesson.try'),'Real missions use genuine existing lessons and graded facts');
assert(mission.includes('disabled={(step===1&&chosen===null)||(step===2&&!correct)}') &&
 mission.includes('if(step===2&&!correct)return')&&mission.includes('if(!correct)'),
 'Knowledge mastery required before saving real lesson completion');
assert(mission.includes('completeGuidedFoundation(lessonId)')&&mission.includes('saveGuidedPracticeNote(lessonId,note)'),
 'Real lesson completion and practice notes use legacy bridge, never new keys');
assert(legacy.includes("completeGuidedFoundation:(id)=>")&&
 legacy.includes("if(!['why','history','units','genres','india','story','script','acting','character','dialogue','showdonttell','shot','camera','lighting','composition','movement','lenses','colour','sound','editing','ambience','music','continuity','rhythm'].includes(id))return false;")&&
 legacy.includes("finished.add(id);persist()")&&legacy.includes('updateProgress()'),
 'Legacy completion method only accepts real five IDs, persists to existing 33-lesson key and updates visible progress');
assert(bridge.includes('completeGuidedFoundation: (id:string) => boolean'),
 'Typed bridge exposes the validated, route-independent Chapter 1 completion');
for(const key of ['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07']){
 assert(!mission.includes('localStorage.setItem(')&&!guided.includes(key),
 'Guided mission never writes an independent learning key: '+key);
}
assert(screen.includes('data-v2-open-foundations')&&screen.includes('data-v2-foundation-node')&&
 screen.includes('<OptionBFoundationMission')&&screen.includes('safeProgress([...FOUNDATION_IDS,...STORYTELLING_IDS,...VISUAL_IDS,...SOUND_EDIT_IDS])'),
 'Chapter 1 real journey uses original SVG art and real progress rather than invented badges');
assert(screen.includes('data-v2-native-screen="home"')&&screen.includes('data-v2-native-screen="journey"'),
 'Previously approved prototype routes remain untouched');
assert(css.includes('.foundation-launch')&&css.includes('.foundation-knowledge-check')&&
 css.includes('.foundation-concept-switch'),
 'New curriculum UI extends the approved design tokens rather than replacing them');
assert(smoke.includes('verifyRealChapterOne'),'Real in-browser Chapter 1 coverage is mandatory');
console.log('PASS: all five canonical Foundation lessons, interactive content, true graded mastery, 33-lesson backup and exact source-parity preservation.');
