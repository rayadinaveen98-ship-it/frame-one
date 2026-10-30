import {useState} from 'react';
import {visualPilotForLesson,type VisualPilotId} from '../data/visual-lessons';
import {openLab} from '../legacy/bridge';
import {ShotSizeFrames,CompositionFrames,ColourFrames} from './VisualFramesNext';
import './visual-lessons.css';

function LightingFrame({take}:{take:0|1}){
  const side=take===1;
  return <svg viewBox="0 0 640 350" className="vl-illustration" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="vl-room-light" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={side?'#383a43':'#78634e'}/>
        <stop offset="1" stopColor="#151e2b"/>
      </linearGradient>
      <linearGradient id="vl-cup-light" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={side?'#d9aa7d':'#bca18b'}/>
        <stop offset=".47" stopColor={side?'#97694c':'#dfb58e'}/>
        <stop offset="1" stopColor={side?'#272833':'#ab8b7c'}/>
      </linearGradient>
    </defs>
    <rect width="640" height="350" fill="url(#vl-room-light)"/>
    <rect x="0" y="0" width="640" height="350" fill="#090e19" fillOpacity=".19"/>
    <path d="M33 268H607" stroke="#c9aa8a" strokeOpacity=".26" strokeWidth="3"/>
    <rect x="31" y="20" width="151" height="213" rx="4" fill="#1c2731" stroke="#cbb5a4" strokeOpacity=".38" strokeWidth="6"/>
    <path d="M105 22V230M34 124H179" stroke="#a8b3b5" strokeOpacity=".25" strokeWidth="4"/>
    {side?<path d="M184 36L444 121L421 278L183 246Z" fill="#e8ba83" opacity=".22"/>:
      <ellipse cx="363" cy="159" rx="210" ry="145" fill="#ecc49a" opacity=".13"/>}
    <ellipse cx={side?432:370} cy="280" rx={side?147:105} ry="19"
      fill="#020913" opacity={side?.78:.26}/>
    <path d="M273 199H446L426 273H286Z" fill="url(#vl-cup-light)" stroke="#ecc9a4" strokeOpacity=".56" strokeWidth="2"/>
    <ellipse cx="360" cy="199" rx="88" ry="22" fill="#c7a383" stroke="#f3d5b9" strokeWidth="5"/>
    <ellipse cx="360" cy="201" rx="64" ry="10" fill={side?'#433137':'#766052'}/>
    <path d="M442 215Q511 211 505 244Q501 274 432 261" fill="none" stroke={side?'#a47a61':'#c2a089'} strokeWidth="16"/>
    <path d="M0 291H640V350H0Z" fill="#22272d"/>
    <path d="M0 291H640" stroke="#d0b39a" strokeOpacity=".37" strokeWidth="3"/>
    <g stroke="#e3c3a0" strokeOpacity=".65" strokeWidth="2">
      <path d="M18 20h23M18 20v23M622 20h-23M622 20v23M18 330h23M18 330v-23M622 330h-23M622 330v-23"/>
    </g>
    <text x="29" y="321" fontSize="14" fill="#c7b29f" fontFamily="monospace">FRAME 01 / SAME SUBJECT</text>
    <text x="610" y="321" textAnchor="end" fontSize="14" fill="#ecd1b3" fontFamily="monospace">{side?'SIDE LIGHT':'FRONT LIGHT'}</text>
  </svg>;
}

