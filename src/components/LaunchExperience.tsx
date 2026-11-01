import {useEffect,useRef,useState} from 'react';
import './launch-experience.css';

type Sequence='cold'|'return'|null;
const COLD_MS=4000;
const RETURN_MS=1200;
const RETURN_AFTER_MS=45000;

/** An original, lightweight cinema ident. No remote media or audio.
 * Home loads behind the artwork; native Back and the app stay interactive.
 * Skip is a genuine 44px control on cold launches; decorative art is hidden
 * from assistive technology. A quick app-switch never replays the intro.
 */
export function LaunchExperience() {
  const [sequence,setSequence]=useState<Sequence>(()=>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?null:'cold');
  const backgroundAt=useRef<number|null>(null);

  useEffect(()=>{
    if(!sequence)return;
    const duration=sequence==='cold'?COLD_MS:RETURN_MS;
    const timer=window.setTimeout(()=>setSequence(null),duration);
    return ()=>window.clearTimeout(timer);
  },[sequence]);

  useEffect(()=>{
    const visibility=()=>{
      if(document.hidden){backgroundAt.current=Date.now();return;}
      const departed=backgroundAt.current;
      backgroundAt.current=null;
      if(departed===null || Date.now()-departed<RETURN_AFTER_MS)return;
      if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
      setSequence('return');
    };
    document.addEventListener('visibilitychange',visibility);
    return ()=>document.removeEventListener('visibilitychange',visibility);
  },[]);

  if(!sequence)return null;
  return <div className={'launch-experience launch-'+sequence}
    data-launch-sequence={sequence} data-launch-duration={sequence==='cold'?COLD_MS:RETURN_MS}>
    <div className="launch-stage" aria-hidden="true">
      <div className="launch-iris"/>
      <div className="launch-halo"/>
      <div className="launch-grain"/>
      <div className="launch-beam"/>
      <div className="launch-gate launch-gate-top"/>
      <div className="launch-gate launch-gate-bottom"/>
      <div className="launch-frame">
        <svg className="launch-logo" viewBox="0 0 160 160" focusable="false">
          <defs>
            <linearGradient id="launch-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff0ce"/>
              <stop offset="38%" stopColor="#fac38a"/>
              <stop offset="100%" stopColor="#a76542"/>
            </linearGradient>
          </defs>
          <path className="launch-outline" d="M32 23H128Q137 23 137 32V128Q137 137 128 137H32Q23 137 23 128V32Q23 23 32 23Z"
            fill="none" stroke="url(#launch-gold)" strokeWidth="2.7"/>
          <path className="launch-monogram launch-monogram-f" d="M49 115V46H87M49 81H78" fill="none"
            stroke="url(#launch-gold)" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path className="launch-monogram launch-monogram-one" d="M99 62L118 48V114" fill="none"
            stroke="url(#launch-gold)" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path className="launch-registration" d="M31 17H57M103 17H129M31 143H57M103 143H129" fill="none"
            stroke="#f5b980" strokeWidth="1.1" opacity=".42"/>
        </svg>
      </div>
      <div className="launch-wordmark">FRAME ONE</div>
      <div className="launch-subtitle">THE ART OF FILM</div>
      <div className="launch-reveal-line"/>
    </div>
    {sequence==='cold' ? <button className="launch-skip" data-launch-skip
      type="button" aria-label="Skip Frame One opening animation"
      onClick={()=>setSequence(null)}>Skip intro <span aria-hidden="true">→</span></button> : null}
  </div>;
}
