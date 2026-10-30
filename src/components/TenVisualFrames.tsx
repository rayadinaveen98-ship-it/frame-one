import type {VisualPilotId} from '../data/visual-lessons';
type NewId=Extract<VisualPilotId,'story'|'script'|'acting'|'character'|'dialogue'|'camera'|'movement'|'lenses'|'music'|'editing'>;
type Take=0|1;
function Corners(){return <g stroke="#e9c7a5" strokeWidth="2" fill="none" opacity=".7">
 <path d="M20 43V22H44M596 22H618V43M20 308V329H44M596 329H618V308"/>
</g>;}
function Cup({x=440,y=209,col='#c9a185',size=1}:{x?:number;y?:number;col?:string;size?:number}){
 return <g transform={`translate(${x},${y}) scale(${size})`}>
  <path d="M-28 -30H28L21 23H-21Z" fill={col} stroke="#f1cba8" strokeWidth="3"/>
  <ellipse cy="-30" rx="28" ry="9" fill="#684f47" stroke="#e9bea0" strokeWidth="3"/>
  <path d="M28 -20Q57 -18 43 12Q37 21 21 14" stroke={col} strokeWidth="10" fill="none"/>
 </g>;
}
function Human({x=282,y=155,arms='open',look='forward',color='#a87568',size=1}:{x?:number;y?:number;arms?:'open'|'fold';look?:'forward'|'away';color?:string;size?:number}){
 return <g transform={`translate(${x},${y}) scale(${size})`}>
  <circle cy="-32" r="28" fill="#dcb191" stroke="#e9c29f" strokeWidth="2"/>
  {look==='away'?<path d="M5 -32Q28 -45 32 -20" fill="none" stroke="#654a40" strokeWidth="5"/>:
  <g fill="#533e38"><circle cx="-9" cy="-34" r="3"/><circle cx="9" cy="-34" r="3"/></g>}
  <path d="M-35 5Q0 -15 34 5L43 110H-43Z" fill={color} stroke="#d5aa91" strokeWidth="3"/>
  {arms==='fold'?<path d="M-39 38L31 69M35 35L-28 71" fill="none" stroke="#d7a788" strokeWidth="16" strokeLinecap="round"/>:
  <path d="M-36 20L-67 89M36 20L67 89" fill="none" stroke="#d5a787" strokeWidth="17" strokeLinecap="round"/>}
 </g>;
}
function Room({cool=false}:{cool?:boolean}){return <g>
 <rect width="640" height="350" fill={cool?'#283641':'#3b3438'}/>
 <path d="M0 275H640V350H0Z" fill="#242a33"/>
 <rect x="39" y="38" width="175" height="159" rx="4" fill="#4c6671" stroke="#abb8b9" strokeWidth="5"/>
 <path d="M124 38V197M39 122H213" stroke="#becacc" strokeWidth="4" opacity=".8"/>
 <path d="M0 274H640" stroke="#c39c7c" strokeOpacity=".46" strokeWidth="3"/>
 <rect x="331" y="208" width="226" height="22" fill="#948173"/>
 <path d="M351 230V300M533 230V300" stroke="#8b7266" strokeWidth="12"/>
 </g>;}
function Letter({x=440,y=178}:{x?:number;y?:number}){return <g transform={`translate(${x},${y})`}>
 <rect x="-48" y="-33" width="96" height="67" rx="4" fill="#e6d0b7" stroke="#a78b79" strokeWidth="3"/>
 <path d="M-40 -23L0 3L40 -23M-40 22L-12 4M40 22L12 4" fill="none" stroke="#ab8d79" strokeWidth="2"/>
 </g>;}
