/* Frame One v0.9C: browser smoke QA against the actual compiled Vite app.
 * Run after 'npm run build' and installing Playwright Chromium.
 * No external accounts, real user data or hosted deployment needed.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const curriculum = require('../src/data/curriculum.v08b.json');
const base = 'http://127.0.0.1:4173';
const shots = path.resolve(__dirname, '../qa/screenshots');
fs.mkdirSync(shots, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
  cwd: path.resolve(__dirname, '..'),
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, CI: '1' }
});
let logs = '';
for (const stream of [server.stdout, server.stderr]) stream.on('data', data => { logs += data.toString(); });
let browser;
const failures = [];
const record = (message) => { failures.push(message); console.error('QA ISSUE: ' + message); };
async function ready() {
  for (let i=0; i<80; i++) {
    if (server.exitCode !== null) throw Error('Vite preview exited: ' + logs.slice(-3000));
    try {
      const response = await fetch(base);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw Error('Vite preview did not start: ' + logs.slice(-3000));
}
async function photo(page, name) {
  await page.screenshot({ path: path.join(shots, name), fullPage: true, animations: 'disabled' });
}
async function verify() {
  await ready();
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  // Premium 4-second boot is measured on a real compiled, non-reduced viewport.
  // Existing learning-flow contexts intentionally prefer reduced motion.
  const launchContext=await browser.newContext({
    viewport:{width:390,height:844},deviceScaleFactor:2,reducedMotion:'no-preference'
  });
  const launchPage=await launchContext.newPage();
  launchPage.on('pageerror',error=>record('Cinematic launch error: '+error.message));
  await launchPage.goto(base,{waitUntil:'domcontentloaded'});
  const launchScreen=launchPage.locator('[data-launch-sequence="cold"]');
  await launchScreen.waitFor({timeout:10000});
  assert.equal(await launchScreen.getAttribute('data-launch-duration'),'4000');
  assert.equal(await launchScreen.locator('.launch-logo').count(),1);
  assert.equal(await launchScreen.locator('.launch-wordmark').textContent(),'FRAME ONE');
  await launchPage.waitForFunction(()=>Boolean(window.frameOneLegacy),null,{timeout:12000});
  await launchPage.waitForTimeout(1950);
  await launchPage.screenshot({path:path.join(shots,'00-cinematic-launch-390.png'),fullPage:false,animations:'allow'});
  await launchScreen.waitFor({state:'detached',timeout:7000});
  assert.equal(await launchPage.locator('.home-greeting').count(),1);
  console.log('PASS: branded mobile title displays, uses exactly four seconds and yields to Home');
  await launchContext.close();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => record('Uncaught browser exception: ' + error.message));
  const response = await page.goto(base, { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200);
  await page.waitForFunction(() => Boolean(window.frameOneLegacy), { timeout: 15000 });
  await page.locator('#content .page').waitFor({ timeout: 15000 });
  await page.locator('.cinema-discovery').waitFor();
  assert.equal(await page.locator('[data-cinema-shelf]').count(),6);
  assert.equal(await page.locator('[data-cinema-entry^="lab:"]').count(),7);
  assert.equal(await page.locator('[data-cinema-entry="roles:crafts"]').count(),1);
  assert.equal(await page.locator('#content .hero').isVisible(),true,
    'Keep original featured cinematic opening');
  assert.equal(await page.locator('#content .card-grid').isVisible(),false,
    'Old three-card Home grid must not duplicate new shelf content');
  assert.equal(await page.locator('.cinema-continue').count(),0,
    'Do not invent a Continue row for a new learner with zero progress');
  assert.equal(await page.locator('[data-journey-resume]').count(),0,
    'A new learner must never be labelled as having started a film');
  // v0.13: real, illustrated director's-choice comparisons on Home.
  const anatomy=page.locator('[data-scene-anatomy]');
  assert.equal(await anatomy.count(),1,'A single editorial scene study must be mounted');
  assert.equal(await anatomy.locator('[data-anatomy-study]').count(),5);
  assert.equal(await anatomy.locator('[data-scene-study]').getAttribute('data-scene-study'),'sound');
  assert.equal(await anatomy.locator('[data-scene-choice]').getAttribute('data-scene-choice'),'a');
  await anatomy.locator('[data-anatomy-option="b"]').click();
  assert.equal(await anatomy.locator('[data-scene-choice]').getAttribute('data-scene-choice'),'b');
  assert.match(await anatomy.locator('.scene-anatomy-cue').textContent(),/low, repeating musical pulse/i);
  await anatomy.locator('[data-anatomy-study="light"]').click();
  assert.equal(await anatomy.locator('[data-scene-choice]').getAttribute('data-scene-choice'),'a',
    'Choosing a new film craft must return to the first take');
  const warmArt=await anatomy.locator('.scene-anatomy-stage').evaluate(node=>getComputedStyle(node).backgroundImage);
  await anatomy.locator('[data-anatomy-option="b"]').click();
  const coolArt=await anatomy.locator('.scene-anatomy-stage').evaluate(node=>getComputedStyle(node).backgroundImage);
  assert.notEqual(warmArt,coolArt,'Lighting comparison must visibly relight the illustrated shot');
  await anatomy.locator('[data-anatomy-study="edit"]').click();
  await anatomy.locator('[data-anatomy-option="b"]').click();
  assert.equal(await anatomy.locator('.scene-anatomy-phone span').isVisible(),true,
    'The motivated edit reveals a real on-screen phone insert');
  assert.equal(await anatomy.locator('[data-anatomy-lab="cut"]').count(),1);

  // v0.13A1: new character reaction and 6-second planned-edit contrasts.
  assert.equal(await anatomy.locator('[data-anatomy-study]').count(),5);
  await anatomy.locator('[data-anatomy-study="reaction"]').click();
  assert.equal(await anatomy.locator('[data-scene-choice]').getAttribute('data-scene-choice'),'a');
  await anatomy.locator('[data-anatomy-option="b"]').click();
  assert.equal(await anatomy.locator('.scene-anatomy-eye-left').isVisible(),true,
    'Reaction close-up must reveal readable illustrated eyes, not just new copy');
  assert.equal(await anatomy.locator('[data-anatomy-lab="frame"]').count(),1);
  await anatomy.locator('[data-anatomy-study="rhythm"]').click();
  assert.equal(await anatomy.locator('[data-scene-choice]').getAttribute('data-scene-choice'),'a');
  assert.equal(await anatomy.locator('.scene-anatomy-rhythm-clip:visible').count(),1);
  assert.match(await anatomy.locator('.scene-anatomy-rhythm-plan').textContent(),/0–6s/);
  await anatomy.locator('[data-anatomy-option="b"]').click();
  assert.equal(await anatomy.locator('.scene-anatomy-rhythm-clip:visible').count(),3,
    'Quick-cut plan must show three distinct two-second segments');
  assert.match(await anatomy.locator('.scene-anatomy-rhythm-plan').textContent(),/4–6s/);
  assert.match(await anatomy.locator('.scene-anatomy-cue').textContent(),/2–4s: phone/i);
  await anatomy.screenshot({path:path.join(shots,'01-scene-anatomy-reaction-rhythm.png'),animations:'disabled'});

  await anatomy.screenshot({path:path.join(shots,'01-scene-anatomy-desktop.png'),animations:'disabled'});
  await anatomy.locator('[data-anatomy-lab="cut"]').click();
  await page.locator('.react-cut-lab').waitFor();
  await page.locator('.nav-menu [data-page="home"]').click();
  await page.locator('[data-scene-anatomy]').waitFor();
  console.log('PASS: scene anatomy real A/B decisions, lighting relight, edit reveal and functional Cut Lab route');
  await photo(page, '01-home-desktop.png');

  // v0.13A2: real combined directing workshop, not a decorative mockup.
  const director=page.locator('[data-direct-moment]');
  assert.equal(await director.count(),1);
  assert.equal(await director.locator('[data-direct-toggle]').getAttribute('aria-expanded'),'false');
  assert.equal(await director.locator('[data-direct-preview]').count(),0,
    'The large workshop must be collapsed until a learner chooses to direct');
  await director.locator('[data-direct-toggle]').click();
  const direction=director.locator('[data-direct-preview]');
  await direction.waitFor();
  assert.equal(await direction.getAttribute('data-direct-preview-frame'),'wide');
  assert.equal(await direction.getAttribute('data-direct-preview-light'),'warm');
  assert.equal(await direction.getAttribute('data-direct-preview-sound'),'room');
  assert.equal(await direction.getAttribute('data-direct-preview-edit'),'hold');
  assert.equal(await director.locator('.direct-moment-shot-list li').count(),1);
  const widePerson=await director.locator('.direct-moment-person').boundingBox();
  const warmStage=await director.locator('.direct-moment-stage').evaluate(el=>getComputedStyle(el).backgroundImage);
  await director.locator('[data-direct-frame="close"]').click();
  const closePerson=await director.locator('.direct-moment-person').boundingBox();
  assert.ok(widePerson&&closePerson&&closePerson.width>widePerson.width*1.6,
    'Framing choice must truly change the preview scale');
  await director.locator('[data-direct-light="cold"]').click();
  const coldStage=await director.locator('.direct-moment-stage').evaluate(el=>getComputedStyle(el).backgroundImage);
  assert.notEqual(warmStage,coldStage,'Lighting choice must change the rendered scene');
  await director.locator('[data-direct-sound="pulse"]').click();
  assert.match(await director.locator('[data-direct-sound-cue]').textContent(),/described, not played/i);
  assert.match(await director.locator('[data-direct-sound-cue]').textContent(),/musical pulse/i);
  await director.locator('[data-direct-edit="reveal"]').click();
  assert.equal(await director.locator('[data-direct-insert]').count(),1);
  assert.equal(await director.locator('.direct-moment-shot-list li').count(),2);
  assert.match(await director.locator('[data-direct-second-shot]').textContent(),/4–6s/);
  assert.equal(await director.locator('[data-direct-preview-edit="reveal"]').count(),1);
  await director.screenshot({path:path.join(shots,'01-direct-the-moment-desktop.png'),animations:'disabled'});
  await director.locator('[data-direct-preset="quiet"]').click();
  assert.equal(await direction.getAttribute('data-direct-preview-frame'),'wide');
  assert.equal(await direction.getAttribute('data-direct-preview-edit'),'hold');
  assert.equal(await director.locator('[data-direct-insert]').count(),0);
  await director.locator('[data-direct-preset="uneasy"]').click();
  assert.equal(await direction.getAttribute('data-direct-preview-frame'),'close');
  assert.equal(await direction.getAttribute('data-direct-preview-light'),'cold');
  assert.equal(await direction.getAttribute('data-direct-preview-sound'),'pulse');
  assert.equal(await direction.getAttribute('data-direct-preview-edit'),'reveal');
  // v0.13A3: importing never overwrites an existing three-shot storyboard
  // until the learner explicitly accepts, even when opening Make Lab.
  const previousDraft={
    question:'reunion',shots:['wide','medium','close'],
    notes:['Original authored beginning — do not overwrite','Original authored middle','Original authored ending']
  };
  await page.evaluate(p=>window.frameOneLegacy.saveStoryboard(p),previousDraft);
  const preImportJSON=await page.evaluate(()=>localStorage.getItem('frameone-scene-v07'));
  await director.locator('[data-direct-make-lab]').click();
  let handoffLab=page.locator('.react-make-lab');
  await handoffLab.waitFor();
  await handoffLab.locator('[data-director-handoff]').waitFor();
  assert.equal(await handoffLab.locator('[data-director-proposed-shot]').count(),3);
  assert.match(await handoffLab.locator('[data-director-proposed-shot="0"]').textContent(),/Cool window/);
  assert.match(await handoffLab.locator('[data-director-proposed-shot="0"]').textContent(),/musical pulse/i);
  assert.equal(await page.evaluate(()=>localStorage.getItem('frameone-scene-v07')),preImportJSON,
    'Just entering Make Lab must not overwrite saved storyboard bytes');
  assert.equal(await handoffLab.locator('[data-director-confirm]').count(),1);
  assert.equal(await handoffLab.locator('[data-director-export-existing]').count(),1,
    'Existing custom authored work needs an export option before replacement');
  await handoffLab.locator('[data-director-keep]').click();
  assert.equal(await handoffLab.locator('[data-director-handoff]').count(),0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('frameone-scene-v07')),preImportJSON,
    'Declining import must leave original scene completely unchanged');
  await page.locator('.nav-menu [data-page="home"]').click();
  await page.locator('[data-direct-moment]').waitFor();
  await page.locator('[data-direct-toggle]').click();
  await page.locator('[data-direct-preset="uneasy"]').click();
  await page.locator('[data-direct-make-lab]').click();
  handoffLab=page.locator('.react-make-lab');
  await handoffLab.locator('[data-director-handoff]').waitFor();
  const oldShotDownload=page.waitForEvent('download');
  await handoffLab.locator('[data-director-export-existing]').click();
  assert.match((await oldShotDownload).suggestedFilename(),/frame-one-my-first-scene\.txt/);
  assert.equal(await page.evaluate(()=>localStorage.getItem('frameone-scene-v07')),preImportJSON,
    'Exporting the previous shot list must not change it');
  await handoffLab.locator('[data-director-confirm]').click();
  assert.equal(await handoffLab.locator('[data-director-handoff]').count(),0);
  assert.equal(await handoffLab.locator('[data-story-question="mystery"]').getAttribute('aria-pressed'),'true');
  assert.match(await handoffLab.locator('#storyNote').inputValue(),/0–4s, first shot/i);
  assert.match(await handoffLab.locator('#storyNote').inputValue(),/Cool window/i);
  assert.match(await handoffLab.locator('#storyNote').inputValue(),/musical pulse/i);
  const importedPlan=await page.evaluate(()=>window.frameOneLegacy.getStoryboard());
  assert.equal(importedPlan.question,'mystery');
  assert.equal(importedPlan.shots[0],'close');
  assert.equal(importedPlan.shots[1],'close');
  assert.match(importedPlan.notes[1],/4–6s, phone insert/);
  assert.match(importedPlan.notes[2],/FUTURE BEAT/);
  const exportedBackup=JSON.parse(await page.evaluate(()=>window.frameOneLegacy.getBackupJSON()));
  assert.deepEqual(exportedBackup.scene,importedPlan,
    'The original backup serializer must contain the imported storyboard with no new schema key');
  await handoffLab.locator('#storyNote').fill('My editable imported shot idea.');
  assert.equal((await page.evaluate(()=>window.frameOneLegacy.getStoryboard())).notes[0],'My editable imported shot idea.');
  await page.locator('.nav-menu [data-page="home"]').click();
  await page.locator('[data-direct-moment]').waitFor();
  console.log('PASS: Director sketch review, old-board byte retention on decline, export-before-replace, explicit import, editable saved Make Lab and JSON backup');


  assert.equal(await page.locator('[data-cinema-collection]').count(),6);
  await page.locator('[data-cinema-collection="beginnings"]').click();
  await page.locator('[data-collection-view="beginnings"]').waitFor();
  assert.equal(new URL(page.url()).hash,'#collection/beginnings');
  assert.equal(await page.locator('[data-collection-entry]').count(),5);
  assert.equal(await page.locator('[data-collection-act]').count(),3,'Every collection feels like a three-act film');
  assert.equal(await page.locator('.collection-act-reflection').count(),3);
  assert.equal(await page.getByRole('progressbar',{name:'Lessons completed in this collection'}).getAttribute('aria-valuenow'),'0');
  assert.equal(await page.locator('[data-featured-act]').getAttribute('data-featured-act'),'1');
  assert.equal(await page.locator('[data-act-select][aria-pressed="true"]').count(),1);
  assert.equal(await page.locator('[data-collection-view-mode]').getAttribute('data-collection-view-mode'),'all');
  await page.locator('[data-collection-focus-toggle]').click();
  assert.equal(await page.locator('[data-collection-view-mode]').getAttribute('data-collection-view-mode'),'focus');
  assert.equal(await page.locator('[data-collection-act]').count(),1);
  assert.equal(await page.locator('[data-collection-entry]').count(),2);
  assert.equal(await page.locator('[data-focus-previous]').isDisabled(),true);
  await page.locator('[data-focus-next]').click();
  assert.equal(await page.locator('[data-featured-act]').getAttribute('data-featured-act'),'2');
  assert.equal(await page.locator('[data-collection-entry]').count(),2);
  await page.locator('[data-focus-next]').click();
  assert.equal(await page.locator('[data-featured-act]').getAttribute('data-featured-act'),'3');
  assert.equal(await page.locator('[data-collection-entry]').count(),1);
  assert.equal(await page.locator('[data-focus-next]').isDisabled(),true);
  await page.locator('[data-collection-focus-toggle]').click();
  assert.equal(await page.locator('[data-collection-entry]').count(),5);
  assert.equal(await page.locator('[data-collection-act]').count(),3);
  await page.locator('[data-act-select="2"]').click();
  assert.equal(await page.locator('[data-featured-act]').getAttribute('data-featured-act'),'2');
  assert.match(await page.locator('.collection-act-spotlight').textContent(),/A shared language/);
  await photo(page,'v11a4-act-two-spotlight-desktop.png');
  await page.locator('[data-spotlight-start]').click();
  await page.locator('[data-series-lesson="beginnings"]').waitFor();
  assert.equal((await page.locator('.react-lesson h1').textContent()).trim(),
    curriculum.lessons.find(lesson=>lesson.id==='units').title,
    'Featured act must open the real lesson that belongs to that act');
  await page.goBack();
  await page.locator('[data-collection-view="beginnings"]').waitFor();
  await photo(page,'01b-collection-beginnings-desktop.png');
  await page.locator('.collection-primary').click();
  await page.locator('.react-lesson h1').waitFor();
  assert.equal((await page.locator('.react-lesson h1').textContent()).trim(),curriculum.lessons[0].title);
  assert.equal(await page.locator('[data-series-lesson="beginnings"]').count(),1);
  assert.match(await page.locator('.series-lesson-context').textContent(),/PART 1 OF 5/);
  assert.equal(await page.getByRole('progressbar',{name:'Current scene in film journey'}).getAttribute('aria-valuenow'),'1');
  assert.equal(await page.locator('.lesson-navline').count(),0,'Series uses one clear View journey return control');
  assert.equal(await page.locator('[data-scene-transition="scene"]').count(),1,'Ordinary scene handoff shows no false act break');
  assert.match(await page.locator('.series-up-next').textContent(),/How did cinema begin\?/,'Outro names the real following lesson');
  assert.equal(await page.getByRole('button',{name:'Next in series →'}).count(),1);
  await photo(page,'01c-beginnings-series-lesson-desktop.png');
  await page.getByRole('button',{name:'Next in series →'}).click();
  await page.locator('[data-series-lesson="beginnings"]').waitFor();
  assert.match(await page.locator('.series-lesson-context').textContent(),/PART 2 OF 5/);
  assert.match(await page.locator('.series-intermission').textContent(),/A shared language/,
    'Boundary after the first act previews the actual next act');
  assert.equal(await page.locator('[data-scene-transition="act"]').count(),1);
  assert.match(await page.locator('.series-up-next').textContent(),/Frame, shot, scene/,'Real next scene follows next-act editorial cue');
  // Desktop history must still unwind both lessons to the collection.
  await page.goBack();
  await page.locator('.series-lesson-context').getByText(/PART 1 OF 5/).waitFor();
  await page.goBack();
  await page.locator('[data-collection-view="beginnings"]').waitFor();
  assert.equal(new URL(page.url()).hash,'#collection/beginnings','Back returns to actual collection');
  await page.locator('[data-collection-entry="lesson:india"]').click();
  await page.locator('[data-series-lesson="beginnings"]').waitFor();
  assert.equal(await page.locator('[data-scene-transition="finale"]').count(),1,'Last genuine scene has closing, not a fabricated fourth act');
  assert.equal(await page.locator('.series-intermission').count(),0,'Finale does not preview an imaginary act');
  assert.equal(await page.getByRole('button',{name:'Return to collection →'}).count(),1);
  await page.getByRole('button',{name:'Return to collection →'}).click();
  await page.locator('[data-collection-view="beginnings"]').waitFor();
  await page.locator('.collection-back').click();
  await page.locator('.cinema-discovery').waitFor();
  assert.equal(new URL(page.url()).hash,'#home','collection back returns Home');
  console.log('PASS: real cinema library and first collection journey navigate with working history');

  await page.locator('.sidebar [data-page="learn"]').click();
  await page.locator('.react-learn-view h1').waitFor();
  assert.match(await page.locator('.react-learn-view h1').textContent(), /film starts with curiosity/i);
  assert.equal(await page.locator('.react-lesson-card').count(), 33);
  assert.equal(await page.locator('.journey-chapter-segment').count(),6,
    'All six course chapters have a clickable progress marker');
  assert.equal(await page.getByRole('progressbar',{name:'Completed lessons'}).getAttribute('aria-valuenow'),'0');
  assert.equal((await page.locator('.journey-next-title').textContent()).trim(),curriculum.lessons[0].title);
  await page.getByRole('button',{name:/View chapter 2:/}).click();
  assert.equal(await page.getByRole('button',{name:/View chapter 2:/}).getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#reactChapter1').textContent(),'Tell a human story');
  await page.getByRole('button',{name:/View chapter 1:/}).click();
  await photo(page, '02-chapters-desktop.png');
  console.log('PASS: React renders all 33 lessons and six chapters');

  await page.locator('.react-lesson-card').first().click();
  await page.locator('.react-lesson h1').waitFor();
  await page.waitForFunction(() => document.activeElement?.matches('.react-lesson h1'), null, { timeout: 10000 });
  assert.equal((await page.locator('.react-lesson h1').textContent()).trim(), curriculum.lessons[0].title);
  await page.locator('.quiz-option').nth(curriculum.lessons[0].answer).click();
  const complete = page.getByRole('button', { name: /mark lesson complete/i });
  assert.equal(await complete.isEnabled(), true);
  await complete.click();
  assert.equal(await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('frameone-progress-v01') || '[]').includes('why'); } catch { return false; }
  }), true);
  await page.locator('.react-lesson h1').waitFor();
  await page.locator('.sidebar [data-page="learn"]').click();
  await page.locator('.react-learn-view').waitFor();
  assert.equal(await page.getByRole('progressbar',{name:'Completed lessons'}).getAttribute('aria-valuenow'),'1');
  assert.equal((await page.locator('.journey-next-title').textContent()).trim(),curriculum.lessons[1].title);
  assert.match(await page.getByRole('button',{name:/View chapter 1:/}).getAttribute('aria-label'),/1 of 5 lessons finished/);
  await page.locator('.sidebar [data-page="home"]').click();
  await page.locator('[data-journey-resume="beginnings"]').waitFor();
  assert.equal(await page.locator('[data-journey-resume]').count(),1,
    'A saved lesson must reveal only its real source collection');
  assert.match(await page.locator('[data-journey-resume="beginnings"]').textContent(),/1 of 5 lessons/);
  await photo(page,'v11a5-continue-film-desktop.png');
  await page.locator('[data-journey-resume="beginnings"]').click();
  await page.locator('[data-collection-view="beginnings"]').waitFor();
  assert.equal(await page.locator('[data-featured-act]').getAttribute('data-featured-act'),'1');
  await page.locator('.collection-primary').click();
  await page.locator('.react-lesson h1').waitFor();
  assert.equal((await page.locator('.react-lesson h1').textContent()).trim(),
    curriculum.lessons.find(item=>item.id==='history').title,
    'Returning to a started film resumes its next unfinished lesson');
  await page.locator('.sidebar [data-page="learn"]').click();
  await page.locator('.react-learn-view').waitFor();
  await page.getByRole('button',{name:'Continue learning →'}).click();
  await page.locator('.react-lesson h1').waitFor();
  await photo(page, '03-lesson-desktop.png');
  console.log('PASS: React quiz marks original progress key and advances to next lesson');

  // Learner-created notes must survive navigation and page reloads.
  const secondLessonTitle = (await page.locator('.react-lesson h1').textContent()).trim();
  const note = 'I want to frame a shot where an umbrella hides a surprise.';
  await page.locator('#lessonPractice').fill(note);
  await page.getByText('Saved automatically on this device.', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('frameone-practice-v07') || '{}');
    return Object.values(saved).includes('I want to frame a shot where an umbrella hides a surprise.');
  }), true, 'Practice text must be written immediately without tapping Save');
  await page.locator('.sidebar [data-page="learn"]').click();
  await page.locator('.react-learn-view').waitFor();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.frameOneLegacy), { timeout: 15000 });
  await page.locator('.react-learn-view').waitFor();
  await page.getByRole('button', { name: 'Continue learning →' }).click();
  await page.locator('.react-lesson h1').waitFor();
  assert.equal((await page.locator('.react-lesson h1').textContent()).trim(), secondLessonTitle);
  assert.equal(await page.locator('#lessonPractice').inputValue(), note);
  await page.goBack({ waitUntil: 'domcontentloaded' });
  await page.locator('.react-learn-view').waitFor();
  console.log('PASS: auto-saved practice note survives reload and browser-back route returns to chapters');

  await page.locator('.sidebar [data-page="lab"]').click();
  await page.locator('.lab-tabs').waitFor();
  for (const lab of ['frame', 'sound', 'cut', 'light', 'story', 'colour', 'continuity']) {
    await page.locator('.lab-tabs:visible [data-lab="' + lab + '"]').click();
    await page.locator('.lab-tabs:visible [data-lab="' + lab + '"][aria-pressed="true"]').waitFor();
    assert.ok((await page.locator('#main-content .page h1').textContent()).trim(), 'Lab ' + lab + ' needs a heading');
  }
  await photo(page, '04-continuity-desktop.png');
  await page.locator('.lab-tabs:visible [data-lab="frame"]').click();
  await page.locator('.react-continuity-lab').waitFor({ state: 'detached' });
  const framing = page.locator('.react-frame-lab');
  await framing.waitFor();
  assert.equal(await page.locator('#content').innerHTML(), '', 'React must own Frame Lab without hidden legacy markup');
  assert.equal(await framing.locator('.react-cinema-scene svg').count(), 1, 'Original illustration is retained');
  await framing.locator('[data-frame="medium"]').click();
  assert.equal(await framing.locator('[data-frame="medium"]').getAttribute('aria-pressed'), 'true');
  assert.match(await framing.locator('.react-cinema-scene svg').getAttribute('viewBox'), /160\.00 90\.00 320\.00 180\.00/);
  const framingSlider = framing.locator('#frameZoom');
  await framingSlider.focus();
  await framingSlider.press('End');
  assert.equal(await framing.locator('#frameZoomValue').textContent(), '3.0×');
  assert.match(await framing.locator('.react-cinema-scene svg').getAttribute('viewBox'), /213\.33 120\.00 213\.33 120\.00/);
  await framingSlider.press('Home');
  assert.equal(await framing.locator('#frameZoomValue').textContent(), '1.0×');
  await framing.locator('[data-guides]').click();
  assert.equal(await framing.locator('[data-guides]').getAttribute('aria-pressed'), 'false');
  assert.equal(await framing.locator('.scene-stage.without-guides').count(), 1);
  await framing.locator('[data-compare]').click();
  assert.equal(await framing.locator('.frame-comparison svg').count(), 2);
  assert.equal(await framing.locator('.frame-comparison .scene-stage.without-guides').count(), 2);
  await photo(page, '11-react-frame-desktop.png');
  await framing.locator('[data-frame="close"]').click();
  assert.equal(await framing.locator('#frameZoomValue').textContent(), '3.0×');
  await framing.locator('[data-compare]').click();
  assert.equal(await framing.locator('.frame-comparison').count(), 0);
  console.log('PASS: React Frame Lab owns markup, preserves artwork and responds to presets, slider, guides and comparison');
  await page.locator('.lab-tabs:visible [data-lab="colour"]').click();
  const colour = page.locator('.react-colour-lab');
  await colour.waitFor();
  assert.equal(await page.locator('#content').innerHTML(), '', 'React must own Colour Lab without hidden legacy tabs');
  assert.equal(await colour.locator('.colour-compare svg').count(), 2, 'Keep both original SVG illustrations');
  assert.equal(await colour.locator('.colour-grade').evaluate(el => Number(getComputedStyle(el).opacity)), 0, 'Neutral mode must not apply an overlay');
  await colour.locator('[data-colour="warm"]').click();
  assert.equal(await colour.locator('[data-colour="warm"]').getAttribute('aria-pressed'), 'true');
  assert.match(await colour.locator('.result-box p').textContent(), /warm orange overlay/i);
  const range = colour.locator('#colourStrength');
  await range.focus();
  await range.press('Home');
  assert.equal(await colour.locator('#colourStrengthValue').textContent(), '0%');
  assert.equal(await colour.locator('.colour-grade').evaluate(el => Number(getComputedStyle(el).opacity)), 0, 'Minimum strength is zero');
  await range.press('End');
  assert.equal(await colour.locator('#colourStrengthValue').textContent(), '100%');
  await colour.locator('[data-colour="cool"]').click();
  assert.equal(await colour.locator('[data-colour="cool"]').getAttribute('aria-pressed'), 'true');
  const gradeDiagnostics = await colour.locator('.colour-grade').evaluate(el => ({
    inline: el.style.opacity, computed: getComputedStyle(el).opacity,
    mode: document.querySelector('.react-colour-lab [data-colour="cool"]')?.getAttribute('aria-pressed'),
    strength: document.querySelector('.react-colour-lab #colourStrengthValue')?.textContent
  }));
  console.log('Colour Lab overlay QA diagnostics:', JSON.stringify(gradeDiagnostics));
  await photo(page, '09-react-colour-precheck.png');
  await page.waitForFunction(() => {
    const element = document.querySelector('.react-colour-lab .colour-grade');
    return element && Number(getComputedStyle(element).opacity) > 0.4;
  }, null, { timeout: 4000 });
  const fullOpacity = await colour.locator('.colour-grade').evaluate(el => Number(getComputedStyle(el).opacity));
  assert.ok(fullOpacity > 0.4 && fullOpacity <= 0.42, 'Overlay alpha retains existing 42% cap');
  await photo(page, '09-react-colour-desktop.png');
  await colour.locator('[data-colour="neutral"]').click();
  await page.waitForFunction(() => {
    const element = document.querySelector('.react-colour-lab .colour-grade');
    return element && Number(getComputedStyle(element).opacity) < 0.01;
  }, null, { timeout: 4000 });
  assert.ok((await colour.locator('.colour-grade').evaluate(el => Number(getComputedStyle(el).opacity))) < 0.01, 'Neutral ignores overlay strength');
  // Exercise the primary learning interaction in the remaining five labs.
  await page.locator('.lab-tabs:visible [data-lab="light"]').click();
  await colour.waitFor({ state: 'detached' });
  const lighting = page.locator('.react-lighting-lab');
  await lighting.waitFor();
  assert.equal(await page.locator('#content').innerHTML(), '', 'React must own Lighting Lab without hidden legacy markup');
  assert.equal(await lighting.locator('#lightVisual svg').count(), 1, 'Keep original author-drawn lighting illustration');
  assert.match(await lighting.locator('#lightVisual [role="img"]').getAttribute('aria-label'), /front light/i);
  await lighting.locator('[data-light="side"]').click();
  assert.equal(await lighting.locator('[data-light="side"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await lighting.locator('svg [filter*="shadeBlur"]').count(), 1, 'Side mode draws a controllable shadow');
  const brightnessSlider = lighting.locator('#lightPower');
  await brightnessSlider.focus();
  await brightnessSlider.press('Home');
  assert.equal(await lighting.locator('#lightPowerValue').textContent(), '20%');
  assert.equal(await lighting.locator('svg rect[pointer-events="none"]').getAttribute('opacity'), '0.43', 'Low brightness adds a dark overlay');
  await brightnessSlider.press('End');
  assert.equal(await lighting.locator('#lightPowerValue').textContent(), '100%');
  assert.equal(await lighting.locator('svg rect[pointer-events="none"]').getAttribute('opacity'), '0.00', 'High brightness removes the dark overlay');
  const softnessSlider=lighting.locator('#lightSoft');
  await softnessSlider.focus();
  await softnessSlider.press('End');
  assert.equal(await lighting.locator('#lightSoftValue').textContent(), '100% soft');
  assert.equal(await lighting.locator('svg feGaussianBlur').getAttribute('stdDeviation'), '11.0');
  await softnessSlider.press('Home');
  assert.equal(await lighting.locator('#lightSoftValue').textContent(), '0% soft');
  assert.equal(await lighting.locator('svg feGaussianBlur').getAttribute('stdDeviation'), '1.0');
  await lighting.locator('[data-light="back"]').click();
  assert.match(await lighting.locator('.lighting-badge').textContent(), /LIGHT BEHIND/);
  await lighting.locator('[data-light="front"]').click();
  assert.match(await lighting.locator('.lighting-badge').textContent(), /LIGHT NEAR THE CAMERA SIDE/);
  await lighting.locator('[data-light="side"]').click();
  const lightingGeometry = await lighting.evaluate(root => {
    const preview = root.querySelector('.lab-preview')?.getBoundingClientRect();
    const panel = root.querySelector('.film-controls')?.getBoundingClientRect();
    return { previewHeight: preview?.height ?? 0, previewTop: preview?.top ?? 0, panelTop: panel?.top ?? 0 };
  });
  console.log('Lighting desktop geometry:', JSON.stringify(lightingGeometry));
  assert.ok(lightingGeometry.previewHeight > 180 && lightingGeometry.previewHeight < 480, 'Lighting desktop preview must wrap the illustration instead of stretching');
  assert.ok(Math.abs(lightingGeometry.previewTop-lightingGeometry.panelTop) < 40, 'Lighting preview aligns with the top of the control panel');
  await photo(page, '13-react-lighting-desktop.png');
  console.log('PASS: React Lighting Lab owns markup and responds to all directions, brightness and shadow softness');

  await page.locator('.lab-tabs:visible [data-lab="cut"]').click();
  await lighting.waitFor({ state:'detached' });
  const cut = page.locator('.react-cut-lab');
  await cut.waitFor();
  assert.equal(await page.locator('#content').innerHTML(), '', 'React must own Cut Lab without hidden legacy markup');
  assert.equal(await cut.locator('.timeline-clip').count(), 3);
  assert.equal(await cut.locator('.cut-illustration.place').count(), 1, 'Original drawn establishing shot retained');
  // Give the first shot its own duration, then move it. The 4-second hold
  // belongs to that shot, not to an arbitrary timeline position.
  await cut.locator('#shotDuration').focus();
  await cut.locator('#shotDuration').press('End');
  assert.match(await cut.locator('.duration-control label').textContent(), /5 seconds/);
  await cut.locator('[data-move="0:right"]').click();
  assert.match(await cut.locator('.timeline-clip').nth(1).textContent(), /5s/);
  assert.match(await cut.locator('.timeline-clip').first().textContent(), /Clock/i);
  assert.equal(await cut.locator('.cut-illustration.place').count(), 1, 'Selected shot follows moved clip');
  await cut.locator('[data-cut-step="0"]').click();
  assert.equal(await cut.locator('.cut-illustration.detail').count(), 1);
  assert.match(await cut.locator('.result-box p').textContent(), /beginning with the clock/i);
  await cut.locator('[data-cut-play="play"]').click();
  assert.equal(await cut.locator('[data-cut-play="stop"]').count(), 1);
  assert.equal(await cut.locator('.timeline-clip.clip-playing').count(), 1);
  await cut.locator('[data-cut-play="stop"]').click();
  assert.equal(await cut.locator('.timeline-clip.clip-playing').count(), 0);
  // Three one-second holds should advance to all three shots and stop.
  await cut.locator('[data-cut-reset]').click();
  for(let i=0;i<3;i++){
    await cut.locator(`[data-cut-step="${i}"]`).click();
    await cut.locator('#shotDuration').focus();
    await cut.locator('#shotDuration').press('Home');
  }
  await cut.locator('[data-cut-play="play"]').click();
  await page.waitForFunction(() => {
    const root=document.querySelector('.react-cut-lab');
    return root?.querySelector('.cut-illustration.person') && root.querySelector('[data-cut-play="play"]');
  },null,{timeout:7000});
  assert.equal(await cut.locator('[data-cut-play="stop"]').count(),0,'Playback stops automatically after the third shot');
  await photo(page,'15-react-cut-desktop.png');
  // Navigating away must unmount and cancel the timer (no hidden playback).
  await cut.locator('[data-cut-play="play"]').click();
  await cut.locator('[data-lab="story"]').click();
  await cut.waitFor({state:'detached'});
  await page.waitForTimeout(1250);
  assert.equal(await page.locator('.react-cut-lab').count(),0,'Playback stops when leaving Cut Lab');
  await page.locator('.lab-tabs:visible [data-lab="cut"]').click();
  await cut.waitFor();
  assert.equal(await cut.locator('[data-cut-play="stop"]').count(),0,'Reopening starts with playback stopped');
  assert.equal(await cut.locator('.timeline-clip').count(),3,'Edit persists during navigation');
  console.log('PASS: React Cut Lab timeline, duration rebinding, complete playback and unmount cleanup');

  await page.locator('.lab-tabs:visible [data-lab="story"]').click();
  const make = page.locator('.react-make-lab');
  await make.waitFor();
  assert.equal(await page.locator('#content').innerHTML(),'', 'React must own Make Lab without hidden legacy markup');
  assert.equal(await make.locator('.story-film-frame svg').count(),1,'Original vector storyboard preserved');
  const opening = await make.locator('[data-story-question="reunion"]').click();
  assert.equal(await make.locator('[data-story-question="reunion"]').getAttribute('aria-pressed'),'true');
  await make.locator('[data-story-shot="close"]').click();
  assert.equal(await make.locator('[data-story-shot="close"]').getAttribute('aria-pressed'),'true');
  await make.locator('#storyNote').fill('The character spots a clue.');
  await make.locator('[data-story-save]').click();
  assert.match(await make.locator('#storyStatus').textContent(),/Saved in this browser/i);
  assert.ok(await page.evaluate(() => localStorage.getItem('frameone-scene-v07')?.includes('The character spots a clue.')));
  assert.equal(await page.evaluate(() => window.frameOneLegacy.getStoryboard().question),'reunion','legacy backup engine sees React storyboard changes');
  await make.locator('[data-story-next]').click();
  await make.locator('#storyNote').fill('A distant bus approaches.');
  await make.locator('[data-story-shot="medium"]').click();
  await make.locator('[data-story-next]').click();
  await make.locator('#storyNote').fill('They decide to stay.');
  await make.locator('[data-story-save]').click();
  assert.ok(await page.evaluate(() => JSON.parse(localStorage.getItem('frameone-scene-v07')).notes[2]==='They decide to stay.'));
  const planDownload=page.waitForEvent('download');
  await make.locator('[data-story-export]').click();
  assert.match((await planDownload).suggestedFilename(),/frame-one-my-first-scene\.txt/);
  // Backup restoration must update React state without reloading the page.
  await page.evaluate(() => window.frameOneLegacy.importBackup({
    format:'frameone-learning-backup',version:1,
    completed:['why'],notes:{},scene:{question:'decision',shots:['wide','wide','medium'],notes:['Old restored scene','Restored middle','Restored ending']}
  }));
  await page.waitForFunction(() => {
    const root=document.querySelector('.react-make-lab');
    return root?.querySelector('[data-story-question="decision"]')?.getAttribute('aria-pressed')==='true'
      && root?.querySelector('#storyNote')?.value==='Old restored scene';
  },null,{timeout:10000});
  assert.equal(await make.locator('[data-story-question="decision"]').getAttribute('aria-pressed'),'true');
  assert.equal(await make.locator('#storyNote').inputValue(),'Old restored scene');
  assert.ok(await page.evaluate(() => localStorage.getItem('frameone-scene-v07')?.includes('Restored middle')));
  await photo(page,'17-react-make-desktop.png');
  await make.locator('.lab-tabs [data-lab="cut"]').click();
  await make.waitFor({state:'detached'});
  await page.locator('.lab-tabs:visible [data-lab="story"]').click();
  await make.waitFor();
  assert.equal(await make.locator('[data-story-question="decision"]').getAttribute('aria-pressed'),'true');
  assert.equal(await make.locator('#storyNote').inputValue(),'Old restored scene','Restored storyboard loads after navigation');
  console.log('PASS: React Make Lab writes original storage, exports text, survives navigation and updates on backup restore');

  await page.locator('.lab-tabs:visible [data-lab="continuity"]').click();
  const continuity = page.locator('.react-continuity-lab');
  await continuity.waitFor();
  assert.equal(await page.locator('#content').innerHTML(), '', 'React must own continuity markup, without duplicated legacy content');
  await continuity.locator('[data-continuity="changed"]').click();
  assert.equal(await continuity.locator('[data-continuity="changed"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await continuity.locator('.continuity-cup.moved').count(), 1);
  assert.match(await continuity.locator('.result-box p').textContent(), /continuity mismatch/i);
  await continuity.locator('[data-lab="frame"]').click();
  await continuity.waitFor({ state: 'detached' });
  await page.locator('.react-frame-lab #frameZoom').waitFor();
  await page.locator('.lab-tabs:visible [data-lab="continuity"]').click();
  await continuity.waitFor();
  assert.equal(await continuity.locator('[data-continuity="changed"]').getAttribute('aria-pressed'), 'true', 'React continuity choice survives lab tab navigation');
  await continuity.locator('[data-continuity="match"]').click();
  assert.equal(await continuity.locator('.continuity-cup.moved').count(), 0);
  console.log('PASS: Continuity Lab is React-owned, updates its illustrated prop, and preserves choice across lab navigation');

  await page.locator('.lab-tabs:visible [data-lab="sound"]').click();
  const sound=page.locator('.react-sound-lab');
  await sound.waitFor();
  assert.equal(await page.locator('#content').innerHTML(),'','React must own Sound Lab without legacy duplication');
  assert.equal(await sound.locator('.sound-wave span').count(),31);
  assert.equal(await sound.locator('.audio-picture svg').count(),1,'Original local bus-stop illustration preserved');
  assert.equal(await sound.locator('.monitor-hud:visible,.frame-corner:visible,.scene-label:visible').count(),0,'Framing labels must not crowd the Sound illustration');
  assert.equal(await sound.locator('[data-sound="silence"]').getAttribute('aria-pressed'),'true');
  await page.evaluate(() => {
    window.__f1SoundQa={created:0,closed:0};
    const Original=window.AudioContext;
    if(Original)window.AudioContext=class extends Original{
      constructor(...args){super(...args);window.__f1SoundQa.created++;}
      close(){window.__f1SoundQa.closed++;return super.close();}
    };
  });
  await sound.locator('#ambience').uncheck();
  assert.equal(await sound.locator('#ambience').isChecked(),false);
  await sound.locator('[data-audio="play"]').click();
  assert.match(await sound.locator('.sound-status').textContent(),/No generated sound/i);
  assert.equal(await page.evaluate(()=>window.__f1SoundQa.created),0,'Muted No music must not initialize audio');
  await sound.locator('[data-sound="warm"]').click();
  await sound.locator('[data-audio="play"]').click();
  await sound.locator('[data-audio="stop"]').waitFor();
  assert.equal(await sound.locator('.sound-cinema.is-playing').count(),1);
  assert.equal(await page.evaluate(()=>window.__f1SoundQa.created),1,'Audio is created only after Play click');
  await sound.locator('[data-sound="tension"]').click();
  assert.equal(await sound.locator('[data-audio="stop"]').count(),0,'Changing mode stops the last sound');
  await page.waitForFunction(()=>window.__f1SoundQa.closed>=1);
  await sound.locator('#ambience').check();
  await sound.locator('[data-sound="silence"]').click();
  await sound.locator('[data-audio="play"]').click();
  await sound.locator('[data-audio="stop"]').waitFor();
  await sound.locator('[data-audio="stop"]').click();
  await page.waitForFunction(()=>window.__f1SoundQa.closed>=2);
  await sound.locator('[data-sound="warm"]').click();
  await sound.locator('[data-audio="play"]').click();
  await sound.locator('[data-audio="stop"]').waitFor();
  await sound.locator('.lab-tabs [data-lab="cut"]').click();
  await sound.waitFor({state:'detached'});
  await page.waitForFunction(()=>window.__f1SoundQa.closed===window.__f1SoundQa.created);
  await page.locator('.lab-tabs:visible [data-lab="sound"]').click();
  await sound.waitFor();
  assert.equal(await sound.locator('[data-audio="stop"]').count(),0,'Sound Lab must reopen fully stopped');
  assert.equal(await sound.locator('[data-sound="warm"]').getAttribute('aria-pressed'),'true','Sound mode persists across labs');
  assert.equal(await sound.locator('#ambience').isChecked(),true,'Ambience choice persists across labs');
  await photo(page,'19-react-sound-desktop.png');
  console.log('PASS: all seven React Labs, Sound playback opt-in, no-music semantics and closed contexts after change/stop/unmount');

  await page.locator('.sidebar [data-page="learn"]').click();
  await page.locator('.react-learn-view').waitFor();
  const backup = page.locator('.backup-panel');
  await backup.locator('summary').first().click();
  const downloadEvent = page.waitForEvent('download');
  await backup.getByRole('button', { name: /download learning backup/i }).click();
  const download = await downloadEvent;
  assert.match(download.suggestedFilename(), /\.json$/);
  console.log('PASS: browser generates a downloadable learning backup');

  const onDialog = page.waitForEvent('dialog');
  await backup.locator('input[type="file"]').setInputFiles({
    name: 'demo-backup.json', mimeType: 'application/json', buffer: Buffer.from('{}')
  });
  const confirmation = await onDialog;
  assert.equal(confirmation.type(), 'confirm');
  await confirmation.dismiss();
  await page.getByText('Restore cancelled. Your current learning data is unchanged.').waitFor();
  assert.equal(await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('frameone-progress-v01') || '[]').includes('why'); } catch { return false; }
  }), true);
  console.log('PASS: cancelling backup restore leaves previously saved progress unchanged');

  // Android WebView can refuse file downloads or clipboard access, so verify the
  // visible JSON copy/paste path actually preserves our existing v1 schema.
  await backup.locator('.backup-text-fallback > summary').click();
  await backup.getByRole('button',{name:'Show and copy backup text'}).click();
  const visibleExport = backup.locator('#backupCopyText');
  await visibleExport.waitFor();
  assert.equal(await visibleExport.getAttribute('readonly'),'');
  const portableJSON = JSON.parse(await visibleExport.inputValue());
  assert.equal(portableJSON.format,'frameone-learning-backup');
  assert.equal(portableJSON.version,1);
  assert(Array.isArray(portableJSON.completed));
  assert(portableJSON.scene && typeof portableJSON.scene.question==='string');
  assert.equal((await backup.locator('#backupPasteText').getAttribute('maxlength')),'2000000');

  // Restoring pasted text requires exactly the same explicit overwrite consent
  // and legacy validation as importing from a downloaded file.
  const newNote = 'Restored safely from a copied JSON backup.';
  portableJSON.notes.why = newNote;
  const copyPayload = JSON.stringify(portableJSON);
  await backup.locator('#backupPasteText').fill(copyPayload);
  page.once('dialog',dialog=>dialog.dismiss());
  await backup.getByRole('button',{name:'Restore pasted backup'}).click();
  await page.getByText('Restore cancelled. Your current learning data is unchanged.').waitFor();
  assert.notEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-practice-v07')||'{}').why),newNote,'Cancelled pasted restore must not change notes');

  page.once('dialog',dialog=>dialog.accept());
  await backup.getByRole('button',{name:'Restore pasted backup'}).click();
  await page.getByText('Learning backup restored in this browser.').waitFor();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-practice-v07')||'{}').why),newNote,'Pasted backup restores notes');
  assert.equal(await backup.locator('#backupPasteText').inputValue(),'','Clear sensitive pasted JSON after successful restoration');
  await photo(page,'22-portable-backup-desktop.png');
  console.log('PASS: private text backup export, cancelled pasted restore, confirmed pasted restore and original v1 learner data');

  // Offline claim must be tested with the built service worker, not assumed from the manifest.
  try {
    await page.locator('.sidebar [data-page="home"]').click();
    await page.locator('#content .page').waitFor();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker?.controller), null, { timeout: 15000 });
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(window.frameOneLegacy));
    await page.locator('#content .page').waitFor({ timeout: 12000 });
    await photo(page, '07-offline-home.png');
    console.log('PASS: application reloads using cached assets while offline');
  } catch (error) {
    record('Offline reload failed: ' + (error instanceof Error ? error.message : String(error)));
  } finally {
    await context.setOffline(false);
  }
  // A new deployment should never force-refresh someone writing scene notes.
  // Show an explicit, accessible action that they may choose later.
  await page.evaluate(() => window.dispatchEvent(new Event('frameone:pwa-update-ready')));
  await page.locator('.pwa-update-notice').waitFor();
  assert.match(await page.locator('.pwa-update-notice').textContent(), /New version available/);
  assert.equal(await page.getByRole('button',{name:'Refresh now'}).isEnabled(), true);
  console.log('PASS: PWA updates offer a user-controlled refresh instead of discarding the active session');
  await context.close();

  // Separate clean browser profile: verify the actual rendered quiz flow for
  // every lesson, independent from the main demo's saved notes and storyboard.
  const lessonContext = await browser.newContext({ viewport:{width:1280,height:800}, acceptDownloads:false });
  const sweep = await lessonContext.newPage();
  sweep.on('pageerror', error => record('33-lesson sweep browser exception: ' + error.message));
  await sweep.goto(base, { waitUntil: 'domcontentloaded' });
  await sweep.waitForFunction(() => Boolean(window.frameOneLegacy));
  for (const item of curriculum.lessons) {
    await sweep.evaluate(id => window.frameOneLegacy.navigate('lesson', id), item.id);
    const heading = sweep.locator('.react-lesson h1');
    await sweep.waitForFunction(title => document.querySelector('.react-lesson h1')?.textContent?.trim() === title, item.title, { timeout: 12000 });
    assert.equal((await heading.textContent()).trim(), item.title, 'Route title for ' + item.id);
    await sweep.locator('.quiz-option').nth(item.answer).click();
    const completeButton = sweep.getByRole('button', { name: /mark lesson complete/i });
    assert.equal(await completeButton.isEnabled(), true, 'Quiz complete for ' + item.id);
    await completeButton.click();
    const stored = await sweep.evaluate(() => JSON.parse(localStorage.getItem('frameone-progress-v01') || '[]'));
    assert.ok(stored.includes(item.id), 'Progress not persisted for ' + item.id);
  }
  const allDone = await sweep.evaluate(() => JSON.parse(localStorage.getItem('frameone-progress-v01') || '[]').length);
  assert.equal(allDone, 33);
  console.log('PASS: all 33 lesson pages, correct quiz answers and completed progress');
  await lessonContext.close();

  for (const width of [390, 320]) {
    const mobile = await browser.newContext({ viewport: { width, height: 800 }, isMobile: true, deviceScaleFactor: 2, hasTouch: true, acceptDownloads: true });
    const phone = await mobile.newPage();
    phone.on('pageerror', error => record('Mobile browser exception: ' + error.message));
    await phone.goto(base, { waitUntil: 'domcontentloaded' });
    await phone.waitForFunction(() => Boolean(window.frameOneLegacy), { timeout: 15000 });
    // v0.10: the new cinematic welcome must not consume the entire phone screen.
    const heroBounds=await phone.locator('#content .hero').boundingBox();
    assert.ok(heroBounds && heroBounds.height < 385,
      'Compact original-art home hero should be considerably shorter than the old 485px card');
    assert.equal(await phone.locator('#content .hero-art').count(),1,
      'Preserve the original sunset/silhouette artwork');
    assert.equal(await phone.locator('#content .chapter-quick').count(),0,
      'Redundant six-chapter Home banner removed; chapters remain inside Learn');
    assert.match(await phone.locator('.home-greeting').textContent(),
      /Good (morning|afternoon|evening|night)\./);
    assert.equal(await phone.locator('.fact-panel #filmThoughtTitle').count(),1);
    await phone.locator('.cinema-discovery').waitFor();
    assert.equal(await phone.locator('[data-cinema-shelf]').count(),6);
    const mobileAnatomy=phone.locator('[data-scene-anatomy]');
    await mobileAnatomy.locator('[data-anatomy-study="light"]').click();
    await mobileAnatomy.locator('[data-anatomy-option="b"]').click();
    assert.equal(await mobileAnatomy.locator('[data-scene-choice]').getAttribute('data-scene-choice'),'b');

    await mobileAnatomy.locator('[data-anatomy-study="rhythm"]').click();
    await mobileAnatomy.locator('[data-anatomy-option="b"]').click();
    assert.equal(await mobileAnatomy.locator('.scene-anatomy-rhythm-clip:visible').count(),3);
    const rhythmLayout=await mobileAnatomy.locator('.scene-anatomy-rhythm-plan').evaluate(node=>({
      scroll:node.scrollWidth,width:node.clientWidth
    }));
    assert.ok(rhythmLayout.scroll<=rhythmLayout.width+3,
      'Edit plan clips must not overflow their timeline on compact phones');

    const anatomyBounds=await mobileAnatomy.boundingBox();
    assert.ok(anatomyBounds && anatomyBounds.width<=width+2,
      'Scene Anatomy must fit a narrow phone without clipped horizontal layout');
    await mobileAnatomy.screenshot({path:path.join(shots,'01-scene-anatomy-'+width+'px.png'),animations:'disabled'});

    const mobileDirector=phone.locator('[data-direct-moment]');
    await mobileDirector.locator('[data-direct-toggle]').click();
    await mobileDirector.locator('[data-direct-frame="close"]').click();
    await mobileDirector.locator('[data-direct-light="cold"]').click();
    await mobileDirector.locator('[data-direct-sound="pulse"]').click();
    await mobileDirector.locator('[data-direct-edit="reveal"]').click();
    assert.equal(await mobileDirector.locator('[data-direct-second-shot]').count(),1);
    const directBounds=await mobileDirector.boundingBox();
    assert.ok(directBounds&&directBounds.width<=width+2,'Director workshop must fit '+width+'px');
    const directOverflow=await mobileDirector.evaluate(el=>({scroll:el.scrollWidth,viewport:el.clientWidth}));
    assert.ok(directOverflow.scroll<=directOverflow.viewport+3,
      'Four craft selectors and shot strip must not overflow '+width+'px');
    await mobileDirector.screenshot({path:path.join(shots,'01-direct-the-moment-'+width+'px.png'),animations:'disabled'});
    await mobileDirector.locator('[data-direct-toggle]').click();


    assert.equal(await phone.locator('[data-cinema-entry^="lab:"]').count(),7);
    assert.equal(await phone.locator('#content .card-grid').isVisible(),false);
    const libraryRailMetrics=await phone.locator('.cinema-rail').first().evaluate(el=>{
      const before=el.scrollLeft;el.scrollLeft=140;
      return {before,after:el.scrollLeft,max:el.scrollWidth-el.clientWidth};
    });
    assert.ok(libraryRailMetrics.max>90&&libraryRailMetrics.after>0,
      'Cinema rails really swipe horizontally on '+width+'px screens');
    await photo(phone, 'v11-discovery-home-'+width+'.png');
    assert.equal(await phone.locator('[data-journey-resume]').count(),0);
    // Re-enter a previously started series with genuine progress; never track
    // studio completion or add a new persistence key.
    await phone.evaluate(()=>localStorage.setItem('frameone-progress-v01',
      JSON.stringify(['why','history'])));
    await phone.locator('.mobile-nav [data-page="learn"]').click();
    await phone.locator('.react-learn-view').waitFor();
    await phone.locator('.mobile-nav [data-page="home"]').click();
    await phone.locator('[data-journey-resume="beginnings"]').waitFor();
    assert.equal(await phone.locator('[data-journey-resume]').count(),1);
    assert.equal(await phone.locator('.cinema-journey-return-card').count(),1);
    assert.match(await phone.locator('[data-journey-resume="beginnings"]').textContent(),/ACT 02 OF 03/);
    const journeyCard=await phone.locator('[data-journey-resume="beginnings"]').boundingBox();
    assert.ok(journeyCard&&journeyCard.width<=width,
      'Return card must fit within '+width+'px handset');
    await photo(phone,'v11a5-started-journey-'+width+'.png');
    await phone.locator('[data-journey-resume="beginnings"]').click();
    await phone.locator('[data-collection-view="beginnings"]').waitFor();
    assert.equal(await phone.locator('[data-featured-act]').getAttribute('data-featured-act'),'2');
    await phone.locator('.mobile-nav [data-page="home"]').click();
    await phone.locator('.cinema-discovery').waitFor();
    await phone.evaluate(()=>localStorage.removeItem('frameone-progress-v01'));
    await phone.locator('.mobile-nav [data-page="learn"]').click();
    await phone.locator('.react-learn-view').waitFor();
    await phone.locator('.mobile-nav [data-page="home"]').click();
    await phone.locator('.cinema-discovery').waitFor();
    assert.equal(await phone.locator('[data-journey-resume]').count(),0,
      'Cleared original progress must immediately remove return cards');
    // Tapping a shelf title opens a real collection, not a duplicated Home carousel.
    await phone.locator('[data-cinema-collection="visual"]').click();
    await phone.locator('[data-collection-view="visual"]').waitFor();
    assert.equal(await phone.locator('.collection-back').isVisible(),false,'No duplicate mobile Back controls');
    assert.equal(new URL(phone.url()).hash,'#collection/visual');
    assert.equal(await phone.locator('[data-collection-entry]').count(),7);
    assert.equal(await phone.locator('[data-collection-act]').count(),3);
    assert.equal(await phone.locator('.collection-act-reflection').count(),3);
    await phone.locator('[data-act-select="3"]').click();
    assert.equal(await phone.locator('[data-featured-act]').getAttribute('data-featured-act'),'3');
    assert.equal(await phone.locator('[data-act-select][aria-pressed="true"]').count(),1);
    await photo(phone,'v11a4-visual-act-three-'+width+'.png');
    await phone.locator('[data-act-focus-entry]').click();
    assert.equal(await phone.locator('[data-collection-view-mode]').getAttribute('data-collection-view-mode'),'focus');
    assert.equal(await phone.locator('[data-collection-act]').count(),1);
    assert.equal(await phone.locator('[data-collection-entry]').count(),2);
    assert.equal(await phone.locator('[data-focus-next]').isDisabled(),true);
    await photo(phone,'v12a1-focused-act-three-'+width+'.png');
    await phone.locator('[data-collection-focus-toggle]').click();
    assert.equal(await phone.locator('[data-collection-entry]').count(),7);
    await phone.locator('[data-act-select="1"]').click();
    assert.equal(await phone.getByRole('progressbar',{name:'Lessons completed in this collection'}).getAttribute('aria-valuemax'),'7');
    await photo(phone,'v11-collection-visual-'+width+'.png');
    await phone.locator('[data-collection-entry="lesson:lighting"]').click();
    await phone.locator('.react-lesson h1').waitFor();
    assert.equal(await phone.locator('[data-series-lesson="visual"]').count(),1);
    assert.match(await phone.locator('.series-lesson-context').textContent(),/PART 3 OF 7/);
    assert.equal(await phone.locator('.lesson-navline').count(),0);
    assert.equal(await phone.locator('.series-scene-progress').count(),1);
    assert.equal(await phone.locator('.series-scene-outro').count(),1);
    assert.equal(await phone.getByRole('button',{name:'Next in series →'}).count(),1);
    await photo(phone,'v12a2-scene-bridge-'+width+'.png');
    await phone.getByRole('button',{name:'Back within Frame One'}).click();
    await phone.locator('[data-collection-view="visual"]').waitFor();
    await phone.getByRole('button',{name:'Back within Frame One'}).click();
    await phone.locator('.cinema-discovery').waitFor();
    await phone.locator('[data-cinema-collection="studio"]').click();
    await phone.locator('[data-collection-view="studio"]').waitFor();
    assert.equal(await phone.locator('[data-collection-entry^="lab:"]').count(),7);
    assert.equal(await phone.locator('[data-collection-act]').count(),3);
    assert.equal(await phone.locator('[data-act-select]').count(),3);
    assert.match(await phone.locator('[data-spotlight-start]').textContent(),/Try this act/,
      'Lab-only stage promises exploration, not tracked completion');
    assert.equal(await phone.getByRole('progressbar',{name:'Lessons completed in this collection'}).count(),0,
      'Do not claim Lab practice is completed without a tracking system');
    await photo(phone,'v11-collection-studio-'+width+'.png');
    await phone.locator('.collection-primary').click();
    await phone.locator('.react-frame-lab').waitFor();
    await phone.getByRole('button',{name:'Back within Frame One'}).click();
    await phone.locator('[data-collection-view="studio"]').waitFor();
    await phone.getByRole('button',{name:'Back within Frame One'}).click();
    await phone.locator('.cinema-discovery').waitFor();
    // Every poster still has a direct destination: lesson, interactive Lab and Film Roles.
    await phone.locator('[data-cinema-entry="lesson:lighting"]').click();
    await phone.locator('.react-lesson h1').waitFor();
    assert.match(await phone.locator('.react-lesson h1').textContent(),/lighting do/i);
    await phone.locator('.mobile-nav [data-page="home"]').click();
    await phone.locator('.cinema-discovery').waitFor();
    await phone.locator('[data-cinema-entry="lab:light"]').click();
    await phone.locator('.react-lighting-lab h1').waitFor();
    await phone.locator('.mobile-nav [data-page="home"]').click();
    await phone.locator('[data-cinema-entry="roles:crafts"]').click();
    await phone.locator('#content .page-intro h1').waitFor();
    await phone.locator('.mobile-nav [data-page="home"]').click();
    await phone.locator('.cinema-discovery').waitFor();
    console.log('PASS: cinematic discovery shelves scroll, open lessons, Labs and Roles at '+width+'px');
    await photo(phone, 'v10-home-' + width + '.png');
    // Zero-photo Home MUST render no wall or reserved space. The top + still works.
    await phone.waitForFunction(()=>document.querySelector('.personal-frames')?.getAttribute('data-gallery-ready')==='true');
    assert.equal(await phone.locator('.personal-frames').isVisible(),false,
      'No image means zero-height, hidden gallery without placeholder');
    assert.equal(await phone.locator('.frames-empty,.frames-loading').count(),0,
      'No empty state or loading skeleton is rendered');
    assert.equal(await phone.locator('.frames-stage').count(),0);
    assert.equal(await phone.getByRole('button',{name:'Add your favourite cinema frames'}).count(),1);
    const homeType=await phone.locator('.home-greeting').evaluate(el=>getComputedStyle(el).fontFamily);
    assert(!/Georgia|Times New Roman/i.test(homeType),'Minimal cinematic font must not revert to oversized serif Home typography');
    const heroType=await phone.locator('.hero h1').evaluate(el=>getComputedStyle(el).fontFamily);
    assert(!/Georgia|Times New Roman/i.test(heroType),'Welcome title follows the same restrained type system');
    assert.ok((await phone.locator('.hero h1').boundingBox()).height<90,'Welcome headline compact enough for real mobile');
    const png=await phone.evaluate(()=>{
      const canvas=document.createElement('canvas');canvas.width=320;canvas.height=180;
      const ctx=canvas.getContext('2d');ctx.fillStyle='#aa683c';ctx.fillRect(0,0,320,180);
      return canvas.toDataURL('image/png').split(',')[1];
    });
    const testImage=Buffer.from(png,'base64');
    const photoPicker=phone.waitForEvent('filechooser');
    await phone.getByRole('button',{name:'Add your favourite cinema frames'}).click();
    const chosen=await photoPicker;
    await chosen.setFiles([
      {name:'original-frame-1.png',mimeType:'image/png',buffer:testImage},
      {name:'original-frame-2.png',mimeType:'image/png',buffer:testImage}
    ]);
    await phone.locator('.frames-stage[data-frame-count="2"]').waitFor({timeout:15000});
    assert.equal(await phone.locator('.personal-frames').isVisible(),true,
      'Chosen photos appear ABOVE Home welcome art');
    const stage=await phone.locator('.frames-stage').boundingBox();
    const welcome=await phone.locator('#content .hero').boundingBox();
    assert.ok(stage&&welcome&&stage.y+stage.height <= welcome.y+3,
      'Gallery participates in normal layout and pushes welcome/lesson cards down');
    if(width===390){
      const firstPhoto=await phone.locator('.frames-active').getAttribute('src');
      await phone.waitForFunction(original=>{
        const active=document.querySelector('.frames-active');
        return Boolean(active&&active.getAttribute('src')!==original);
      },firstPhoto,{timeout:10500});
      console.log('PASS: automatically advances personal slideshow without tapping at 390px');
    }
    assert.equal(await phone.locator('.frames-stage h1,.frames-stage h2,.frames-stage p,.frames-stage span').count(),0,
      'Slideshow must have no text overlay');
    await phone.locator('.frames-touch').click();
    await phone.getByRole('button',{name:'Frame options',exact:true}).click();
    await phone.getByRole('button',{name:'Edit image'}).click();
    await phone.getByRole('dialog',{name:'Edit selected frame'}).waitFor();
    await phone.getByRole('button',{name:'Top',exact:true}).click();
    // IndexedDB writes are async; observe the committed edit, not an
    // immediate intermediate React render while the control is busy.
    await phone.waitForFunction(()=>document.querySelector(
      '.frames-focus-controls button[aria-pressed="true"]')?.textContent?.trim()==='Top');
    // Autoplay may have moved us to the final photo while verifying progression.
    // Reorder in whichever direction is enabled; don't freeze the slide to test editing.
    const moveLater=phone.getByRole('button',{name:'Move later'});
    if(await moveLater.isEnabled())await moveLater.click();
    else await phone.getByRole('button',{name:'Move earlier'}).click();
    await phone.getByRole('button',{name:'Done',exact:true}).click();
    await phone.reload({waitUntil:'domcontentloaded'});
    await phone.waitForFunction(()=>Boolean(window.frameOneLegacy),{timeout:15000});
    await phone.locator('.frames-stage[data-frame-count="2"]').waitFor({timeout:15000});
    await photo(phone, 'v10-personal-gallery-'+width+'.png');
    await phone.locator('.frames-touch').click();
    await phone.getByRole('button',{name:'Frame options',exact:true}).click();
    phone.once('dialog',dialog=>void dialog.accept());
    await phone.getByRole('button',{name:'Remove image'}).click();
    await phone.locator('.frames-stage[data-frame-count="1"]').waitFor({timeout:15000});
    await phone.locator('.frames-touch').click();
    await phone.getByRole('button',{name:'Frame options',exact:true}).click();
    phone.once('dialog',dialog=>void dialog.accept());
    await phone.getByRole('button',{name:'Remove image'}).click();
    await phone.waitForFunction(()=>document.querySelector('.personal-frames')?.getAttribute('data-gallery-count')==='0');
    assert.equal(await phone.locator('.frames-stage').count(),0);
    assert.equal(await phone.locator('.personal-frames').isVisible(),false,
      'Removing the last photo collapses the wall again');
    assert.equal(await phone.getByRole('button',{name:'Add your favourite cinema frames'}).isVisible(),true);
    console.log('PASS: photo wall absent until chosen, appears above welcome, persists, and collapses after last removal at '+width+'px');

    await phone.locator('.mobile-nav [data-page="learn"]').click();
    await phone.locator('.react-learn-view h1').waitFor();
    const backControl=phone.getByRole('button',{name:'Back within Frame One'});
    await backControl.waitFor();
    const backBounds=await backControl.boundingBox();
    assert.ok(backBounds && backBounds.height >= 42 && backBounds.width >= 60,'Android-friendly Back touch target');
    await phone.locator('.react-lesson-card').first().click();
    await phone.locator('.react-lesson h1').waitFor();
    assert.equal(new URL(phone.url()).hash,'#lesson/why','lesson route has a browser history marker');
    await backControl.click();
    await phone.locator('.react-learn-view h1').waitFor();
    assert.equal(new URL(phone.url()).hash,'#learn','mobile Back returns to the chapter explorer');
    await backControl.click();
    await phone.locator('#content .page').waitFor();
    assert.equal(new URL(phone.url()).hash,'#home','mobile Back returns home without leaving Frame One');
    await phone.locator('.mobile-nav [data-page="learn"]').click();
    await phone.locator('.react-learn-view h1').waitFor();
    assert.equal(await phone.locator('.journey-chapter-segment').count(),6);
    assert.equal(await phone.locator('.journey-next-title').textContent(),curriculum.lessons[0].title);
    await phone.getByRole('button',{name:/View chapter 3:/}).click();
    await phone.locator('#reactChapter2').waitFor();
    assert.equal(await phone.getByRole('button',{name:/View chapter 3:/}).getAttribute('aria-pressed'),'true');
    assert.equal(await phone.locator('#chapterLessons2').getAttribute('class'),'chapter-body is-expanded');
    await phone.getByRole('button',{name:/View chapter 1:/}).click();
    assert.equal(await phone.getByRole('button',{name:/View chapter 1:/}).getAttribute('aria-pressed'),'true');
    assert.equal(await phone.locator('.chapter-mobile-toggle').count(), 6);
    assert.equal(await phone.locator('.chapter-body.is-expanded').count(), 1);
    assert.equal(await phone.locator('.chapter-mobile-toggle').first().getAttribute('aria-expanded'), 'true');
    await phone.locator('.chapter-mobile-toggle').nth(1).click();
    assert.equal(await phone.locator('.chapter-body.is-expanded').count(), 1);
    assert.equal(await phone.locator('.chapter-mobile-toggle').nth(1).getAttribute('aria-expanded'), 'true');
    await phone.locator('.chapter-mobile-toggle').first().click();
    assert.equal(await phone.locator('.chapter-body.is-expanded').count(), 1);
    assert.equal(await phone.locator('.chapter-mobile-toggle').first().getAttribute('aria-expanded'), 'true');
    const horizontal = await phone.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
    if (horizontal.scroll > horizontal.viewport + 3) record('Horizontal overflow at ' + width + 'px: ' + horizontal.scroll + ' vs ' + horizontal.viewport);
    await photo(phone, '05-chapters-' + width + 'px.png');
    await phone.locator('.mobile-nav [data-page="lab"]').click();
    await phone.locator('.lab-tabs').waitFor();
    const mobileFrame = phone.locator('.react-frame-lab');
    await mobileFrame.waitFor();
    await mobileFrame.locator('[data-frame="close"]').click();
    await mobileFrame.locator('[data-compare]').click();
    assert.equal(await mobileFrame.locator('.frame-comparison svg').count(), 2);
    const comparisonPlacement = await mobileFrame.locator('.frame-comparison > div').evaluateAll(elements => elements.map(el => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width };
    }));
    assert.equal(comparisonPlacement.length, 2);
    assert.ok(comparisonPlacement[1].y > comparisonPlacement[0].y + 20, 'Frame comparisons must stack vertically on narrow phones');
    assert.equal(await mobileFrame.locator('.frame-comparison .monitor-hud:visible').count(), 0, 'Compact comparison hides crowded illustration HUD');
    const framingOverflow = await phone.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
    if (framingOverflow.scroll > framingOverflow.viewport + 3) record('React Frame Lab overflow at ' + width + 'px: ' + framingOverflow.scroll + ' vs ' + framingOverflow.viewport);
    await photo(phone, '12-react-frame-' + width + 'px.png');
    await photo(phone, '06-lab-' + width + 'px.png');
    await phone.locator('.lab-tabs:visible [data-lab="continuity"]').click();
    const mobileContinuity = phone.locator('.react-continuity-lab');
    await mobileContinuity.waitFor();
    await mobileContinuity.locator('[data-continuity="changed"]').click();
    assert.equal(await mobileContinuity.locator('.continuity-cup.moved').count(), 1);
    const continuityOverflow = await phone.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
    if (continuityOverflow.scroll > continuityOverflow.viewport + 3) record('Continuity Lab overflow at ' + width + 'px: ' + continuityOverflow.scroll + ' vs ' + continuityOverflow.viewport);
    await photo(phone, '08-continuity-' + width + 'px.png');
    await mobileContinuity.locator('[data-lab="colour"]').click();
    const mobileColour = phone.locator('.react-colour-lab');
    await mobileColour.waitFor();
    await mobileColour.locator('[data-colour="cool"]').click();
    const mobileColourOverflow = await phone.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
    if (mobileColourOverflow.scroll > mobileColourOverflow.viewport + 3) record('React Colour Lab overflow at ' + width + 'px: ' + mobileColourOverflow.scroll + ' vs ' + mobileColourOverflow.viewport);
    await photo(phone, '10-react-colour-' + width + 'px.png');
    await mobileColour.locator('[data-lab="light"]').click();
    const mobileLighting = phone.locator('.react-lighting-lab');
    await mobileLighting.waitFor();
    await mobileLighting.locator('[data-light="side"]').click();
    const mobileSoft=mobileLighting.locator('#lightSoft');
    await mobileSoft.focus();await mobileSoft.press('End');
    assert.equal(await mobileLighting.locator('#lightSoftValue').textContent(),'100% soft');
    const lightOverflow=await phone.evaluate(() => ({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
    if(lightOverflow.scroll>lightOverflow.viewport+3)record('React Lighting Lab overflow at '+width+'px: '+lightOverflow.scroll+'/'+lightOverflow.viewport);
    await photo(phone,'14-react-lighting-'+width+'px.png');
    await mobileLighting.locator('[data-lab="cut"]').click();
    const mobileCut=phone.locator('.react-cut-lab');
    await mobileCut.waitFor();
    await mobileCut.locator('[data-move="0:right"]').click();
    assert.equal(await mobileCut.locator('.timeline-clip').count(),3);
    const cutOverflow=await phone.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
    if(cutOverflow.scroll>cutOverflow.viewport+3)record('React Cut Lab overflow at '+width+'px: '+cutOverflow.scroll+'/'+cutOverflow.viewport);
    await photo(phone,'16-react-cut-'+width+'px.png');
    await mobileCut.locator('[data-lab="story"]').click();
    const mobileMake=phone.locator('.react-make-lab');
    await mobileMake.waitFor();
    await mobileMake.locator('[data-story-question="decision"]').click();
    await mobileMake.locator('[data-story-step="1"]').click();
    await mobileMake.locator('#storyNote').fill('A clue in the rain.');
    const storyOverflow=await phone.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
    if(storyOverflow.scroll>storyOverflow.viewport+3)record('React Make Lab overflow at '+width+'px: '+storyOverflow.scroll+'/'+storyOverflow.viewport);
    await photo(phone,'18-react-make-'+width+'px.png');
    await mobileMake.locator('.lab-tabs [data-lab="sound"]').click();
    const mobileSound=phone.locator('.react-sound-lab');
    await mobileSound.waitFor();
    await mobileSound.locator('[data-sound="tension"]').click();
    assert.equal(await mobileSound.locator('.monitor-hud:visible,.frame-corner:visible,.scene-label:visible').count(),0,'Sound stage cannot show old Frame HUD on narrow phones');
    assert.equal(await mobileSound.locator('[data-sound="tension"]').getAttribute('aria-pressed'),'true');
    const soundOverflow=await phone.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
    if(soundOverflow.scroll>soundOverflow.viewport+3)record('React Sound Lab overflow at '+width+'px: '+soundOverflow.scroll+'/'+soundOverflow.viewport);
    await photo(phone,'20-react-sound-'+width+'px.png');
    console.log('PASS: mobile ' + width + 'px navigates all seven native React Labs (Sound overflow: ' + soundOverflow.scroll + '/' + soundOverflow.viewport + ')');
    await mobile.close();
  }
  if (failures.length) throw Error(failures.join('\n'));
}
verify().then(() => { console.log('FRAME ONE BROWSER SMOKE: PASS'); }).catch(error => {
  console.error('FRAME ONE BROWSER SMOKE: FAIL\n' + (error.stack || error));
  process.exitCode = 1;
}).finally(async () => {
  try { if (browser) await browser.close(); } catch {}
  server.kill('SIGTERM');
});