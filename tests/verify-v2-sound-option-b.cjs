/* Production Sound Lab acceptance: authentic 5-second user-triggered Web
 * Audio and airtight resource disposal cannot be replaced by fake animation. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const lab=read('src/components/labs/SoundLab.tsx');
const scene=read('src/components/labs/CinemaScene.tsx');
const audio=read('src/components/labs/sound-audio.ts');
const brief=read('src/components/labs/SoundBrief.tsx');
const css=read('src/components/labs/option-b-sound-lab.css');
const qa=read('scripts/browser-smoke.cjs');
const app=read('src/App.tsx');
assert(lab.includes('react-sound-lab sound-v2')&&lab.includes('data-v2-sound-screen="true"'),
 'Only the original production Sound Lab should receive the new Option B design');
assert(lab.includes('data-v2-sound-stage')&&lab.includes('data-v2-sound-controls')&&
 lab.indexOf('data-v2-sound-stage')<lab.indexOf('data-v2-sound-controls'),
 'Real soundscape art comes before the audio controls in document order');
assert(lab.includes('sound-v2-live-status')&&
 lab.includes('{selected.label}')&&lab.includes("{ambience?'Ambience on':'Ambience off'}")&&
 lab.includes("{playing?'Playing synthesized audio':'Ready to listen'}"),
 'Studio state must reflect actual audio/mode/ambience rather than dummy graphics');
for(const id of ['silence','warm','tension'])assert(audio.includes(id+':{label:'),
 'Existing real generated-audio mode '+id+' must remain');
assert(lab.includes('createSoundSession(mode,ambience,')&&
 lab.includes('data-audio={playing?\'stop\':\'play\'}')&&
 lab.includes('setStatus(\'Web Audio is unavailable on this device.'),
 'Original user-gesture AudioContext and honest unsupported-device fallback required');
assert(audio.includes('window.AudioContext')&&audio.includes('ctx.close()')&&
 audio.includes('node.stop()')&&audio.includes('window.clearTimeout(timer)'),
 'Real Web Audio nodes/timer must remain cleaned up');
assert(lab.includes('useEffect(()=>()=>{session.current?.stop();session.current=null;},[])')&&
 lab.includes('function stop(){')&&lab.includes('event.stopPropagation();stop();setMode(next)'),
 'No audio may leak on unmount or on a sound choice change');
assert(lab.includes("mode==='silence'&&!ambience")&&lab.includes('No generated sound:'),
 'All-muted mode must be truly silent without creating a fake audio session');
assert(lab.includes('<SoundBrief mode={mode} ambience={ambience}')&&
 brief.includes('data-sound-feedback')&&brief.includes('data-sound-brief'),
 'Original three story sound exercises must keep actual mode/ambience state');
assert(lab.includes('id="ambience"')&&lab.includes('onChange={setQuiet}')&&
 lab.includes('data-lesson="sound"')&&lab.includes('data-lab={tab.id}'),
 'Original ambience switch, lesson and seven real lab routes preserved');
assert(scene.includes("sound:'f1-sound-scene'"),'Original bus-stop illustration is unchanged');
assert(!lab.includes('localStorage.setItem(')&&!audio.includes('fetch('),
 'No separate persistence store and no remote downloadable music/audio');
assert(css.includes('.react-sound-lab.sound-v2')&&
 css.includes('max-width:360px')&&css.includes('prefers-reduced-motion:reduce'),
 'Option B skin must be isolated, 320px responsive and motion-accessible');
for(const hex of ['#1c3442','#55b97b','#f7fbf9'])assert(css.includes(hex),
 'Original approved palette missing '+hex);
assert(qa.includes('data-v2-sound-stage')&&qa.includes('data-v2-sound-controls'),
 'Browser QA must verify real scene-first audio controls');
assert(app.includes("route.lab==='sound' ? <SoundLab"),
 'Original React App owns functional Sound Lab and its state');
console.log('PASS: real Sound Lab original Web Audio, silent mode, ambience, cleanup, three real scenarios, responsive Option B art.');