function RhythmShot({x,y,w,h,type}:{x:number;y:number;w:number;h:number;type:'wide'|'hand'|'cup'}){
  const center=x+w/2;
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="5" fill="#2c343b" stroke="#ae9884" strokeWidth="2"/>
    <rect x={x+5} y={y+6} width={w-10} height={h-13} fill="#252a34"/>
    {type==='wide'?<>
      <rect x={x+w*.12} y={y+h*.13} width={w*.22} height={h*.43} stroke="#bdb5a6" strokeOpacity=".45" fill="#3b4853" strokeWidth="3"/>
      <path d={`M${x+w*.12} ${y+h*.74}H${x+w*.87}`} stroke="#d1b397" strokeWidth="3"/>
      <ellipse cx={center+w*.11} cy={y+h*.57} rx={w*.14} ry={h*.055} fill="#bc9b7e"/>
      <path d={`M${center-w*.04} ${y+h*.55}H${center+w*.26}L${center+w*.23} ${y+h*.72}H${center}Z`} fill="#bd9878"/>
      <path d={`M${x+w*.2} ${y+h*.45}L${x+w*.42} ${y+h*.55}`} stroke="#d2b19b" strokeWidth="10" strokeLinecap="round"/>
    </>:type==='hand'?<>
      <path d={`M${x+w*.05} ${y+h*.66}L${center} ${y+h*.42}L${center+w*.17} ${y+h*.45}`} stroke="#d2ac8e" strokeWidth="20" fill="none" strokeLinecap="round"/>
      <path d={`M${center+w*.18} ${y+h*.57}L${center+w*.3} ${y+h*.73}`} stroke="#e5bd99" strokeWidth="9" strokeLinecap="round"/>
      <ellipse cx={x+w*.76} cy={y+h*.77} rx={w*.19} ry={h*.045} fill="#b89c86"/>
    </>:<>
      <path d={`M${center-w*.17} ${y+h*.37}H${center+w*.17}L${center+w*.12} ${y+h*.77}H${center-w*.11}Z`} fill="#dfb895"/>
      <ellipse cx={center} cy={y+h*.37} rx={w*.18} ry={h*.053} fill="#6e564a" stroke="#e9c6a3" strokeWidth="4"/>
      <path d={`M${center+w*.17} ${y+h*.46}Q${center+w*.33} ${y+h*.5} ${center+w*.18} ${y+h*.65}`} stroke="#c39e82" strokeWidth="11" fill="none"/>
    </>}
  </g>;
}
function RhythmFrame({take}:{take:0|1}){
  return <div className="vl-rhythm-art" aria-hidden="true">
    <svg viewBox="0 0 640 350" className="vl-illustration" focusable="false">
      <rect width="640" height="350" fill="#141c26"/>
      <path d="M23 42H617M23 308H617" stroke="#887c76" strokeWidth="1" strokeDasharray="7 7" opacity=".55"/>
      {take===0?<RhythmShot x={60} y={61} w={520} h={224} type="wide"/>:<>
        <RhythmShot x={24} y={65} w={188} h={208} type="wide"/>
        <RhythmShot x={226} y={65} w={188} h={208} type="hand"/>
        <RhythmShot x={428} y={65} w={188} h={208} type="cup"/>
      </>}
      {take===0?<text x="320" y="30" textAnchor="middle" fontSize="14" fill="#e1c5a7" fontFamily="monospace">ONE CONTINUOUS VIEW</text>:
        <text x="320" y="30" textAnchor="middle" fontSize="14" fill="#e1c5a7" fontFamily="monospace">THREE PLANNED SHOTS</text>}
      {take===0?<rect x="60" y="292" width="520" height="7" rx="3" fill="#dfb48b"/>:
        <>{[24,226,428].map(x=><rect key={x} x={x} y="292" width="188" height="7" rx="3" fill="#dfb48b"/>)}</>}
      {take===0?<text x="320" y="332" textAnchor="middle" fontSize="15" fill="#d7c0a9" fontFamily="monospace">0 ─────────── 6 SECONDS</text>:
        <g fill="#d7c0a9" fontFamily="monospace" fontSize="15" textAnchor="middle">
          <text x="118" y="332">0–2s</text><text x="320" y="332">2–4s</text><text x="522" y="332">4–6s</text>
        </g>}
    </svg>
  </div>;
}
function SoundFrame(){
  return <svg viewBox="0 0 640 350" className="vl-illustration" aria-hidden="true" focusable="false">
    <defs><linearGradient id="vl-sound-room" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#354252"/><stop offset="1" stopColor="#161e2b"/>
    </linearGradient></defs>
    <rect width="640" height="350" fill="url(#vl-sound-room)"/>
    <rect x="46" y="30" width="212" height="194" rx="3" fill="#141f2b" stroke="#aaabb2" strokeWidth="6"/>
    <rect x="60" y="44" width="184" height="168" fill="#495e6d"/>
    <path d="M152 44V212M60 128H244" stroke="#9ca7b0" strokeWidth="5"/>
    <path d="M70 191L90 140L130 180L163 124L230 180" fill="#293e4c" opacity=".9"/>
    <path d="M0 281H640" stroke="#bea48e" strokeOpacity=".48" strokeWidth="4"/>
    <rect x="312" y="207" width="222" height="24" rx="3" fill="#9a7b6c"/>
    <path d="M331 230V295M520 230V295" stroke="#a18c7b" strokeWidth="12"/>
    <ellipse cx="410" cy="201" rx="29" ry="8" fill="#d5b199"/>
    <path d="M384 203V183Q385 174 399 167" stroke="#cfa98e" strokeWidth="4" fill="none"/>
    <rect x="443" y="171" width="66" height="25" rx="3" fill="#48525c" stroke="#9ea6ac" strokeWidth="2"/>
    <path d="M453 185H498" stroke="#c2a48a" strokeOpacity=".6" strokeWidth="2"/>
    <path d="M0 300H640V350H0Z" fill="#1e252d"/>
    <path d="M20 23h26M20 23v25M620 23h-26M620 23v25" stroke="#e0bc9a" strokeWidth="2"/>
    <text x="26" y="331" fontSize="14" fill="#d4bbaa" fontFamily="monospace">PICTURE LOCKED / SAME FRAME</text>
  </svg>;
}
function VisualStage({id,take}:{id:VisualPilotId;take:0|1}){
  return <figure className="vl-stage" data-visual-take={take} data-visual-art={id}>
    {id==='lighting'?<LightingFrame take={take}/>:id==='rhythm'?<RhythmFrame take={take}/>:id==='shot'?<ShotSizeFrames take={take}/>:id==='composition'?<CompositionFrames take={take}/>:id==='colour'?<ColourFrames take={take}/>:<SoundFrame/>}
    <figcaption className="vl-stage-caption">
      <span>{id==='ambience'?'IDENTICAL PICTURE / SOUND DIRECTIONS':'ILLUSTRATED SHOT STUDY'}</span>
      <span>TAKE {take===0?'A':'B'}</span>
    </figcaption>
  </figure>;
}

