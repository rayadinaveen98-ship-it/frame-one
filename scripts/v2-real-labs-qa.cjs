/* End-to-end QA for seven real production Creative Labs launched from the
 * Option B course. The labs stay owned by the existing App and original
 * backup engine; only navigation and return context are new.
 */
const assert=require('node:assert/strict');
const {screenshotPhone}=require('./option-b-pixel-parity.cjs');
const LAB_IDS=['story','frame','light','cut','sound','colour','continuity'];
async function verifyRealLabsBridge(page,reference,shots,label){
 const native=page.locator('[data-v2-native-react]');
 const backupBefore=await page.evaluate(()=>JSON.parse(window.frameOneLegacy.getBackupJSON()));
 const demoBefore=await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1'));
 await page.locator('[data-option-b-compare="react"]').click();
 await native.locator('[data-v2-native-nav="home"]').click();
 await native.locator('[data-v2-open-foundations]').click();
 await native.locator('[data-v2-story-open]').click();
 await native.locator('[data-v2-visual-open]').click();
 await native.locator('[data-v2-native-nav="lab"]').click();
 const studio=native.locator('[data-v2-real-labs-screen]');
 await studio.waitFor();
 assert.equal(await studio.locator('[data-v2-real-lab]').count(),7,
  'Real studio must link precisely the existing seven production labs');
 await screenshotPhone(native.locator('.phone'),'real-production-labs-'+label+'.png',shots);
 const labIds=label==='desktop'?LAB_IDS:['story','cut','continuity'];
 for(const lab of labIds){
  await studio.locator('[data-v2-real-lab="'+lab+'"]').click();
  await page.locator('[data-frameone-option-b]').waitFor({state:'detached'});
  const returnStrip=page.locator('[data-v2-real-lab-return-bar]');
  await returnStrip.waitFor();
  assert.match(await returnStrip.textContent(),/Working Creative Lab/);
  assert.match(await page.locator('[data-v2-return-to-journey]').textContent(),/Chapter 03/);
  const actualTab=page.locator('.lab-tabs [data-lab="'+lab+'"]');
  await actualTab.waitFor();
  assert.equal(await actualTab.getAttribute('aria-pressed'),'true',
   'Must open the actual working React Lab, not a visual replica: '+lab);
  if(lab==='story'){
    assert.equal(await page.locator('.react-make-lab').count(),1,'Real Make Lab required');
    assert.equal(await page.evaluate(()=>Boolean(window.frameOneLegacy.getStoryProjects)),true,
      'Make Lab must remain backed by original local storyboard project store');
  }
  await page.locator('[data-v2-return-to-journey]').click();
  await page.locator('[data-frameone-option-b]').waitFor();
  await native.locator('[data-v2-visual-screen="journey"]').waitFor();
  assert.equal(await page.locator('[data-option-b-compare="react"]').getAttribute('aria-pressed'),
    'true','Return goes to React real curriculum, not design reference');
  await native.locator('[data-v2-native-nav="lab"]').click();
  await studio.waitFor();
 }
 // Every export generates a fresh exportedAt timestamp. Compare the actual
 // content and schema, never a timestamp that correctly changes on export.
 const backupAfter=await page.evaluate(()=>JSON.parse(window.frameOneLegacy.getBackupJSON()));
 const {exportedAt:beforeExportedAt,...savedBefore}=backupBefore;
 const {exportedAt:afterExportedAt,...savedAfter}=backupAfter;
 assert.equal(typeof beforeExportedAt,'string');
 assert.equal(typeof afterExportedAt,'string');
 assert.deepEqual(savedAfter,savedBefore,
  'Opening and returning from real labs must not change progress, projects, notes or backup schema');
 assert.equal(await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1')),
  demoBefore,'Real production lab launches cannot award prototype points');
 await studio.locator('[data-v2-real-labs-back]').click();
 await native.locator('[data-v2-visual-screen="journey"]').waitFor();
 await native.locator('[data-v2-visual-back]').click();
 await native.locator('[data-v2-story-screen="journey"]').waitFor();
 await native.locator('[data-v2-story-back]').click();
 await native.locator('[data-v2-foundation-screen="journey"]').waitFor();
 await native.locator('[data-v2-foundation-back]').click();
 await native.locator('[data-v2-native-screen="home"]').waitFor();
 await page.locator('[data-option-b-compare="approved"]').click();
 await reference.locator('.home-hero').waitFor();
 return {labsChecked:labIds.length};
}
module.exports={verifyRealLabsBridge};
