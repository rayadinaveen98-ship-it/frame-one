/* Frame One 2.0: Chapter 3 real visual-language source and migration contract. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const guided=read('src/data/visual-language-guided.ts');
const graphics=read('src/components/OptionBVisualExperiment.tsx');
const screens=read('src/components/OptionBReactScreens.tsx');
const mission=read('src/components/OptionBFoundationMission.tsx');
const legacy=read('src/legacy/runtime.js');
const bridge=read('src/legacy/bridge.ts');
const css=read('src/components/option-b-react-design.css');
const browser=read('scripts/browser-smoke.cjs');
const ids=['shot','camera','lighting','composition','movement','lenses','colour'];
assert.equal(curriculum.lessons.length,33);
assert.equal(curriculum.chapters.length,6);
assert.deepEqual(curriculum.chapters[2].ids,ids);
for(const id of ids){
 const lesson=curriculum.lessons.find(l=>l.id===id);
 assert(lesson&&lesson.opts.length===3&&lesson.answer>=0&&lesson.answer<3,id+' original quiz intact');
 assert(guided.includes(' '+id+':{'),'Chapter 3 must author a custom interaction for '+id);
}
assert(guided.includes('VISUAL_IDS=chapter.ids')&&guided.includes('return {id,legacyId:lesson.id,chapterId:2,lesson,...entry}'),
 'Guided chapter map must use canonical IDs and source text');
assert(guided.includes('const lessons=new Map'),'No duplicated canonical educational facts');
assert(screens.includes('data-v2-visual-node')&&screens.includes('data-v2-visual-open')&&screens.includes('data-v2-visual-back'),
 'Chapter 3 must have its own seven-node journey with visible navigation');
assert(screens.includes('safeProgress([...FOUNDATION_IDS,...STORYTELLING_IDS,...VISUAL_IDS,...SOUND_EDIT_IDS])'),
 'Read real completions for all 18 lessons from original key');
assert(mission.includes('visualLanguageById(lessonId)')&&mission.includes('<OptionBVisualExperiment lessonId={lessonId} selected={explore}/>'),
 'Seven lessons share approved four-stage real mission and dedicated visual studio');
assert(mission.includes('if(step===2&&!correct)return')&&mission.includes('if(!correct)'),
 'User may not complete wrong or unanswered canonical quiz');
assert(legacy.includes('savePractice:(id,note)=>')&&legacy.includes('finished.add(id);persist()'),
 'Original notes and completed progress remain within legacy backup owner');
const required="if(!['why','history','units','genres','india','story','script','acting','character','dialogue','showdonttell','shot','camera','lighting','composition','movement','lenses','colour','sound','editing','ambience','music','continuity','rhythm'].includes(id))return false;";
assert(legacy.includes(required),'Guided completion permits only existing Chapters 1–3');
for(const id of ids)assert(graphics.includes("'"+id+"'"),'Real experiment has a defined visual study for '+id);
assert(graphics.includes('OptionBReactScene')&&graphics.includes('<FilmSetDiagram'),
 'Use approved scene illustration and original geometry diagrams');
assert(graphics.includes('does not')&&guided.includes('not a focal-length'),'Visual language must not misrepresent crop or filters as optical physics');
assert(css.includes('.visual-experiment')&&css.includes('.visual-diagram'),
 'New styles are scoped to visual experiments, never old prototype');
assert(!guided.includes('localStorage.setItem(')&&!graphics.includes('localStorage.setItem('),
 'No unsynced second progress or notes storage may be created');
assert(browser.includes('verifyRealChapterThree'),'Browser acceptance is mandatory, not just source tests');
console.log('PASS: all seven visual-language lessons, honest experiments, original 33-lesson progress, notes, and backup contracts.');