/** A shared visual-first format: observe a real illustrated difference first,
 * compare A and B, then reveal the craft reasoning on demand.
 * No fake playback, network images or lesson-completion writes.
 */
export function VisualLessonPilot({lessonId}:{lessonId:string}){
  const pilot=visualPilotForLesson(lessonId);
  const [take,setTake]=useState<0|1>(0);
  const [revealed,setRevealed]=useState(false);
  if(!pilot)return null;
  const current=pilot.takes[take];
  return <section className={'visual-lesson visual-lesson-'+pilot.id} data-visual-lesson={pilot.id}
    aria-labelledby={'vl-heading-'+pilot.id}>
    <header className="vl-heading">
      <div className="vl-heading-copy">
        <span className="vl-eyebrow">{pilot.eyebrow} / STUDY {pilot.index}</span>
        <h2 id={'vl-heading-'+pilot.id}>{pilot.question}</h2>
        <p>{pilot.hook}</p>
      </div>
      <span className="vl-viewfinder" aria-hidden="true">▣</span>
    </header>
    <VisualStage id={pilot.id} take={take}/>
    <div className="vl-take-controls" role="group" aria-label="Compare the two filmmaking choices">
      {pilot.takes.map((option,index)=><button type="button" key={option.label}
        data-visual-option={index===0?'a':'b'}
        aria-pressed={take===index}
        onClick={()=>{setTake(index as 0|1);setRevealed(false);}}>
        <span className="vl-take-letter">{index===0?'A':'B'}</span>
        <span className="vl-take-copy"><strong>{option.label.split(' · ')[1]}</strong><small>{option.cue}</small></span>
      </button>)}
    </div>
    <div className="vl-noticing">
      <div className="vl-noticing-label"><span>01 / SEE THE DIFFERENCE</span><span className="vl-micro">NO RIGHT FEELING REQUIRED</span></div>
      <h3 data-visual-focus>{current.focus}</h3>
      <p data-visual-description>{current.description}</p>
      {pilot.id==='ambience'?<div className="vl-sound-direction" data-visual-sound-layers>
        <span>IMAGINED SOUND LAYERS</span>
        {(take===0?['Indoor room tone','No background score']:['Faint fan','Distant road traffic','No background score']).map(layer=><em key={layer}>{layer}</em>)}
      </div>:null}
      <div className="vl-discovery">
        <button type="button" data-visual-reveal aria-expanded={revealed}
          aria-controls={'vl-explain-'+pilot.id}
          onClick={()=>setRevealed(state=>!state)}>
          {revealed?'Hide the filmmaker note':'Look closer · Why did it change?'} <span aria-hidden="true">{revealed?'−':'+'}</span>
        </button>
        {revealed?<div id={'vl-explain-'+pilot.id} className="vl-explanation" role="region" aria-label="Visual lesson insight">
          <strong>{pilot.discovery}</strong>
          <p>{pilot.reason}</p>
          <ul>{pilot.notice.map(item=><li key={item}>{item}</li>)}</ul>
        </div>:null}
      </div>
    </div>
    <footer className="vl-footer">
      <div className="vl-takeaway"><span>THE FRAME TO REMEMBER</span><p>{pilot.takeaway}</p></div>
      <div className="vl-practice"><span>TRY WITH YOUR PHONE</span><p>{pilot.prompt}</p>
        <button type="button" data-visual-lab={pilot.lab} onClick={()=>openLab(pilot.lab)}>
          {pilot.labLabel} <span aria-hidden="true">↗</span>
        </button>
      </div>
      <small>{pilot.footnote}</small>
    </footer>
  </section>;
}
