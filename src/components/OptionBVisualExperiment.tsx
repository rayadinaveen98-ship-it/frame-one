import {OptionBReactScene} from './OptionBReactMission';

type VisualTopic='shot'|'camera'|'lighting'|'composition'|'movement'|'lenses'|'colour';
const crop=[1,1.35,1.85];
const labels:Record<VisualTopic,[string,string,string]>={
 shot:['Establishing view','Balanced view','Detail view'],
 camera:['Position','Direction','Height'],
 lighting:['Direction','Source size','Intensity'],
 composition:['Centered','Rule-of-thirds guide','Negative space'],
 movement:['Hold','Pan in place','Track through space'],
 lenses:['Wide crop','Narrow crop','Move the camera'],
 colour:['Subject accent','Palette relationship','Story context']
};
const explanations:Record<VisualTopic,string>={
 shot:'Framing exercise: this previews crop only. It does not change where the illustrated camera stood.',
 camera:'Diagram of camera setup. The unchanged scene illustration is not pretending to show a new camera angle.',
 lighting:'Lighting principles: the markers show where sources could be placed. These are not physically rendered shadows.',
 composition:'The thirds grid is a guide, not a requirement. The original illustration is not a live camera feed.',
 movement:'Top-down blocking diagram. Rotation and movement of position are different operations.',
 lenses:'A crop from a single illustration demonstrates field of view only. Moving position would produce a different perspective.',
 colour:'Illustrative filters only. Physical lighting, art direction and professional colour grading are different tools.'
};

function FilmSetDiagram({topic,index}:{topic:'camera'|'lighting'|'movement'|'lenses';index:number}){
 const isCam=topic==='camera',isLight=topic==='lighting';
 const cameraPos=isCam?(index===1?[74,144]:[60,144])
   :topic==='lenses'?[85,135]:index===2?[58,132]:[58,148];
 const [cameraX,cameraY]=cameraPos;
 const directionAngle=(isCam&&index===1)?-23:topic==='movement'&&index===1?-38:0;
 const sourcePosition=isLight?(index===0?[80,62]:index===1?[174,96]:[110,137]):[162,44];
 return <div className="visual-diagram" role="img"
   aria-label={isCam?labels.camera[index]+' camera setup shown on a top-down film set':
     isLight?labels.lighting[index]+' conceptual lighting positions on a film set':
       topic==='lenses'?'Camera position change shown on a top-down floor plan, not a crop':
       labels.movement[index]+' camera blocking movement shown on a floor plan'}>
   <svg viewBox="0 0 320 200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="visual-floor" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0" stopColor="#edf9ee"/><stop offset="1" stopColor="#d8eee8"/>
       </linearGradient>
       <marker id="visual-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#248874"/></marker>
     </defs>
     <rect width="320" height="200" rx="17" fill="url(#visual-floor)"/>
     <path d="M0 46H320M0 99H320M0 154H320M70 0V200M140 0V200M210 0V200M280 0V200"
       stroke="#b5dacf" strokeWidth="1" opacity=".58"/>
     <rect x="118" y="65" width="100" height="82" rx="16" fill="#fff" stroke="#b8dcd2" strokeWidth="3"/>
     <path d="M128 128Q164 115 205 127" stroke="#e1eae2" strokeWidth="5" strokeLinecap="round" fill="none"/>
     <circle cx="162" cy="105" r="19" fill="#f7bd73" stroke="#a66e46" strokeWidth="3"/>
     <circle cx="156" cy="102" r="2.5" fill="#5b4c47"/><circle cx="168" cy="102" r="2.5" fill="#5b4c47"/>
     <path d="M156 113q6 6 12 0" fill="none" stroke="#8e5b49" strokeWidth="2.5" strokeLinecap="round"/>
     <path d="M149 86L153 77H170L175 88" fill="#3a6773" stroke="#3a6773" strokeWidth="3"/>
     <text x="168" y="155" fontSize="9" fontWeight="800" fill="#5b7c7d" textAnchor="middle">SUBJECT</text>
     {isLight&&<>
       <circle cx={sourcePosition[0]} cy={sourcePosition[1]} r={index===1?24:16}
         fill="#ffda83" opacity={index===2?.52:.85} stroke="#eab359" strokeWidth="3"/>
       <path d={'M'+sourcePosition[0]+' '+sourcePosition[1]+'L155 98'} stroke="#d59835"
         strokeWidth={index===2?2:5} strokeDasharray={index===2?'4 6':'7 4'} opacity=".8"/>
       <text x="13" y="22" fill="#287b71" fontSize="10" fontWeight="850">LIGHT POSITION</text>
       <text x="13" y="35" fill="#5a807f" fontSize="8">{index===0?'DIRECTION':index===1?'LARGER APPARENT SOURCE':'LIGHT INTENSITY'}</text>
     </>}
     {!isLight&&<>
       {(topic==='movement'&&index===2||topic==='lenses')&&<path d="M49 164 Q70 133 99 114" stroke="#278f79" strokeWidth="4"
         strokeDasharray="7 5" fill="none" markerEnd="url(#visual-arrow)"/>}
       <g transform={'translate('+cameraX+' '+cameraY+') rotate('+directionAngle+')'}>
         <path d="M0 0L58 -32L58 6Z" fill="#8ad7c2" fillOpacity=".55" stroke="#62a899" strokeWidth="1.5"/>
         <rect x="-23" y="-13" width="42" height="27" rx="7" fill="#31596d" stroke="#24445b" strokeWidth="2"/>
         <circle cx="-5" cy="0" r="8" fill="#91d7d6" stroke="#d8ffff" strokeWidth="2.5"/>
         <path d="M18 -8L32 -15V15L18 8Z" fill="#2c536a"/>
       </g>
       {topic==='movement'&&index===1&&<path d="M52 114Q39 83 72 72" stroke="#248874"
         fill="none" strokeWidth="4" strokeDasharray="6 5" markerEnd="url(#visual-arrow)"/>}
       {isCam&&index===2&&<g>
         <rect x="231" y="62" width="76" height="98" rx="9" fill="#fff" stroke="#acd4c7" strokeWidth="2"/>
         <text x="269" y="78" fill="#256d6b" fontSize="8" fontWeight="800" textAnchor="middle">SIDE VIEW</text>
         <path d="M242 139H296M242 93H296M270 87V142" stroke="#a5d2c2" strokeWidth="2" strokeDasharray="3 4"/>
         <circle cx="270" cy="93" r="7" fill="#f0ae63" stroke="#bc874d" strokeWidth="2"/>
         <path d="M267 136H273L277 141H263Z" fill="#356b79"/>
         <text x="269" y="154" fill="#417b78" fontSize="8" textAnchor="middle">HEIGHT</text>
       </g>}
       <text x="13" y="23" fill="#287b71" fontSize="10" fontWeight="850">{isCam?'CAMERA PLAN':topic==='lenses'?'CAMERA POSITION':'CAMERA MOVEMENT'}</text>
       <text x="13" y="36" fill="#5a807f" fontSize="8">{topic==='lenses'?'MOVE ≠ CROP':labels[topic][index].toUpperCase()}</text>
     </>}
   </svg>
 </div>;
}

