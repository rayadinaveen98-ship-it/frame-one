/* Production default entrypoint regression: actual browser/Android-equivalent
 * React app, not the six-mission option-b-v1.html reference/iframe.
 * Run once at desktop and 320/390 phone viewports, then re-run the original
 * complete classic course/backup parity suite in explicitly Classic mode. */
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
async function verifyProductionDefault(browser,url,shots){
 for(const width of [1440,390,320]){
  const ctx=await browser.newContext({
   viewport:{width,height:width===1440?900:844},reducedMotion:'reduce',
   acceptDownloads:true
  });
  try{
   const page=await ctx.newPage();
   const errors=[];
   page.on('pageerror',err=>errors.push(err.message));
   await page.goto(url,{waitUntil:'domcontentloaded'});
   await page.locator('[data-v2-default-experience]').waitFor({timeout:20000});
   await page.waitForFunction(()=>Boolean(window.frameOneLegacy),null,{timeout:20000});
   const real=page.locator('[data-v2-production-screen="home"]');
   await real.waitFor({timeout:12000});
   assert.equal(await page.locator('[data-option-b-frame]').count(),0,
    'Default course must NOT load the design-reference iframe');
   assert.equal(await page.locator('[data-option-b-compare]').count(),0,
    'No Reference/React preview switch may appear in the live learning journey');
   assert.equal(await page.locator('.app > .main').getAttribute('aria-hidden'),'true',
    'Hidden Classic buttons must be inaccessible while real course is open');
   assert.equal(await real.locator('[data-v2-production-chapter]').count(),6,
    'Six real chapter choices must appear on first launch');
   assert.equal(await real.locator('[role="progressbar"]').getAttribute('aria-valuenow'),'0',
    'Empty real learning profile begins with zero of 33, not demo points');
   const backupBefore=await page.evaluate(()=>JSON.parse(window.frameOneLegacy.getBackupJSON()));
   const demoBefore=await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1'));
   await page.screenshot({path:path.join(shots,'40-production-home-'+width+'px.png'),
    animations:'disabled',fullPage:false});
   const metrics=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    overlay:document.querySelector('[data-v2-default-experience]')?.getBoundingClientRect().toJSON()
   }));
   assert.ok(metrics.overflow<=3,'Default experience must not horizontally overflow '+width+'px');
   assert.ok(metrics.overlay&&Math.abs(metrics.overlay.left)<3,
    'Real course must occupy the screen instead of rendering inside mock phone');
   await real.locator('[data-v2-production-resume]').click();
   await page.locator('[data-v2-foundation-screen="journey"]').waitFor();
   await page.locator('[data-v2-native-nav="home"]').click();
   await real.waitFor();
   await real.locator('[data-v2-production-chapter="5"]').click();
   await page.locator('[data-v2-firstfilm-screen="journey"]').waitFor();
   await page.locator('[data-v2-native-nav="progress"]').click();
   const progress=page.locator('[data-v2-production-screen="progress"]');
   await progress.waitFor();
   assert.match(await progress.textContent(),/0 of 33|0.*Real lessons/i,
    'Production progress reports real saved lesson totals');
   assert.equal(await progress.locator('[data-v2-production-progress-chapter]').count(),6,
    'Progress page must show real chapter details, not six prototype mission points');
   await page.locator('[data-v2-native-nav="lab"]').click();
   const studio=page.locator('[data-v2-real-labs-screen]');
   await studio.waitFor();
   assert.equal(await studio.locator('[data-v2-real-lab]').count(),7);
   await studio.locator('[data-v2-real-lab="frame"]').click();
   await page.locator('[data-v2-default-experience]').waitFor({state:'detached'});
   await page.locator('.react-frame-lab [data-v2-frame-controls]').waitFor();
   const returnBar=page.locator('[data-v2-real-lab-return-bar]');
   await returnBar.waitFor();
   assert.match(await returnBar.textContent(),/Working Creative Lab/);
   assert.match(await returnBar.textContent(),/Chapter 06|Chapter 6/i);
   await returnBar.locator('[data-v2-return-to-journey]').click();
   await page.locator('[data-v2-default-experience]').waitFor();
   await page.locator('[data-v2-firstfilm-screen="journey"]').waitFor();
   assert.equal(await page.locator('[data-option-b-frame]').count(),0,
    'Real lab return must NEVER reopen design prototype');
   const backupAfter=await page.evaluate(()=>JSON.parse(window.frameOneLegacy.getBackupJSON()));
   const {exportedAt:a,...dataBefore}=backupBefore;
   const {exportedAt:b,...dataAfter}=backupAfter;
   assert.deepEqual(dataAfter,dataBefore,
    'Entering real course, opening lab and returning must not alter saved lesson/project backup');
   assert.equal(await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1')),
    demoBefore,'No prototype points can be created by the real course');
   await page.locator('[data-v2-open-classic]').click();
   await page.locator('[data-v2-default-experience]').waitFor({state:'detached'});
   await page.locator('.cinema-library-active').waitFor();
   // Reproduce the actual Android failure: Classic was left at the bottom,
   // hiding the first lesson after switching from the immersive course.
   await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
   const classicNav=width<=760?'.mobile-nav [data-page="learn"]':'.nav-menu [data-page="learn"]';
   await page.locator(classicNav).click();
   await page.locator('.react-learn-view').waitFor();
   await page.waitForFunction(()=>window.scrollY<5,null,{timeout:3000});
   assert.equal(await page.locator('.react-learn-view [data-option-b-open]').count(),1,
     'Classic learning/backup tools must remain mounted after production cutover');
   await page.locator('[data-v2-open-default-experience]').click();
   await real.waitFor();
   assert.deepEqual(errors,[],'No production React runtime errors at '+width+'px');
   console.log('PASS: production Home, 6 real chapters, real Progress, 7 Labs, return to Chapter 6, backup and Classic fallback at '+width+'px');
  }finally{await ctx.close();}
 }
}
module.exports={verifyProductionDefault};
