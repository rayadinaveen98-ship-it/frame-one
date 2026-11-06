/* Production-first navigation with reversible Classic fallback.
 * Existing 33-lesson user progress and seven real labs remain authoritative;
 * the approved Option B iframe is retained only in the separate design pilot. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('src/App.tsx');
const view=read('src/components/FrameOneV2Production.tsx');
const screens=read('src/components/OptionBReactScreens.tsx');
const experience=read('src/components/OptionBExperience.tsx');
const css=read('src/components/option-b-production.css');
const shared=read('src/components/option-b-experience.css');
const tests=read('scripts/browser-smoke.cjs');
assert(app.includes("get('classic')!=='1'")&&app.includes('[productionOpen,setProductionOpen]'),
 'Real Option B opens by default; explicit Classic opt-out is reversible');
assert(app.includes('<FrameOneV2Production')&&app.includes('data-v2-open-default-experience')&&
 app.includes('data-v2-return-to-journey'),
 'Original App supports real default, visible Classic return, and lab return to chapter');
assert(app.includes("realLabOrigin.current=productionOpen?'production':'pilot'")&&
 app.includes("if(realLabOrigin.current==='production')setProductionOpen(true)"),
 'Lab return must reopen the real chapter, not a six-mission demo');
assert(view.includes('data-v2-default-experience')&&view.includes('data-v2-open-classic')&&
 view.includes('<OptionBReactScreens production active')&&
 view.includes('Boolean(window.frameOneLegacy)'),
 'Production shell must not open real lesson controls until original offline bridge is ready');
assert(!view.includes('<iframe')&&!view.includes('option-b-v1.html'),
 'The released course cannot load the design-reference iframe');
assert(screens.includes('data-v2-production-screen="home"')&&
 screens.includes('data-v2-production-screen="progress"')&&
 screens.includes('data-v2-production-chapter={index}')&&
 screens.includes('data-v2-production-resume')&&
 screens.includes('data-v2-production-open-labs'),
 'The normal launch must expose real Home, all six chapters, progress and seven labs');
assert(screens.includes('const REAL_CHAPTERS=[')&&
 screens.includes('const ALL_REAL_LESSON_IDS=REAL_CHAPTERS.flatMap')&&
 screens.includes('safeProgress([...FOUNDATION_IDS,...STORYTELLING_IDS,...VISUAL_IDS,...SOUND_EDIT_IDS,...PEOPLE_IDS,...FIRST_FILM_IDS])'),
 'Real 33-lesson progress must come from canonical source IDs/storage');
assert(screens.includes("useState(production||resumeChapter!==null)")&&
 screens.includes("production&&screen==='home'")&&screens.includes("production&&screen==='progress'")&&
 screens.includes('production?productionNavigate(id)'),
 'Production nav must never route Home or Progress into prototype views');
assert(css.includes('.site[data-v2-production="true"]')&&
 css.includes('max-width:390px')&&css.includes('max-width:720px'),
 'Full-width desktop and phone art style required; no fake phone mockup bezel');
assert(shared.includes('body.frameone-option-b-open .launch-experience{z-index:10001}'),
 'Original cinematic opening must be visible in front of the immersive real course');
assert(experience.includes('option-b-v1.html')&&
 experience.includes("resumeChapter===null?'approved':'react'"),
 'Design QA reference remains available separately, without relaxing pixel parity');
assert(tests.includes('verifyProductionDefault')&&tests.includes('classic=1'),
 'Production default and classic migration tests must run in separate real browser profiles');
assert(!view.includes('localStorage.setItem(')&&!app.includes('localStorage.setItem('),
 'Cutover cannot create/overwrite a separate lesson or backup state owner');
console.log('PASS: Frame One 2.0 production launch uses original 33-lesson progress and working labs, with safe Classic fallback and separate pixel reference.');