/** Every control is the same Option B pill vocabulary; visuals are original
 * stage illustrations, not fake live rendering or real lens/lighting physics.
 */
export function OptionBVisualExperiment({lessonId,selected}:{lessonId:string;selected:number}){
 if(!(['shot','camera','lighting','composition','movement','lenses','colour'] as string[]).includes(lessonId))return null;
 const topic=lessonId as VisualTopic;
 const isDiagram=topic==='camera'||topic==='lighting'||topic==='movement'||(topic==='lenses'&&selected===2);
 const zoom=topic==='shot'||topic==='lenses'?crop[selected]:
  topic==='composition'?[1.3,1.3,1][selected]:1.35;
 const filter=topic==='colour'?(['neutral','warm','cool'] as const)[selected]:'neutral';
 const guides=topic==='composition'&&selected===1;
 return <section className="visual-experiment" data-v2-visual-experiment={topic} data-v2-visual-selection={selected}
   aria-label="Interactive visual-language experiment">
   <div className="visual-experiment-head">
     <span className="eyebrow">YOUR VISUAL WORKSHOP</span>
     <strong>{labels[topic][selected]}</strong>
   </div>
   {isDiagram
     ? <FilmSetDiagram topic={topic} index={selected}/>
     : <OptionBReactScene mode={topic.toUpperCase()} value={zoom} kind={filter} guides={guides}/>}
   <p className="visual-experiment-honesty">{topic==='lenses'&&selected===2
     ? 'This map shows the camera moving through space. A new viewpoint changes perspective; the artwork is not an optical simulation.'
     : explanations[topic]}</p>
 </section>;
}
