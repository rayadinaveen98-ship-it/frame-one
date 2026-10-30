/* v0.13A17 — visual first, accessible three-step lesson navigation.
 * This does not change data storage, quiz answers or completion.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),
 ts=require('typescript'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const compass='src/components/LessonCompass.tsx',lesson='src/components/LessonView.tsx';
for(const file of [compass,lesson]){
 const tree=ts.createSourceFile(file,read(file),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 assert.equal(tree.parseDiagnostics.length,0,file+' parses');
}
const source=read(compass),view=read(lesson),style=read('src/components/lesson-react.css');
for(const id of ['explore','decide','check']){
 assert(source.includes("id:'"+id+"'"),id+' named stage');
 assert(view.includes('id="lesson-stage-'+id+'"'),id+' real destination in lesson');
 assert(view.includes('data-lesson-stage="'+id+'"'));
}
assert(source.includes('scrollIntoView(')&&source.includes('focus({preventScroll:true})'),
 'Jumping must scroll and focus the real lesson content');
assert(source.includes("prefers-reduced-motion: reduce"),
 'Respect reduced-motion accessibility');
assert(source.includes("aria-label={'Jump to '"),
 'Buttons give spoken purpose');
assert(source.includes('type="button"')&&source.includes('data-lesson-compass'));
assert(view.includes('<LessonCompass/>'),'Compact navigation in the lesson route');
assert(view.indexOf('<LessonCompass/>')<view.indexOf('<VisualLessonPilot'),
 'Lesson guide stays before visual introduction');
assert(view.includes("jumpToLessonStage('explore')"),
 'Wrong-answer review returns to real visual scene');
assert(view.includes('data-lesson-revisit'));
assert(view.includes('completeLesson(lesson.id)'),'Original completion route unchanged');
for(const k of ['savePractice(lesson.id','showTelugu','quiz===null','aria-live="polite"'])
 assert(view.includes(k),'Original learning compatibility '+k);
assert(!source.includes('localStorage')&&!source.includes('fetch('));
assert(style.includes('@media(max-width:350px)')&&style.includes('.lesson-compass-actions button:focus-visible'));
const js=ts.transpileModule(source,{fileName:compass,compilerOptions:{
 jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022
}}).outputText;
let scrolled=0,focused=0;
const target={scrollIntoView({behavior,block}){scrolled++;assert.equal(block,'start');assert.equal(behavior,'auto');},
 focus({preventScroll}){focused++;assert.equal(preventScroll,true)}};
const module={exports:{}};
vm.runInNewContext(js,{module,exports:module.exports,require(name){
 if(name==='react/jsx-runtime')return {jsx:()=>({}),jsxs:()=>({})};
 throw Error('Unexpected dependency '+name);
},document:{getElementById:id=>id==='lesson-stage-check'?target:null},
 window:{matchMedia:()=>({matches:true})}}, {timeout:5000});
module.exports.jumpToLessonStage('not-real');
module.exports.jumpToLessonStage('explore'); // no missing node errors
module.exports.jumpToLessonStage('check');
assert.equal(scrolled,1);
assert.equal(focused,1);
console.log('PASS: three visible and accessible lesson jumps, reduced-motion focus, original quiz/progress preserved.');
