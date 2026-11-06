import {useEffect,useRef,useState,type ChangeEvent,type CSSProperties,type Dispatch,type MouseEvent,type SetStateAction} from 'react';
import type {LabName} from '../../legacy/bridge';
import {CinemaScene} from './CinemaScene';
import {SoundBrief} from './SoundBrief';
import './option-b-sound-lab.css';
import {createSoundSession,soundOptions,SOUND_SECONDS,type SoundMode,type SoundSession} from './sound-audio';

/** Seventh React Creative Lab. Synthesized audio starts from an explicit
 * user gesture and cannot outlive its component or current selection. */
type Props={
  mode:SoundMode;setMode:Dispatch<SetStateAction<SoundMode>>;
  ambience:boolean;setAmbience:Dispatch<SetStateAction<boolean>>;
};
const tabs:{id:LabName;label:string}[]=[
  {id:'frame',label:'▣ Frame'},{id:'sound',label:'♫ Sound'},
  {id:'cut',label:'✂ Cut'},{id:'light',label:'☼ Light'},
  {id:'story',label:'✎ Make'},{id:'colour',label:'◐ Colour'},
  {id:'continuity',label:'↔ Match'}
];
export function SoundLab({mode,setMode,ambience,setAmbience}:Props){
  const session=useRef<SoundSession|null>(null);
  const [playing,setPlaying]=useState(false);
  const [status,setStatus]=useState('Press Play to compare');

  // No surviving oscillators, noise sources, contexts or timers after route
  // navigation. This deliberately does not update state while unmounting.
  useEffect(()=>()=>{session.current?.stop();session.current=null;},[]);
  function stop(){
    session.current?.stop();session.current=null;setPlaying(false);
    setStatus('Playback stopped.');
  }
  function choose(event:MouseEvent<HTMLButtonElement>,next:SoundMode){
    event.stopPropagation();stop();setMode(next);setStatus('Press Play to compare');
  }
  function play(event:MouseEvent<HTMLButtonElement>){
    event.stopPropagation();
    if(playing){stop();return;}
    if(mode==='silence'&&!ambience){
      setStatus('No generated sound: No music is selected and ambience is off.');
      return;
    }
    const next=createSoundSession(mode,ambience,
      ()=>{session.current=null;setPlaying(false);setStatus('Sound preview finished.');},
      ()=>{session.current=null;setPlaying(false);setStatus('Audio could not start. Check your device audio settings.');}
    );
    if(!next){
      setStatus('Web Audio is unavailable on this device. You can still explore the sound choices.');
      return;
    }
    session.current=next;setPlaying(true);setStatus('Audio playing · approximately five seconds');
  }
  function setQuiet(event:ChangeEvent<HTMLInputElement>){
    event.stopPropagation();stop();setAmbience(event.currentTarget.checked);
    setStatus('Press Play to compare');
  }
  const selected=soundOptions[mode];
  return <div className="page react-sound-lab sound-v2" data-v2-sound-screen="true">
    <div className="page-intro cinematic-heading sound-v2-intro">
      <div className="sound-v2-kicker"><span className="eyebrow">YOUR CINEMATIC SOUND STUDIO</span>
        <span className="sound-v2-course-tag">✦ REAL AUDIO LAB</span></div>
      <div className="sound-v2-hero"><div><h1>Hear the invisible.</h1>
        <p>One original frame. Three synthesized sound choices. Listen to how the scene might feel different.</p></div>
        <svg className="sound-v2-art" aria-hidden="true" viewBox="0 0 95 95">
          <rect x="12" y="32" width="22" height="33" rx="7" fill="#2d6170"/>
          <path d="M34 39l21-19v58L34 59Z" fill="#3c967f"/>
          <path d="M63 33q20 15 0 30M69 23q32 24 0 48" stroke="#2a8f75" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <circle cx="27" cy="17" r="6" fill="#ffcc81"/><circle cx="72" cy="78" r="5" fill="#ffcc81"/>
        </svg>
      </div>
      <div className="sound-v2-live-status" aria-label="Current real sound preview state">
        <span className="sound-v2-status-dot" aria-hidden="true"></span>
        <strong>{selected.label}</strong>
        <span>{ambience?'Ambience on':'Ambience off'}</span>
        <small>{playing?'Playing synthesized audio':'Ready to listen'}</small>
      </div>
    </div>
    <div className="sound-v2-note"><span aria-hidden="true">♫</span>
      <p><strong>LISTEN FIRST</strong> — Audio starts only when you press Play. Keep your volume comfortable.</p></div>
    <div className="lab-shell cinematic-lab-shell" data-v2-sound-workshop>
      <div className="lab-preview cinematic-preview" data-v2-sound-stage>
        <div className="sound-v2-stage-head"><div><span className="eyebrow">YOUR LIVE SOUNDSCAPE</span>
          <strong>One scene, changing sound</strong></div><span>ORIGINAL VECTOR · USER-STARTED AUDIO</span></div>
        <div className={`sound-cinema ${playing?'is-playing':''}`} data-sound-stage>
          <div className="audio-picture">
            <CinemaScene variant="sound" guides={false}/>
            <div className="audio-picture-label"><span className="on-air-dot"/> ONE SCENE · THREE SOUND CHOICES</div>
            <div className="sound-ripple" aria-hidden="true"><span/><span/><span/></div>
          </div>
          <div className="sound-wave" aria-hidden="true">
            {Array.from({length:31},(_,i)=><span key={i} style={{
              '--i':i,'--h':`${12+Math.round(40*Math.abs(Math.sin(i*.89)+Math.cos(i*.36))/2)}px`
            } as CSSProperties}/>)}
          </div>
          <div className="sound-progress" aria-hidden="true"><span/></div>
        </div>
        <div className="lab-hint">Original illustrated scene · Generated audio plays only when you press Play</div>
      </div>
      <div className="lab-panel film-controls" data-v2-sound-controls>
        <div className="eyebrow">STEP 01 · DESIGN YOUR SOUND</div>
        <h3>How does it sound?</h3>
        <p>Choose a generated sound, switch on quiet ambience when useful, and press Play to hear the actual difference.</p>
        <div className="sound-v2-control-label"><span className="eyebrow">THE SOUND CHOICE</span><span>3 ORIGINAL OPTIONS</span></div>
        <div className="lab-choices" role="group" aria-label="Select synthesized sound">
          {(Object.entries(soundOptions) as [SoundMode,typeof selected][]).map(([id,choice])=>
            <button type="button" key={id} className="lab-choice" data-sound={id}
              aria-pressed={mode===id} onClick={event=>choose(event,id)}>
              <strong>{choice.label}</strong><span>{choice.sub}</span>
            </button>)}
        </div>
        <div className="sound-v2-control-label"><span className="eyebrow">BACKGROUND AMBIENCE</span><span>OPTIONAL</span></div>
        <div className="sound-toggle">
          <label htmlFor="ambience">
            <input id="ambience" type="checkbox" checked={ambience}
              onChange={setQuiet} onInput={event=>event.stopPropagation()}/>
            <span><strong>Add quiet ambience</strong>
              <small>Generated soft background noise, not a recorded location</small></span>
          </label>
        </div>
        <div className="sound-v2-control-label"><span className="eyebrow">HEAR THE SCENE</span><span>~5 SEC · DEVICE AUDIO</span></div>
        <div className="sound-action-row">
          <button type="button" className="cta" data-audio={playing?'stop':'play'}
            onClick={play}>{playing?'■ Stop playback':'▶ Play the same moment'}</button>
          <span className="sound-status" role="status" aria-live="polite">{status}</span>
        </div>
        <div className="result-box"><strong>ONE POSSIBLE INTERPRETATION</strong><p>{selected.description}</p></div>
        <p className="studio-fact">“No music” does not necessarily mean silence. Dialogue and environmental sounds can still be present. These are illustrative synthesized sounds, not real film scores.</p>
      </div>
    </div>
    <SoundBrief mode={mode} ambience={ambience} onApply={(nextMode,nextAmbience)=>{
      stop();
      setMode(nextMode);
      setAmbience(nextAmbience);
      setStatus('Press Play to compare');
    }} />
    <div className="studio-next"><span>KEEP EXPLORING</span>
      <button className="btn-secondary" type="button" data-lab="cut">03 · Build an edit →</button>
      <button className="btn-secondary" type="button" data-lesson="sound">Read the connected lesson →</button>
    </div>
    <p className="demo-disclaimer">This sound sketch lasts {SOUND_SECONDS} seconds. It is not a recording, full score or calibrated listening test.</p>
    <div className="sound-v2-other-tools"><span className="eyebrow">CONTINUE LEARNING FILMCRAFT</span>
      <p>These are the original working Frame One production labs—not substitute demos.</p>
      <div className="lab-tabs" role="group" aria-label="Choose a creative experiment">
        {tabs.map(tab=><button type="button" className="lab-tab" data-lab={tab.id} key={tab.id}
          aria-pressed={tab.id==='sound'}>{tab.label}</button>)}
      </div>
    </div>
  </div>;
}
