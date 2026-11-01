/* v0.9D: seventh native-React lab, local Web Audio and lifecycle contract. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('src/App.tsx'),lab=read('src/components/labs/SoundLab.tsx'),
 audio=read('src/components/labs/sound-audio.ts'),art=read('src/components/labs/CinemaScene.tsx'),
 brief=read('src/components/labs/SoundBrief.tsx'),briefCss=read('src/components/labs/sound-brief.css'),
 old=read('src/legacy/runtime.js'),qa=read('scripts/browser-smoke.cjs');
assert(app.includes("import { SoundLab }"),'React app imports seventh lab');
assert(app.includes("route.lab==='sound' ? <SoundLab"),'Sound exclusively React-rendered');
assert(app.includes('setSoundMode')&&app.includes('setSoundAmbience'),'mode and ambience persisted in React state');
assert(old.includes("['continuity','colour','frame','light','cut','story','sound'].includes(state.lab)?'':"),'old runtime renders no duplicate lab markup');
assert(old.includes('.react-make-lab,.react-sound-lab'), 'old delegated input skips new Sound Lab');
for(const id of ['silence','warm','tension'])assert(audio.includes(id+':{label:'),'original audio choice: '+id);
assert(audio.includes('window.AudioContext')&&audio.includes('webkitAudioContext'),'native browser AudioContext only');
assert(audio.includes('for(const node of sources)')&&audio.includes('node.stop()')&&audio.includes('ctx.close()'),'synthesized sources and context explicitly disposed');
assert(audio.includes('window.clearTimeout(timer)')&&audio.includes('if(stopped)return'),'timer disposal and idempotent stop');
assert(audio.includes('ctx.resume()'),'start audio in response to play gesture');
assert(audio.includes("mode!=='silence'")&&audio.includes('if(ambience)'),'No music separate from generated ambience');
assert(audio.includes('createBufferSource')&&audio.includes('createOscillator'),'original locally synthesized ambient and tone sound');
assert(!audio.includes('fetch(')&&!audio.includes('http://')&&!audio.includes('https://'),'Sound mode never downloads audio');
assert(lab.includes("mode==='silence'&&!ambience"),'all-muted mode does not unnecessarily open AudioContext');
assert(lab.includes('<SoundBrief mode={mode} ambience={ambience}')&&lab.includes('stop();\n      setMode(nextMode);'), 'story presets stop current audio and reuse genuine controls');
for(const id of ["id:'ordinary'","id:'hope'","id:'uncertain'"]) assert(brief.includes(id),'three story situations');
assert(brief.includes('brief.listeningNotes[mode]')&&brief.includes('ambienceNote'),'discussion derives from actual sound and ambience');
assert(brief.includes('onApply(brief.starter.mode,brief.starter.ambience)'),'preset uses original Sound Lab settings');
assert(brief.includes('<details>')&&brief.includes('data-sound-feedback')&&brief.includes('aria-pressed={active===item.id}'),'accessible optional exercise');
assert(!brief.includes('createSoundSession(')&&!brief.includes('localStorage')&&!brief.includes('AudioContext')&&!brief.includes('fetch('),'story controls cannot play audio or write data');
assert(briefCss.includes('@media(max-width:600px)'),'mobile layout supports narrow screens');
assert(qa.includes('[data-sound-brief="uncertain"]')&&qa.includes('data-sound-feedback'),'real browser tests scenario and mode response');
assert(lab.includes("useEffect(()=>()=>{session.current?.stop();session.current=null;},[])"),'unmount always closes audio');
assert(lab.includes("event.stopPropagation()"),'React controls avoid legacy handlers');
assert(lab.includes("onInput={event=>event.stopPropagation()}"),'ambience input avoids legacy delegated mutation');
assert(lab.includes("data-audio={playing?'stop':'play'}"),'explicit accessible stop control');
assert(lab.includes("data-lab='cut'")||lab.includes('data-lab="cut"'),'original connected creative activity retained');
assert(art.includes("sound:'f1-sound-scene'"),'original bus-stop illustration retained in Sound Lab');
assert(qa.includes("React must own Sound Lab")&&qa.includes('20-react-sound-'),'browser QA covers genuine audio and mobile');
for(const key of ['frameone-progress-v01','frameone-scene-v07','frameone-practice-v07'])assert(old.includes(key),'all persisted learner keys preserved '+key);
console.log('PASS: React Sound Lab mode/ambience, local synthesis, user gesture, AudioContext closure, unmount and saved data.');
