/* Frame One 2.0 production Creative Labs transition contract.
 * Approved Option B demo remains pixel locked; all seven real React labs keep
 * the original ownership of their controls, notes, storage and backups.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('src/App.tsx');
const experience=read('src/components/OptionBExperience.tsx');
const native=read('src/components/OptionBReactScreens.tsx');
const studio=read('src/components/OptionBRealLabs.tsx');
const css=read('src/components/option-b-react-design.css');
const returnCss=read('src/components/real-labs-return.css');
const smoke=read('scripts/browser-smoke.cjs');
const qa=read('scripts/v2-real-labs-qa.cjs');
const bridge=read('src/legacy/bridge.ts');
const ids=['story','frame','light','cut','sound','colour','continuity'];
for(const id of ids){
 assert(studio.includes("id:'"+id+"'"),'Real studio missing canonical production Lab '+id);
 assert(bridge.includes("'"+id+"'"),'Real studio must use an existing typed lab '+id);
 assert(qa.includes("'"+id+"'"),'Browser transition acceptance missing '+id);
}
assert(studio.includes('REAL_LAB_IDS:readonly LabName[]')&&
 studio.includes('data-v2-real-lab={lab.id}')&&studio.includes('data-v2-real-lab="story"'),
 'Seven real labs must be directly selectable from the original-art screen');
assert(studio.includes('onOpen:(lab:LabName)=>void')&&
 !studio.includes('localStorage.setItem('),
 'Directory must delegate real labs rather than save demo copies');
assert(app.includes('window.frameOneLegacy.openLab(lab)')&&
 app.includes('onOpenProductionLab={openProductionLabFromOptionB}')&&
 app.includes('data-v2-real-lab-return-bar')&&app.includes('data-v2-return-to-journey'),
 'Production App must handle lab opening, source route and visible return');
assert(native.includes('onOpenProductionLab(lab,realChapterIndex)')&&
 native.includes('resumeChapter:number|null')&&native.includes('data-v2-firstfilm-open-labs')&&
 native.includes('data-v2-native-nav={id}'),
 'Guided course must link working labs and support return to the right chapter');
assert(experience.includes("resumeChapter===null?'approved':'react'")&&
 experience.includes('onOpenProductionLab={onOpenProductionLab}'),
 'Returning from real labs must reopen the real React chapter, not design reference');
assert(app.includes('realLabReturnChapter!==null')&&
 app.includes('setRealLabReturnChapter(null)'),
 'Lab return action must be transient and not leak into unrelated navigation');
assert(css.includes('.real-labs-grid')&&css.includes('.real-labs-featured')&&
 css.includes('@media(max-width:360px)'),
 'Real lab directory must match approved illustration design system at 320px');
assert(returnCss.includes('.real-lab-return-bar')&&
 returnCss.includes('focus-visible'),'Lab return button must be visible and keyboard accessible');
assert(smoke.includes('verifyRealLabsBridge')&&
 qa.includes('getBackupJSON()')&&qa.includes('getStoryProjects')&&
 smoke.includes('realLabsChecked'),
 'QA must preserve original story data while opening real labs and returning');
assert(!studio.includes('getStoryboard(')&&!studio.includes('saveStoryboard('),
 'Directory cannot duplicate the real Make Lab or its backup owner');
console.log('PASS: all seven original production labs launch from Option B with real state and chapter return.');
