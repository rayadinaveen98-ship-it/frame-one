/* v0.10A1 contract: visual density must not break navigation or learner storage. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const ts=require('typescript');
const root=path.join(__dirname,'..');
const runtime=fs.readFileSync(path.join(root,'src/legacy/runtime.js'),'utf8');
const app=fs.readFileSync(path.join(root,'src/App.tsx'),'utf8');
const css=fs.readFileSync(path.join(root,'src/cinematic-v10.css'),'utf8');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
assert(app.includes("import './cinematic-v10.css'"),'new responsive sheet loaded after legacy styles');
assert(css.includes('min-height:252px'),'mobile hero is significantly more compact');
assert(css.includes('.hero-art:before'),'old sunlight artwork stays intact');
assert(css.includes('.lesson-section p{font-size:15px'),'reading text stays comfortable');
assert(!runtime.includes('chapter-quick'),'remove the redundant home chapter banner');
assert(runtime.includes('filmThoughts='),'film thoughts are authored as reusable content');
assert(runtime.includes('data-thought-next'),'film thought carousel has an accessible next button');
assert(runtime.includes('data-thought-prev'),'film thought carousel has an accessible previous button');
assert(runtime.includes("frameone-progress-v01"),'saved learning progress key intact');
const greeting=app.match(/export function greetingForHour\(hour: number\): string \{[\s\S]*?\n\}/);
assert(greeting,'device-local greeting helper exists');
const translated=ts.transpileModule(greeting[0],{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const module={exports:{}};vm.runInNewContext(translated,{module,exports:module.exports});
const hour=module.exports.greetingForHour;
for(const [h,label] of [[0,'Good night.'],[4,'Good night.'],[5,'Good morning.'],[11,'Good morning.'],[12,'Good afternoon.'],[16,'Good afternoon.'],[17,'Good evening.'],[20,'Good evening.'],[21,'Good night.'],[23,'Good night.']]) assert.equal(hour(h),label);
const memory={'frameone-progress-v01':JSON.stringify(['why'])};
const handlers={};
const elements={content:{innerHTML:''},progressCircle:{style:{setProperty(){}}},progressLabel:{textContent:''},
  filmThoughtTitle:{textContent:''},filmThoughtDetail:{textContent:''},filmThoughtCounter:{textContent:''}};
const document={getElementById:id=>elements[id]||null,querySelectorAll:()=>[],querySelector:()=>null,
 addEventListener:(name,fn)=>handlers[name]=fn,body:{appendChild(){}},createElement:()=>({click(){},remove(){}})};
const context={document,localStorage:{getItem:id=>memory[id]??null,setItem:(id,value)=>memory[id]=value},
 window:{addEventListener(){},dispatchEvent(){},scrollTo(){}},
 history:{pushState(){},replaceState(){}},location:{hash:'',protocol:'file:'},navigator:{},
 Event:class{constructor(type){this.type=type;}},CustomEvent:class{constructor(type,data){this.type=type;this.detail=data?.detail;}},
 confirm:()=>true,console,Set,Blob,Date,clearTimeout,setTimeout,URL:{createObjectURL:()=>'',revokeObjectURL(){}}};
vm.runInNewContext(runtime.replace(/export\s*\{\s*\};?\s*$/,''),context,{timeout:8000});
assert.match(elements.content.innerHTML,/WELCOME TO THE WORLD OF CINEMA/);
assert.match(elements.content.innerHTML,/filmThoughtTitle/);
assert.doesNotMatch(elements.content.innerHTML,/chapter-quick/);
function click(dataset){handlers.click({target:{closest(){return {dataset,id:''};}}});}
click({thoughtNext:'1'});
assert.match(elements.filmThoughtTitle.textContent,/Every frame is a choice/);
assert.equal(elements.filmThoughtCounter.textContent,'2 / 16');
click({thoughtPrev:'1'});
assert.match(elements.filmThoughtTitle.textContent,/single/);
assert.equal(elements.filmThoughtCounter.textContent,'1 / 16');
assert.equal(elements.progressLabel.textContent,'1/33 lessons');
assert.equal(JSON.parse(memory['frameone-progress-v01']).length,1);
assert(pkg.scripts.test.includes('verify-cinematic-home.cjs'),'source regression runs in CI');
console.log('PASS: four local greetings, compact mobile hero, film-thought navigation and preserved learning state.');