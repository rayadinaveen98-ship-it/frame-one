/* v0.15A8: original interactive camera decision diagrams, no fake optics or progress. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),ts=require('typescript');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const files=['src/components/CameraDecisionBoard.tsx','src/components/VisualLessonPilot.tsx'];
for(const file of files){const tree=ts.createSourceFile(file,read(file),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 assert.equal(tree.parseDiagnostics.length,0,'Camera lesson TSX parses: '+file);}
const component=read(files[0]),visual=read(files[1]),css=read('src/components/camera-decision-board.css'),
 qa=read('scripts/browser-smoke.cjs'),lesson=read('src/components/LessonView.tsx');
for(const key of ["  camera:{","  movement:{","  lenses:{"])assert(component.includes(key),'Real camera lesson challenge: '+key);
for(const id of ["id:'level'","id:'low'","id:'high'","id:'pan'","id:'track'","id:'push'","id:'wide'","id:'crop'","id:'move'"])
 assert(component.includes(id),'Three actual options per lesson: '+id);
assert(visual.includes("pilot.id==='camera'||pilot.id==='movement'||pilot.id==='lenses'"),'Only camera craft pilots receive the new optional exercise');
assert(visual.includes('<CameraDecisionBoard key={pilot.id} lesson={pilot.id}/>'),'Mount in existing illustrated lesson, not new home card');
assert(component.includes('<details>')&&component.includes('data-camera-decision={lesson}'),'Collapsed-by-default progressive disclosure');
assert(component.includes('data-camera-choice={option.id}')&&component.includes('aria-pressed={selected===index}'),'Accessible three-choice camera setup');
assert(component.includes('data-camera-view={choice}')&&component.includes('data-camera-effect role="status"'),'Actual distinct artwork and live explanation');
assert(component.includes('setSelected(index);setDiscussed(false);'),'Choosing a new option clears previous why explanation');
assert(component.includes('data-camera-insight role="region"')&&component.includes('aria-expanded={discussed}'),'Director insight revealed on request');
assert(component.includes('not calibrated camera optics')&&component.includes('No app camera access'),'No fabricated physical camera measurements');
assert(component.includes('scale(${isThird?1.18:1} 1)'),'Cropping from the same viewpoint must not change foreground relative to background');
assert(component.includes('isSecond?<rect x="176"'),'Crop choice shows a tighter frame boundary instead of falsifying perspective');
assert(!component.includes('localStorage')&&!component.includes('fetch(')&&!component.includes('getUserMedia'),'No saved data, network or camera permission');
assert(css.includes('@media(max-width:600px)')&&css.includes('prefers-reduced-motion'),'Responsive and reduced-motion safe');
assert(lesson.includes('completeLesson(lesson.id)')&&lesson.includes('savePractice(lesson.id'),'Original quiz and notes intact');
assert(qa.includes("['camera','movement','lenses']")&&qa.includes('[data-camera-illustration]'),'Chromium exercises all three camera scenarios');
assert(qa.includes('Camera Decision Board overflow at '),'Narrow Android widths checked');
console.log('PASS: three optional camera decision studies, original SVG options, contextual feedback, no extra state and original lessons intact.');
