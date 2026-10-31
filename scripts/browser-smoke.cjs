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
async function openHomeWorkshops(page) {
  const section=page.locator('[data-cinema-workshop-details]');
  await section.waitFor();
  if(await section.getAttribute('open')===null) await section.locator('summary').click();
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
  // v0.13A16: calm, catalogue-first Home with no debug/backup callout.
  assert.equal(await page.locator('.cinema-backup-shortcut').count(),0);
  assert.equal(await page.getByText('YOUR WORK STAYS ON THIS DEVICE').count(),0);
  assert.equal(await page.locator('[data-cinema-shelf]').count(),6);
  const studioDetails=page.locator('[data-cinema-workshop-details]');
  assert.equal(await studioDetails.count(),1);
  assert.equal(await studioDetails.getAttribute('open'),null,
    'Long interactive studios must not interrupt Netflix-style shelves');
  assert.equal(await page.locator('[data-scene-anatomy]').isVisible(),false,
    'Scene Anatomy is reachable on demand below the shelves');
  const homeOrder=await page.locator('.cinema-discovery').evaluate(node=>{
    const rails=node.querySelector('[data-cinema-shelves-first]');
    const studio=node.querySelector('[data-cinema-workshop-zone]');
    return !!(rails&&studio&&(rails.compareDocumentPosition(studio)&Node.DOCUMENT_POSITION_FOLLOWING));
  });
  assert.ok(homeOrder,'Poster shelves must precede the workshop section in document order');
  await photo(page,'01-home-catalog-first-desktop.png');
  // v0.13A7: offline camera-free practice guidance; only the user can film.
  const practice=page.locator('[data-film-it-yourself]');
  assert.equal(await practice.count(),1);
  assert.equal(await practice.locator('[data-practice-toggle]').getAttribute('aria-expanded'),'false');
  assert.equal(await practice.locator('[data-practice-step]').count(),0,
    'Practical studio stays compact until deliberately opened');
  await practice.locator('[data-practice-toggle]').click();
  assert.equal(await practice.locator('[data-practice-step]').count(),3);
  assert.equal(await practice.locator('[data-practice-choice]').count(),4);
  assert.equal(await practice.locator('[data-practice-plan]').getAttribute('data-practice-plan'),'three-shots');
  await practice.locator('[data-practice-check="0"]').click();
  assert.equal(await practice.locator('[data-practice-check="0"]').getAttribute('aria-pressed'),'true');
  assert.match(await practice.locator('[data-practice-status]').textContent(),/1 of 3/);
  await practice.locator('[data-practice-choice="light"]').click();
  assert.equal(await practice.locator('[data-practice-plan]').getAttribute('data-practice-plan'),'light');
  assert.equal(await practice.locator('[data-practice-check="0"]').getAttribute('aria-pressed'),'false',
    'Choosing another practice resets only session checkmarks');
  assert.match(await practice.locator('[data-practice-status]').textContent(),/0 of 3/);
  await practice.locator('[data-practice-check="0"]').click();
  await practice.locator('[data-practice-check="1"]').click();
  await practice.locator('[data-practice-check="2"]').click();
  assert.match(await practice.locator('[data-practice-status]').textContent(),/All three steps marked tried in this session/);
  // v0.13A10: portable filming guide and an honest clipboard/manual-copy fallback.
  assert.equal(await practice.locator('[data-practice-pocket-toggle]').getAttribute('aria-expanded'),'false');
  await practice.locator('[data-practice-pocket-toggle]').click();
  assert.equal(await practice.locator('[data-practice-pocket-toggle]').getAttribute('aria-expanded'),'true');
  const pocket=practice.locator('[data-practice-pocket]');
  assert.equal(await pocket.locator('[data-practice-plan-text]').count(),1);
  const defaultPlan=await pocket.locator('[data-practice-plan-text]').inputValue();
  assert(defaultPlan.includes('One subject. Two moods.')&&defaultPlan.includes('SHOT / STEP 03'));
  await pocket.locator('[data-practice-observation]').fill('Changing the light made the edges clearer.');
  const writtenPlan=await pocket.locator('[data-practice-plan-text]').inputValue();
  assert(writtenPlan.includes('Changing the light made the edges clearer.'));
  await pocket.locator('[data-practice-pocket-copy]').click();
  await pocket.locator('[data-practice-pocket-status]').filter({hasText:/Plan copied|Automatic copying is unavailable/}).waitFor({timeout:8000});
  assert.match(await pocket.locator('[data-practice-pocket-status]').textContent(),
    /Plan copied|Automatic copying is unavailable/);
  assert.equal(await pocket.locator('[data-practice-plan-text]').inputValue(),writtenPlan,
    "Copying should never clear or alter the user\'s exercise note");
  await practice.locator('[data-practice-choice="silence"]').click();
  await practice.locator('[data-practice-pocket-toggle]').click();
  const switchedPlan=await pocket.locator('[data-practice-plan-text]').inputValue();
  assert(switchedPlan.includes('Tell it without dialogue.'));
  assert(!switchedPlan.includes('Changing the light made the edges clearer.'),
    'Notes from one exercise must not leak into the next');
  await practice.locator('[data-practice-pocket-toggle]').click();
  await practice.locator('[data-practice-choice="light"]').click();
  await practice.screenshot({path:path.join(shots,'01-film-it-yourself-desktop.png'),animations:'disabled'});
  await practice.locator('[data-practice-open-lab="light"]').click();
  await page.locator('.react-lighting-lab').waitFor();
  await page.locator('.nav-menu [data-page="home"]').click();
  await page.locator('[data-film-it-yourself]').waitFor();
  assert.equal(await page.locator('[data-practice-toggle]').getAttribute('aria-expanded'),'false',
    'Progress remains ephemeral; revisiting Home does not fabricate saved shoots');
  console.log('PASS: real film practice opens, tracks session-only steps, resets correctly and links to Lighting Lab');
  // v0.13A8: real offline quick-find with keyboard and working lesson/lab destinations.
  const quick=page.locator('[data-cinema-quick-find]');
  assert.equal(await quick.count(),1);
  const searchInput=quick.locator('[data-cinema-search-input]');
  assert.equal(await quick.locator('[data-cinema-search-result]').count(),0,
    'A blank search must not fill Home with extra cards');
  await searchInput.fill('lighting');
  assert.equal(await quick.locator('[data-cinema-search-result]').first().getAttribute('data-cinema-search-result'),'lesson:lighting',
    'Exact lesson title must rank before broader matches');
  await searchInput.press('Enter');
  await page.locator('.react-lesson h1').waitFor();
  assert.match(await page.locator('.react-lesson h1').textContent(),/lighting/i);
  // v0.13A17: a quiet three-step path, not another oversized lesson card.
  const compass=page.locator('[data-lesson-compass]');
  assert.equal(await compass.count(),1);
  for(const step of ['explore','decide','check']){
    assert.equal(await compass.locator('[data-lesson-jump="'+step+'"]').count(),1);
    assert.equal(await page.locator('[data-lesson-stage="'+step+'"]').count(),1);
    await compass.locator('[data-lesson-jump="'+step+'"]').click();
    const focused=await page.evaluate(()=>document.activeElement?.id);
    assert.equal(focused,'lesson-stage-'+step,'Lesson guide must focus the real '+step+' stage');
  }
  const lessonForCompass=curriculum.lessons.find(item=>item.id==='lighting');
  assert(lessonForCompass,'The tested lighting lesson must exist');
  const wrongAnswer=(lessonForCompass.answer+1)%lessonForCompass.opts.length;
  const quizForCompass=page.locator('[data-lesson-stage="check"]');
  await quizForCompass.locator('.quiz-options button').nth(wrongAnswer).click();
  assert.equal(await quizForCompass.locator('[data-lesson-revisit]').count(),1,
    'Wrong answer reveals a helpful review action, not a fake completion');
  assert.equal(await quizForCompass.locator('.lesson-actions .cta').isDisabled(),true);
  await quizForCompass.locator('[data-lesson-revisit]').click();
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'lesson-stage-explore',
    'Visual review must return to the actual scene');
  await quizForCompass.getByRole('button',{name:'Try again'}).click();
  assert.equal(await quizForCompass.locator('[data-lesson-revisit]').count(),0);
  assert.equal(await quizForCompass.locator('.lesson-actions .cta').isDisabled(),true);
  console.log('PASS: lesson compass reaches actual Explore/Decide/Check sections, wrong answer reviews scene without marking complete');

  // v0.13A11: the lesson begins with a real illustration, not an article.
  const lightingPilot=page.locator('[data-visual-lesson="lighting"]');
  assert.equal(await lightingPilot.count(),1);
  assert.equal(await lightingPilot.locator('[data-visual-take]').getAttribute('data-visual-take'),'0');
  assert.equal(await lightingPilot.locator('[data-visual-option="a"]').getAttribute('aria-pressed'),'true');
  const firstLight=await lightingPilot.locator('.vl-illustration').innerHTML();
  await lightingPilot.locator('[data-visual-option="b"]').click();
  assert.equal(await lightingPilot.locator('[data-visual-take]').getAttribute('data-visual-take'),'1');
  const sideLight=await lightingPilot.locator('.vl-illustration').innerHTML();
  assert.notEqual(firstLight,sideLight,'The light study must visually relight the same illustrated cup');
  await lightingPilot.locator('[data-visual-reveal]').click();
  assert.equal(await lightingPilot.locator('[data-visual-reveal]').getAttribute('aria-expanded'),'true');
  assert.match(await lightingPilot.locator('.vl-explanation').textContent(),/Light controls/);
  assert.equal(await page.locator('[data-visual-deeper]').getAttribute('open'),null,
    'Long lesson paragraphs must start collapsed for the visual-first pilot');
  await page.locator('[data-visual-deeper] summary').click();
  assert.equal(await page.locator('[data-visual-deeper]').getAttribute('open'),'',
    'Full original curriculum text remains accessible on request');
  assert.equal(await page.locator('.react-lesson .quiz').count(),1);
  await lightingPilot.screenshot({path:path.join(shots,'02-visual-lesson-lighting-desktop.png'),animations:'disabled'});
  await page.locator('.nav-menu [data-page="home"]').click();
  await page.locator('[data-cinema-quick-find]').waitFor();
  await quick.locator('[data-cinema-search-input]').fill('silence');
  assert.ok(await quick.locator('[data-cinema-search-result="lesson:ambience"]').count()===1,
    'Natural language alias must find a real sound-related lesson');
  await quick.locator('[data-cinema-search-input]').fill('film roles');
  assert.equal(await quick.locator('[data-cinema-search-result]').first().getAttribute('data-cinema-search-result'),
    'roles:crafts','Film roles should be searchable as a real destination');
  await quick.locator('[data-cinema-search-clear]').click();
  assert.equal(await quick.locator('[data-cinema-search-result]').count(),0);
  await quick.locator('[data-cinema-search-input]').fill('xyzunlikelynoresults');
  assert.match(await quick.locator('[data-cinema-search-status]').textContent(),/No matches/);
  await quick.locator('[data-cinema-search-input]').press('Escape');
  assert.equal(await quick.locator('[data-cinema-search-input]').inputValue(),'');
  await quick.locator('[data-cinema-search-input]').fill('shape the light');
  assert.equal(await quick.locator('[data-cinema-search-result]').first().getAttribute('data-cinema-search-result'),'lab:light');
  await quick.locator('[data-cinema-search-result="lab:light"]').click();
  await page.locator('.react-lighting-lab').waitFor();
  await page.locator('.nav-menu [data-page="home"]').click();
  await page.locator('[data-cinema-quick-find]').waitFor();
  assert.equal(await quick.locator('[data-cinema-search-input]').inputValue(),'',
    'Search remains ephemeral when leaving/re-entering Home');
  console.log('PASS: offline Home search finds real lessons, audio aliases and working Labs; Enter, clear, Escape and reset work');

  // Every pilot has one visually distinct comparison, an honest note and real lab route.
  await quick.locator('[data-cinema-search-input]').fill('editing rhythm');
  await quick.locator('[data-cinema-search-result="lesson:rhythm"]').click();
  const rhythmPilot=page.locator('[data-visual-lesson="rhythm"]');
  await rhythmPilot.waitFor();
  const uncutPlan=await rhythmPilot.locator('.vl-illustration').innerHTML();
  await rhythmPilot.locator('[data-visual-option="b"]').click();
  assert.notEqual(await rhythmPilot.locator('.vl-illustration').innerHTML(),uncutPlan);
  assert.match(await rhythmPilot.locator('[data-visual-description]').textContent(),/two-second shots/i);
  await rhythmPilot.screenshot({path:path.join(shots,'02-visual-lesson-rhythm-desktop.png'),animations:'disabled'});
  await page.locator('.nav-menu [data-page="home"]').click();
  await page.locator('[data-cinema-quick-find]').waitFor();
  await quick.locator('[data-cinema-search-input]').fill('ambience');
  await quick.locator('[data-cinema-search-result="lesson:ambience"]').click();
  const ambiencePilot=page.locator('[data-visual-lesson="ambience"]');
  await ambiencePilot.waitFor();
  const lockedImage=await ambiencePilot.locator('.vl-illustration').innerHTML();
  await ambiencePilot.locator('[data-visual-option="b"]').click();
  assert.equal(await ambiencePilot.locator('.vl-illustration').innerHTML(),lockedImage,
    'Sound study must keep the picture exactly unchanged');
  assert.match(await ambiencePilot.locator('[data-visual-sound-layers]').textContent(),/road traffic/i);
  assert.match(await ambiencePilot.textContent(),/not audio playback/i);
  await ambiencePilot.screenshot({path:path.join(shots,'02-visual-lesson-ambience-desktop.png'),animations:'disabled'});
  await page.locator('.nav-menu [data-page="home"]').click();
  await page.locator('[data-cinema-quick-find]').waitFor();
  // v0.13A12: three more true illustrated A/B studies; legacy quiz/note state stays intact.
  for(const study of [
    {word:'shot',id:'shot',lab:'frame',tag:'shot'},
    {word:'composition',id:'composition',lab:'frame',tag:'composition'},
    {word:'colour',id:'colour',lab:'colour',tag:'colour'}
  ]){
    await quick.locator('[data-cinema-search-input]').fill(study.word);
    await quick.locator('[data-cinema-search-result="lesson:'+study.id+'"]').click();
    const visual=page.locator('[data-visual-lesson="'+study.id+'"]');
    await visual.waitFor();
    const firstArt=await visual.locator('.vl-illustration').innerHTML();
    assert.equal(await visual.locator('[data-visual-option="a"]').getAttribute('aria-pressed'),'true');
    assert.equal(await visual.locator('[data-visual-take]').getAttribute('data-visual-take'),'0');
    await visual.locator('[data-visual-option="b"]').click();
    const secondArt=await visual.locator('.vl-illustration').innerHTML();
    assert.notEqual(firstArt,secondArt,study.id+' must change SVG artwork, not just its explanation');
    assert.equal(await visual.locator('[data-visual-take]').getAttribute('data-visual-take'),'1');
    assert.equal(await visual.locator('[data-visual-option="b"]').getAttribute('aria-pressed'),'true');
    assert.equal(await visual.locator('[data-visual-lab="'+study.lab+'"]').count(),1);
    await visual.locator('[data-visual-reveal]').click();
    assert.equal(await visual.locator('[data-visual-reveal]').getAttribute('aria-expanded'),'true');
    assert.equal(await page.locator('[data-visual-deeper]').getAttribute('open'),null);
    assert.equal(await page.locator('.react-lesson .quiz').count(),1,
      'Original lesson comprehension quiz must be present after redesign');
    assert.equal(await page.locator('#lessonPractice').count(),1,'Existing saved note editor must remain');
    await visual.screenshot({path:path.join(shots,'02-visual-lesson-'+study.id+'-desktop.png'),animations:'disabled'});
    await page.locator('.nav-menu [data-page="home"]').click();
    await page.locator('[data-cinema-quick-find]').waitFor();
  }
  console.log('PASS: new shot size, composition and colour lessons visibly change original SVGs while preserving original notes and quiz');

  // v0.13A13: reveal actual sequential frames, preserve reading, note and quiz.
  for(const id of ['units','showdonttell','continuity']){
    await quick.locator('[data-cinema-search-input]').fill(id);
    await quick.locator('[data-cinema-search-result="lesson:'+id+'"]').click();
    const sequence=page.locator('[data-scene-sequence="'+id+'"]');
    await sequence.waitFor();
    assert.equal(await sequence.locator('[data-sequence-stage]').getAttribute('data-sequence-stage'),'0');
    assert.equal(await sequence.locator('[data-sequence-finale]').count(),0,
      'Ending and optional explanation must not appear before final beat');
    const artwork=[await sequence.locator('.sq-art').innerHTML()];
    await sequence.locator('[data-sequence-next]').click();
    assert.equal(await sequence.locator('[data-sequence-stage]').getAttribute('data-sequence-stage'),'1');
    artwork.push(await sequence.locator('.sq-art').innerHTML());
    await sequence.locator('[data-sequence-next]').click();
    assert.equal(await sequence.locator('[data-sequence-stage]').getAttribute('data-sequence-stage'),'2');
    artwork.push(await sequence.locator('.sq-art').innerHTML());
    assert.equal(new Set(artwork).size,3,id+' must present three genuinely different story frames');
    assert.equal(await sequence.locator('[data-sequence-discover]').getAttribute('aria-expanded'),'false');
    await sequence.locator('[data-sequence-discover]').click();
    assert.equal(await sequence.locator('[data-sequence-discover]').getAttribute('aria-expanded'),'true');
    assert.ok((await sequence.locator('.sq-reveal').textContent()).length>85);
    assert.equal(await page.locator('[data-sequence-deeper]').getAttribute('open'),null,
      'Original long-form lesson text starts collapsed');
    await page.locator('[data-sequence-deeper] summary').click();
    assert.equal(await page.locator('[data-sequence-deeper]').getAttribute('open'),'');
    assert.equal(await page.locator('.react-lesson .quiz').count(),1);
    assert.equal(await page.locator('#lessonPractice').count(),1);
    await sequence.screenshot({path:path.join(shots,'02-scene-sequence-'+id+'-desktop.png'),animations:'disabled'});
    await sequence.locator('[data-sequence-beat="0"]').click();
    assert.equal(await sequence.locator('[data-sequence-finale]').count(),0,
      'Going to the first beat clears the ending and its explanation');
    await page.locator('.nav-menu [data-page="home"]').click();
    await page.locator('[data-cinema-quick-find]').waitFor();
  }
  console.log('PASS: three interactive scenes tell accurate 3-frame stories, reveal ideas only after the ending and keep old quiz/notes');
  // v0.13A14: ten authored director's-choice investigations, not text-only cards.
  const newVisualIds=['story','script','acting','character','dialogue',
    'camera','movement','lenses','music','editing'];
  for(const id of newVisualIds){
    await quick.locator('[data-cinema-search-input]').fill(id);
    await quick.locator('[data-cinema-search-result="lesson:'+id+'"]').click();
    const visual=page.locator('[data-visual-lesson="'+id+'"]');
    await visual.waitFor();
    const firstArt=await visual.locator('.vl-illustration').innerHTML();
    assert.equal(await visual.locator('[data-visual-option="a"]').getAttribute('aria-pressed'),'true');
    assert.equal(await visual.locator('[data-visual-deeper]').count(),0,
      'The visual explanation must be in the normal optional deeper lesson');
    await visual.locator('[data-visual-option="b"]').click();
    assert.equal(await visual.locator('[data-visual-take]').getAttribute('data-visual-take'),'1');
    const secondArt=await visual.locator('.vl-illustration').innerHTML();
    if(id==='music'){
      assert.equal(secondArt,firstArt,'Music study must lock picture when only imagined score changes');
      assert.match(await visual.locator('[data-visual-sound-layers]').textContent(),/uneven low pulses/i);
      assert.match(await visual.textContent(),/NOT playable music/i);
    }else{
      assert.notEqual(secondArt,firstArt,id+' must visibly change the original drawing, not just the label');
    }
    await visual.locator('[data-visual-reveal]').click();
    assert.equal(await visual.locator('[data-visual-reveal]').getAttribute('aria-expanded'),'true');
    assert.equal(await page.locator('[data-visual-deeper]').getAttribute('open'),null);
    assert.equal(await page.locator('.react-lesson .quiz').count(),1);
    assert.equal(await page.locator('#lessonPractice').count(),1);
    await visual.screenshot({path:path.join(shots,'02-director-choice-'+id+'-desktop.png'),animations:'disabled'});
    await page.locator('.nav-menu [data-page="home"]').click();
    await page.locator('[data-cinema-quick-find]').waitFor();
  }
  console.log('PASS: all 10 authored director choices render real A/B artwork, truthful imaginary music and untouched quizzes/notes');

  // v0.13A15: all fourteen remaining real lessons teach through original 3-stage diagrams.
  const finalVisualIds=['why','history','genres','india','sound','crew','craft24',
    'teams','pipeline','making','shotlist','shootscene','editminute','review'];
  for(const id of finalVisualIds){
    await quick.locator('[data-cinema-search-input]').fill(id);
    await quick.locator('[data-cinema-search-result="lesson:'+id+'"]').click();
    const guide=page.locator('[data-visual-field="'+id+'"]');
    await guide.waitFor();
    assert.equal(await guide.locator('[data-field-step]').getAttribute('data-field-step'),'0');
    assert.equal(await guide.locator('[data-field-discovery]').count(),0,
      'A learner has to reveal the visual sequence before reading the ending');
    const images=[await guide.locator('.fg-art').innerHTML()];
    await guide.locator('[data-field-next]').click();
    assert.equal(await guide.locator('[data-field-step]').getAttribute('data-field-step'),'1');
    images.push(await guide.locator('.fg-art').innerHTML());
    await guide.locator('[data-field-next]').click();
    assert.equal(await guide.locator('[data-field-step]').getAttribute('data-field-step'),'2');
    images.push(await guide.locator('.fg-art').innerHTML());
    assert.equal(new Set(images).size,3,id+' has three actual different illustrations');
    assert.equal(await guide.locator('[data-field-explain]').getAttribute('aria-expanded'),'false');
    await guide.locator('[data-field-explain]').click();
    assert.equal(await guide.locator('[data-field-explain]').getAttribute('aria-expanded'),'true');
    assert.ok((await guide.locator('.fg-insight').textContent()).length>115,
      'Filmmaking rationale for '+id+' is accessible only on demand');
    assert.equal(await page.locator('[data-field-deeper]').getAttribute('open'),null);
    await page.locator('[data-field-deeper] summary').click();
    assert.equal(await page.locator('[data-field-deeper]').getAttribute('open'),'');
    assert.equal(await page.locator('.react-lesson .quiz').count(),1);
    assert.equal(await page.locator('#lessonPractice').count(),1);
    await guide.screenshot({path:path.join(shots,'02-field-guide-'+id+'-desktop.png'),animations:'disabled'});
    await guide.locator('[data-field-choice="0"]').click();
    assert.equal(await guide.locator('[data-field-discovery]').count(),0,
      'Returning to first stage closes previous lesson insight');
    await page.locator('.nav-menu [data-page="home"]').click();
    await page.locator('[data-cinema-quick-find]').waitFor();
  }
  console.log('PASS: all 14 remaining lessons have three illustrated stages, optional discovery and preserved quiz/notes');

  // v0.13A9: contextual lesson → the correct practical phone exercise.
  await quick.locator('[data-cinema-search-input]').fill('lighting');
  await quick.locator('[data-cinema-search-result="lesson:lighting"]').click();
  await page.locator('.react-lesson h1').waitFor();
  const fromLesson=page.locator('[data-lesson-practice="light"]');
  assert.equal(await fromLesson.count(),1,'A lighting lesson offers a practical light exercise');
  await fromLesson.click();
  await page.locator('[data-film-it-yourself]').waitFor();
  assert.equal(await practice.locator('[data-practice-toggle]').getAttribute('aria-expanded'),'true',
    'Lesson handoff should open the real exercise automatically');
  assert.equal(await practice.locator('[data-practice-plan]').getAttribute('data-practice-plan'),'light',
    'Lesson handoff must select the matched exercise');
  assert.match(await practice.locator('[data-practice-arrival]').textContent(),/From your lesson/);
  assert.equal(await practice.locator('[data-practice-check="0"]').getAttribute('aria-pressed'),'false',
    'Lesson navigation never fabricates completed shooting work');
  await page.waitForFunction(()=>document.activeElement?.id==='practice-studio-title');
  await page.locator('.nav-menu [data-page="learn"]').click();
  await page.locator('.react-learn-view').waitFor();
  await page.locator('.nav-menu [data-page="home"]').click();
  await page.locator('[data-film-it-yourself]').waitFor();
  assert.equal(await practice.locator('[data-practice-toggle]').getAttribute('aria-expanded'),'false',
    'One-shot lesson handoff must not reopen practice on unrelated Home visits');
  assert.equal(await practice.locator('[data-practice-arrival]').count(),0);
  console.log('PASS: lesson handoff selects/focuses real filming exercise, keeps checkmarks empty and resets on next visit');

  // v0.13: real, illustrated director's-choice comparisons on Home.
  await openHomeWorkshops(page);
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
  await openHomeWorkshops(page);
  await page.locator('[data-scene-anatomy]').waitFor();
  console.log('PASS: scene anatomy real A/B decisions, lighting relight, edit reveal and functional Cut Lab route');
  await photo(page, '01-home-desktop.png');

  // v0.13A2: real combined directing workshop, not a decorative mockup.
  await openHomeWorkshops(page);
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
  await openHomeWorkshops(page);
  await page.locator('[data-direct-moment]').waitFor();
  await openHomeWorkshops(page);
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
  await openHomeWorkshops(page);
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
  // v0.13A18: read-only inspection accepts the real exported backup without writing anything.
  const notesBeforeInspect=await page.evaluate(()=>localStorage.getItem('frameone-practice-v07'));
  await backup.locator('#backupPasteText').fill(copyPayload);
  await backup.locator('[data-inspect-backup-text]').click();
  const inspection=backup.locator('[data-backup-inspection]');
  await inspection.getByText(/Checked pasted backup:/).waitFor();
  assert.match(await inspection.textContent(),/completed lessons, .* saved lesson notes and 3 storyboard shots/);
  assert.ok(!(await inspection.textContent()).includes(newNote),
    'Preview must never print private story or practice-note contents');
  assert.equal(await page.evaluate(()=>localStorage.getItem('frameone-practice-v07')),notesBeforeInspect,
    'Previewing a pasted backup must not change existing notes');
  const inspectFileInput=backup.locator('input[aria-label="Choose a Frame One backup to check without restoring"]');
  await inspectFileInput.setInputFiles({name:'frame-one-learning-backup.json',
    mimeType:'application/json',buffer:Buffer.from(copyPayload)});
  await inspection.getByText(/Checked: .* storyboard shots/).waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('frameone-practice-v07')),notesBeforeInspect,
    'Inspecting a backup file must not alter live learner state');
  await inspectFileInput.setInputFiles({name:'invalid.json',mimeType:'application/json',
    buffer:Buffer.from('{"format":"bad"}')});
  await inspection.getByText(/Backup check failed:/).waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('frameone-practice-v07')),notesBeforeInspect,
    'Invalid inspection must not alter saved work');
  await backup.locator('[data-inspect-backup-text]').click();
  await inspection.getByText(/Checked pasted backup:/).waitFor();
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
    const mobileSearch=phone.locator('[data-cinema-quick-find]');
    await mobileSearch.locator('[data-cinema-search-input]').fill('camera');
    assert.ok(await mobileSearch.locator('[data-cinema-search-result]').count()>0,
      'Offline search returns real camera lessons on a phone');
    const searchBounds=await mobileSearch.boundingBox();
    const searchOverflow=await mobileSearch.evaluate(el=>({scroll:el.scrollWidth,width:el.clientWidth}));
    assert.ok(searchBounds&&searchBounds.width<=width+2,'Search must fit '+width+'px');
    assert.ok(searchOverflow.scroll<=searchOverflow.width+3,
      'Search results must not overflow a '+width+'px phone');
    await mobileSearch.screenshot({path:path.join(shots,'01-cinema-search-'+width+'px.png'),animations:'disabled'});
    await mobileSearch.locator('[data-cinema-search-input]').press('Escape');
    assert.equal(await mobileSearch.locator('[data-cinema-search-result]').count(),0);

    // v0.13A11 real mobile pilot: wide artwork fits the actual small phone screen.
    await mobileSearch.locator('[data-cinema-search-input]').fill('lighting');
    await mobileSearch.locator('[data-cinema-search-result="lesson:lighting"]').click();
    const mobileVisual=phone.locator('[data-visual-lesson="lighting"]');
    await mobileVisual.waitFor();
    await mobileVisual.locator('[data-visual-option="b"]').click();
    await mobileVisual.locator('[data-visual-reveal]').click();
    const visualBounds=await mobileVisual.boundingBox();
    const visualOverflow=await mobileVisual.evaluate(el=>({scroll:el.scrollWidth,width:el.clientWidth}));
    assert.ok(visualBounds&&visualBounds.width<=width+2,'Visual lesson fits '+width+'px mobile viewport');
    assert.ok(visualOverflow.scroll<=visualOverflow.width+3,'Visual lesson must not clip horizontally at '+width+'px');
    await mobileVisual.screenshot({path:path.join(shots,'02-visual-lesson-lighting-'+width+'px.png'),animations:'disabled'});
    await phone.locator('.mobile-nav [data-page="home"]').click();
    await phone.locator('[data-cinema-quick-find]').waitFor();

    // v0.13A12: each new SVG comparison must fit tiny screens with controls.
    for(const study of ['shot','composition','colour']){
      await mobileSearch.locator('[data-cinema-search-input]').fill(study);
      await mobileSearch.locator('[data-cinema-search-result="lesson:'+study+'"]').click();
      const stage=phone.locator('[data-visual-lesson="'+study+'"]');
      await stage.waitFor();
      await stage.locator('[data-visual-option="b"]').click();
      const fit=await stage.evaluate(el=>({scroll:el.scrollWidth,width:el.clientWidth}));
      assert.ok(fit.scroll<=fit.width+3,study+' visual experience must fit '+width+'px');
      await stage.screenshot({path:path.join(shots,'02-visual-lesson-'+study+'-'+width+'px.png'),animations:'disabled'});
      await phone.locator('.mobile-nav [data-page="home"]').click();
      await phone.locator('[data-cinema-quick-find]').waitFor();
    }

    // v0.13A13 progressive shot reveal: real mobile browser checks at both widths.
    for(const id of ['units','showdonttell','continuity']){
      await mobileSearch.locator('[data-cinema-search-input]').fill(id);
      await mobileSearch.locator('[data-cinema-search-result="lesson:'+id+'"]').click();
      const sequence=phone.locator('[data-scene-sequence="'+id+'"]');
      await sequence.waitFor();
      await sequence.locator('[data-sequence-beat="2"]').click();
      assert.equal(await sequence.locator('[data-sequence-stage]').getAttribute('data-sequence-stage'),'2');
      await sequence.locator('[data-sequence-discover]').click();
      const fit=await sequence.evaluate(el=>({scroll:el.scrollWidth,width:el.clientWidth}));
      assert.ok(fit.scroll<=fit.width+3,id+' scene must not overflow '+width+'px phone');
      const frame=await sequence.boundingBox();
      assert.ok(frame&&frame.width<=width+2,id+' stage must fit '+width+'px phone');
      await sequence.screenshot({path:path.join(shots,'02-scene-sequence-'+id+'-'+width+'px.png'),animations:'disabled'});
      await phone.locator('.mobile-nav [data-page="home"]').click();
      await phone.locator('[data-cinema-quick-find]').waitFor();
    }

    // v0.13A14: all ten new choices receive phone QA, split evenly across 390/320px.
    const choicesOnThisPhone=width===390?['story','script','acting','character','dialogue']:
      ['camera','movement','lenses','music','editing'];
    for(const id of choicesOnThisPhone){
      await mobileSearch.locator('[data-cinema-search-input]').fill(id);
      await mobileSearch.locator('[data-cinema-search-result="lesson:'+id+'"]').click();
      const stage=phone.locator('[data-visual-lesson="'+id+'"]');
      await stage.waitFor();
      await stage.locator('[data-visual-option="b"]').click();
      const fit=await stage.evaluate(el=>({scroll:el.scrollWidth,width:el.clientWidth}));
      assert.ok(fit.scroll<=fit.width+3,'Director choice '+id+' must not overflow '+width+'px');
      const bounds=await stage.boundingBox();
      assert.ok(bounds&&bounds.width<=width+2,id+' must fit phone viewport');
      await stage.screenshot({path:path.join(shots,'02-director-choice-'+id+'-'+width+'px.png'),animations:'disabled'});
      await phone.locator('.mobile-nav [data-page="home"]').click();
      await phone.locator('[data-cinema-quick-find]').waitFor();
    }

    // v0.13A17: actual compact lesson navigation works at both 320px and 390px.
    await mobileSearch.locator('[data-cinema-search-input]').fill('lighting');
    await mobileSearch.locator('[data-cinema-search-result="lesson:lighting"]').click();
    const mobileCompass=phone.locator('[data-lesson-compass]');
    await mobileCompass.waitFor();
    const compact=await mobileCompass.evaluate(el=>({scroll:el.scrollWidth,width:el.clientWidth}));
    assert.ok(compact.scroll<=compact.width+3,'Lesson path does not overflow '+width+'px');
    await mobileCompass.locator('[data-lesson-jump="check"]').click();
    assert.equal(await phone.evaluate(()=>document.activeElement?.id),'lesson-stage-check');
    await mobileCompass.locator('[data-lesson-jump="explore"]').click();
    assert.equal(await phone.evaluate(()=>document.activeElement?.id),'lesson-stage-explore');
    await mobileCompass.screenshot({path:path.join(shots,'02-lesson-compass-'+width+'px.png'),animations:'disabled'});
    await phone.locator('.mobile-nav [data-page="home"]').click();
    await phone.locator('[data-cinema-quick-find]').waitFor();

    // v0.13A15: all 14 original field guide illustrations are checked across phone sizes.
    const fieldOnPhone=width===390?['why','history','genres','india','sound','crew','craft24']:
      ['teams','pipeline','making','shotlist','shootscene','editminute','review'];
    for(const id of fieldOnPhone){
      await mobileSearch.locator('[data-cinema-search-input]').fill(id);
      await mobileSearch.locator('[data-cinema-search-result="lesson:'+id+'"]').click();
      const guide=phone.locator('[data-visual-field="'+id+'"]');
      await guide.waitFor();
      await guide.locator('[data-field-choice="2"]').click();
      await guide.locator('[data-field-explain]').click();
      const box=await guide.boundingBox();
      const fit=await guide.evaluate(el=>({scroll:el.scrollWidth,width:el.clientWidth}));
      assert.ok(box&&box.width<=width+2,id+' field guide must fit '+width+'px phone');
      assert.ok(fit.scroll<=fit.width+3,id+' must have no horizontal scroll at '+width+'px');
      await guide.screenshot({path:path.join(shots,'02-field-guide-'+id+'-'+width+'px.png'),animations:'disabled'});
      await phone.locator('.mobile-nav [data-page="home"]').click();
      await phone.locator('[data-cinema-quick-find]').waitFor();
    }

    // Narrow-screen lesson handoff must open the matching exercise, not a generic Home card.
    await mobileSearch.locator('[data-cinema-search-input]').fill('rhythm');
    await mobileSearch.locator('[data-cinema-search-result="lesson:rhythm"]').click();
    await phone.locator('.react-lesson h1').waitFor();
    await phone.locator('[data-lesson-practice="rhythm"]').click();
    const mobileHandoff=phone.locator('[data-film-it-yourself]');
    await mobileHandoff.locator('[data-practice-plan="rhythm"]').waitFor();
    assert.equal(await mobileHandoff.locator('[data-practice-toggle]').getAttribute('aria-expanded'),'true');
    const handoffBounds=await mobileHandoff.boundingBox();
    assert.ok(handoffBounds&&handoffBounds.width<=width+2,
      'Linked filmmaking exercise should fit '+width+'px mobile width');
    const handoffOverflow=await mobileHandoff.evaluate(el=>({scroll:el.scrollWidth,width:el.clientWidth}));
    assert.ok(handoffOverflow.scroll<=handoffOverflow.width+3,
      'Linked practical exercise must not overflow '+width+'px');
    await mobileHandoff.screenshot({path:path.join(shots,'01-lesson-practice-handoff-'+width+'px.png'),animations:'disabled'});
    await phone.locator('.mobile-nav [data-page="learn"]').click();
    await phone.locator('.react-learn-view').waitFor();
    await phone.locator('.mobile-nav [data-page="home"]').click();
    await phone.locator('[data-film-it-yourself]').waitFor();
    assert.equal(await mobileHandoff.locator('[data-practice-toggle]').getAttribute('aria-expanded'),'false');

    // The poster catalog stays first and studios stay closed on each ordinary Home visit.
    assert.equal(await phone.locator('.cinema-backup-shortcut').count(),0);
    assert.equal(await phone.locator('[data-cinema-workshop-details]').getAttribute('open'),null);
    const mobileOrder=await phone.locator('.cinema-discovery').evaluate(node=>{
      const rails=node.querySelector('[data-cinema-shelves-first]');
      const studios=node.querySelector('[data-cinema-workshop-zone]');
      return !!(rails&&studios&&(rails.compareDocumentPosition(studios)&Node.DOCUMENT_POSITION_FOLLOWING));
    });
    assert.ok(mobileOrder,'Poster rails must precede workshops at '+width+'px');
    await phone.screenshot({path:path.join(shots,'01-cinema-catalog-first-'+width+'px.png'),
      fullPage:false,animations:'disabled'});
    await openHomeWorkshops(phone);
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


    const mobilePractice=phone.locator('[data-film-it-yourself]');
    await mobilePractice.locator('[data-practice-toggle]').click();
    await mobilePractice.locator('[data-practice-choice="rhythm"]').click();
    assert.equal(await mobilePractice.locator('[data-practice-step]').count(),3);
    assert.equal(await mobilePractice.locator('[data-practice-open-lab]').getAttribute('data-practice-open-lab'),'cut');
    const practiceBounds=await mobilePractice.boundingBox();
    assert.ok(practiceBounds&&practiceBounds.width<=width+2,'Film practice fits '+width+'px phone');
    const practiceOverflow=await mobilePractice.evaluate(el=>({scroll:el.scrollWidth,width:el.clientWidth}));
    assert.ok(practiceOverflow.scroll<=practiceOverflow.width+3,'Practice instructions do not overflow '+width+'px');
    await mobilePractice.locator('[data-practice-pocket-toggle]').click();
    await mobilePractice.locator('[data-practice-observation]').fill('I noticed the quicker edit made the action easier to follow.');
    const phonePlan=await mobilePractice.locator('[data-practice-plan-text]').inputValue();
    assert(phonePlan.includes('One action. Two rhythms.'));
    assert(phonePlan.includes('I noticed the quicker edit made the action easier to follow.'));
    const pocketOverflow=await mobilePractice.locator('[data-practice-pocket]').evaluate(
      el=>({scroll:el.scrollWidth,width:el.clientWidth}));
    assert.ok(pocketOverflow.scroll<=pocketOverflow.width+3,
      'Pocket sheet must not overflow '+width+'px phone');
    await mobilePractice.locator('[data-practice-pocket]').screenshot({
      path:path.join(shots,'01-pocket-shoot-plan-'+width+'px.png'),animations:'disabled'});
    await mobilePractice.locator('[data-practice-pocket-toggle]').click();
    await mobilePractice.screenshot({path:path.join(shots,'01-film-it-yourself-'+width+'px.png'),animations:'disabled'});
    await mobilePractice.locator('[data-practice-toggle]').click();
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