function MainArt({id,take}:{id:NewId;take:Take}){
 const b=take===1;
 switch(id){
 case 'story':return <g><Room/><Cup x={455} y={198} size={.72}/>
   <path d="M260 272Q269 230 285 220" stroke="#c9ac90" strokeWidth="4" strokeDasharray="6 8" fill="none"/>
   <path d="M231 216L249 195L266 208L257 219L242 216L235 224Z" fill="#c3b591" stroke="#e1cb9a" strokeWidth="3"/>
   {b?<g><rect x="366" y="96" width="177" height="80" rx="5" fill="#54463e" stroke="#cfad8f" strokeWidth="4"/><Letter x={455} y={131}/><path d="M405 99V84H505V99" stroke="#d9b99f" strokeWidth="7" fill="none"/></g>:
    <text x="367" y="146" fill="#edcaaa" fontFamily="monospace" fontSize="17">WHAT DOES IT OPEN?</text>}
   <text x="32" y="326" fill="#e8c7a7" fontFamily="monospace" fontSize="14">{b?'THE KEY HAS A PURPOSE':'THE KEY IS MISSING'}</text>
 </g>;
 case 'script':return <g><rect width="640" height="350" fill="#222d37"/>
   {b?<g><Room cool/><Human x={270} y={145} size={.75} look="away" arms="fold"/><Letter x={460} y={192}/>
     <path d="M342 182L396 196" stroke="#e9c29f" strokeWidth="12" strokeLinecap="round"/>
     <text x="28" y="326" fill="#f1d1b0" fontFamily="monospace" fontSize="14">VISIBLE: FOLDS AND HIDES LETTER</text></g>:
     <g><rect x="91" y="44" width="458" height="254" rx="9" fill="#e2d0b9"/><path d="M146 113H490M146 147H436M146 181H489M146 215H356" stroke="#a4a09a" strokeWidth="7" opacity=".7"/>
      <text x="146" y="96" fontSize="21" fontFamily="monospace" fill="#4a4143">INT. ROOM — DAY</text>
      <text x="146" y="273" fontSize="23" fontWeight="bold" fill="#564a44">He feels uneasy.</text></g>}
 </g>;
 case 'acting':return <g><Room cool/><Human x={310} y={153} size={1.2} arms={b?'fold':'open'} look={b?'away':'forward'} color={b?'#6f6377':'#a77868'}/>
  <rect x="405" y="59" width="194" height="57" rx="9" fill="#eee2d0"/>
  <text x="424" y="97" fontSize="21" fill="#313943" fontWeight="700">“I am here.”</text>
  <text x="27" y="327" fill="#efc8a9" fontFamily="monospace" fontSize="14">{b?'GUARDED POSTURE':'OPEN POSTURE'}</text>
 </g>;
 case 'character':return <g><rect width="640" height="350" fill="#26343f"/>
    <rect x="370" y="42" width="183" height="250" fill="#59473f" stroke="#d2aa88" strokeWidth="9"/>
    <rect x="391" y="62" width="145" height="223" fill={b?'#56484a':'#657d7d'}/>
    <circle cx="503" cy="190" r="9" fill="#e6c198"/>
    {b?<g><rect x="432" y="147" width="50" height="44" rx="4" fill="#c89f71"/><path d="M443 147V137Q457 116 471 137V147" fill="none" stroke="#e3c49e" strokeWidth="6"/>
    <rect x="407" y="98" width="112" height="30" rx="3" fill="#e4c8a2"/><text x="427" y="119" fontSize="18" fill="#402e2c" fontWeight="700">CLOSED</text></g>:<path d="M392 65L474 72L474 280L392 282Z" fill="#1c3643" opacity=".7"/>}
    <Human x={204} y={161} size={.87} color="#a97869"/>
    <path d="M255 294Q309 265 356 285" stroke="#e2bc90" strokeWidth="4" strokeDasharray="8 7" fill="none"/>
    <text x="30" y="329" fill="#f1cbaa" fontFamily="monospace" fontSize="14">{b?'OBSTACLE: LOCKED DOOR':'GOAL: REACH THE EXIT'}</text>
 </g>;
 case 'dialogue':return <g><Room/><Human x={306} y={148} size={1.08} look={b?'away':'forward'} arms={b?'fold':'open'} />
    <rect x="404" y="46" width="182" height="62" rx="8" fill="#eee0cb"/><text x="422" y="87" fontSize="22" fill="#3a3332">“I'm fine.”</text>
    {b?<Letter x={477} y={242}/>:null}
    <text x="27" y="328" fill="#f2c7aa" fontFamily="monospace" fontSize="14">{b?'AVERTED GAZE + HIDDEN LETTER':'DIRECT EYE CONTACT'}</text>
 </g>;
 case 'camera':return <g>
    <rect width="640" height="350" fill={b?'#23313c':'#35404b'}/>
    <path d={b?'M0 302L318 251L640 302':'M0 262H640'} stroke="#b1a296" strokeWidth="6"/>
    <path d={b?'M0 45L320 15L640 45':'M0 52H640'} stroke="#718c94" strokeWidth="6"/>
    {b?<g><path d="M0 302L320 250L640 302V350H0Z" fill="#4c5c60"/><path d="M100 24L320 3L537 24" stroke="#9fadaf" fill="none" strokeWidth="5"/></g>:
     <path d="M0 263H640V350H0Z" fill="#27313b"/>}
    <Human x={320} y={b?115:139} size={b?1.37:1.0} color="#ab7770"/>
    <path d={b?'M15 319L320 265L624 319':'M15 281H624'} stroke="#d8ae85" strokeDasharray="9 7" strokeWidth="3"/>
    <text x="25" y="331" fill="#f2caa6" fontSize="14" fontFamily="monospace">{b?'LOWER VIEW / UPWARD LINES':'EYE-LEVEL VIEW'}</text>
  </g>;
 case 'movement':return <g><rect width="640" height="350" fill="#24313c"/>
    <path d="M34 30H600V284H34Z" fill="none" stroke="#9caaad" strokeWidth="4"/>
    <rect x="430" y="69" width="117" height="80" rx="3" fill="#596d75"/>
    <rect x="193" y="171" width="70" height="63" rx="4" fill="#947867"/>
    <circle cx="245" cy="102" r="23" fill="#ba987c"/>
    {b?<g><g fill="#ddbd96" stroke="#eac69e" strokeWidth="2">
       <path d="M110 271l18 -24 18 24 -5 21h-26Z"/><path d="M292 271l18 -24 18 24 -5 21h-26Z"/></g>
       <path d="M128 266H310" stroke="#ecc394" strokeWidth="4" strokeDasharray="9 5"/>
       <path d="M294 258l17 8 -17 8" stroke="#ecc394" strokeWidth="4" fill="none"/>
       <path d="M128 246L246 102M310 246L246 102" stroke="#c9a67b" strokeOpacity=".7" strokeWidth="3" strokeDasharray="6 6"/>
    </g>:<g>
      <path d="M185 272l21 -27 21 27 -6 23h-29Z" fill="#e3c195" stroke="#f5d6a9" strokeWidth="3"/>
      <path d="M208 248L177 152M208 248L360 157" stroke="#c2a078" strokeWidth="3" strokeDasharray="7 6"/>
      <path d="M171 174Q209 130 269 151" stroke="#f3c7a0" strokeWidth="5" fill="none"/>
      <path d="M253 140l20 10 -17 13" fill="none" stroke="#f3c7a0" strokeWidth="4"/>
    </g>}
    <text x="27" y="329" fill="#edc8aa" fontFamily="monospace" fontSize="14">{b?'TRACK: TWO CAMERA POSITIONS':'PAN: ONE CAMERA POSITION'}</text>
  </g>;
 case 'lenses':return <g><rect width="640" height="350" fill="#25323d"/>
    <path d="M0 261H640V350H0Z" fill="#28353a"/>
    <path d="M0 260H640" stroke="#ad987d" strokeWidth="3"/>
    <circle cx={b?255:247} cy="121" r={b?38:53} fill="#748c91" stroke="#b5b6ad" strokeWidth="4"/>
    <circle cx={b?438:418} cy={b?133:144} r={b?42:20} fill="#c39b7b" stroke="#e5c6a9" strokeWidth="3"/>
    <path d="M139 271l21 -25 21 25 -4 18h-34Z" fill="#d4ae91"/>
    <path d="M159 248V211M159 211L223 163M159 211L81 165" stroke="#e6ba8f" strokeWidth="3" strokeDasharray="6 6"/>
    <path d={b?'M159 292H318':'M159 292H234'} stroke="#aab5b8" strokeWidth="6" strokeDasharray="7 7"/>
    <text x="26" y="331" fill="#ebcbab" fontFamily="monospace" fontSize="14">{b?'CAMERA MOVED / NEW PERSPECTIVE':'CAMERA FIXED / FIELD OF VIEW CROPPED'}</text>
  </g>;
 case 'music':return <g><Room cool/><Human x={264} y={163} size={.65} color="#87767c"/>
   <path d="M0 295H640V350H0Z" fill="#1f2630"/>
   <text x="29" y="326" fill="#ead0b2" fontFamily="monospace" fontSize="14">PICTURE LOCKED / IMAGINED SCORE ONLY</text>
  </g>;
 case 'editing':{
   const order=b?['cup','hand','wide']:['wide','hand','cup'];
   return <g><rect width="640" height="350" fill="#1e2933"/>
     {order.map((kind,i)=>{
       const x=23+i*205;
       return <g key={kind}><rect x={x} y="56" width="185" height="212" rx="6" fill="#354550" stroke="#c6a888" strokeWidth="3"/>
         {kind==='wide'?<g><rect x={x+23} y="82" width="59" height="90" fill="#637c82"/><path d={`M${x+15} 207H${x+169}`} stroke="#b8a58e" strokeWidth="5"/><Cup x={x+118} y={193} size={.65}/></g>:
           kind==='hand'?<g><path d={`M${x-8} 197Q${x+59} 155 ${x+104} 139`} stroke="#d7aa8d" strokeWidth="24" fill="none" strokeLinecap="round"/><Cup x={x+137} y={190} size={.76}/></g>:
             <Cup x={x+94} y={172} size={1.64}/>}
         <text x={x+93} y="293" textAnchor="middle" fill="#ebc5a3" fontFamily="monospace" fontSize="14">{kind.toUpperCase()}</text>
       </g>;
     })}
     <text x="27" y="329" fill="#ead0b2" fontFamily="monospace" fontSize="14">{b?'DETAIL FIRST / CONTEXT LAST':'PLACE FIRST / DETAIL LAST'}</text>
   </g>;
 }
 }
}
export function TenVisualFrame({id,take}:{id:NewId;take:Take}){
 return <svg viewBox="0 0 640 350" className="vl-illustration" data-ten-visual={id}
   aria-hidden="true" focusable="false">
  <MainArt id={id} take={take}/><Corners/>
 </svg>;
}
