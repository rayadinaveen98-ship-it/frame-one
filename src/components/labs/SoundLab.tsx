import {useEffect,useRef,useState,type ChangeEvent,type CSSProperties,type Dispatch,type MouseEvent,type SetStateAction} from 'react';
import type {LabName} from '../../legacy/bridge';
import {CinemaScene} from './CinemaScene';
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
  return <div className="page react-sound-lab">
    <div className="page-intro cinematic-heading">
      <div className="eyebrow">DIRECTOR'S STUDIO / EXPERIMENT 02</div>
      <h1>Hear the invisible.</h1>
      <p>The image is unchanged. Play different original sounds and notice how you interpret the same moment.</p>
    </div>
    <div className="lab-tabs" role="group" aria-label="Choose a creative experiment">
      {tabs.map(tab=><button type="button" className="lab-tab" data-lab={tab.id} key={tab.id}
        aria-pressed={tab.id==='sound'}>{tab.label}</button>)}
    </div>
    <div className="lab-shell cinematic-lab-shell">
      <div className="lab-preview cinematic-preview">
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
      <div className="lab-panel film-controls">
        <div className="eyebrow">SOUND DESK · 02</div>
        <h3>How does it sound?</h3>
        <p>Listen at a comfortable volume. Sound can suggest emotion, but viewers may respond differently.</p>
        <div className="lab-choices" role="group" aria-label="Select synthesized sound">
          {(Object.entries(soundOptions) as [SoundMode,typeof selected][]).map(([id,choice])=>
            <button type="button" key={id} className="lab-choice" data-sound={id}
              aria-pressed={mode===id} onClick={event=>choose(event,id)}>
              <strong>{choice.label}</strong><span>{choice.sub}</span>
            </button>)}
        </div>
        <div className="sound-toggle">
          <label htmlFor="ambience">
            <input id="ambience" type="checkbox" checked={ambience}
              onChange={setQuiet} onInput={event=>event.stopPropagation()}/>
            <span><strong>Add quiet ambience</strong>
              <small>Generated soft background noise, not a recorded location</small></span>
          </label>
        </div>
        <div className="sound-action-row">
          <button type="button" className="cta" data-audio={playing?'stop':'play'}
            onClick={play}>{playing?'■ Stop playback':'▶ Play the same moment'}</button>
          <span className="sound-status" role="status" aria-live="polite">{status}</span>
        </div>
        <div className="result-box"><strong>ONE POSSIBLE INTERPRETATION</strong><p>{selected.description}</p></div>
        <p className="studio-fact">“No music” does not necessarily mean silence. Dialogue and environmental sounds can still be present. These are illustrative synthesized sounds, not real film scores.</p>
      </div>
    </div>
    <div className="studio-next"><span>KEEP EXPLORING</span>
      <button className="btn-secondary" type="button" data-lab="cut">03 · Build an edit →</button>
      <button className="btn-secondary" type="button" data-lesson="sound">Read the connected lesson →</button>
    </div>
    <p className="demo-disclaimer">This sound sketch lasts {SOUND_SECONDS} seconds. It is not a recording, full score or calibrated listening test.</p>
  </div>;
}
