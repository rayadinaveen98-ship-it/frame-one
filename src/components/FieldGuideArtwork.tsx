import type {FieldId} from '../data/visual-field-guide';
type Phase=0|1|2;
function Markers(){return <g fill="none" stroke="#eed1b1" strokeWidth="2" strokeOpacity=".7">
 <path d="M20 43V20H43M598 20H620V43M20 309V330H43M598 330H620V309"/>
</g>;}
function Person({x=290,y=220,small=false}:{x?:number;y?:number;small?:boolean}){
 return <g transform={`translate(${x} ${y}) scale(${small?.67:1})`}>
  <circle cy="-76" r="27" fill="#d8ae91"/>
  <path d="M-39 -38Q0 -56 39 -38L46 59H-44Z" fill="#917b7a" stroke="#bea58f" strokeWidth="3"/>
  <path d="M-19 60L-30 110M20 60L29 110" stroke="#665b62" strokeWidth="13" strokeLinecap="round"/>
 </g>;}
function Cup({x=370,y=235,size=1}:{x?:number;y?:number;size?:number}){
 return <g transform={`translate(${x} ${y}) scale(${size})`}>
  <path d="M-34 -43H34L26 29H-25Z" fill="#c09b7d" stroke="#e7bd9a" strokeWidth="4"/>
  <ellipse cy="-43" rx="34" ry="11" fill="#594844" stroke="#e8bfa2" strokeWidth="4"/>
  <path d="M34 -29Q67 -18 45 15L26 16" fill="none" stroke="#c09b7d" strokeWidth="12"/>
 </g>;}
function Phone({x=350,y=124,message=false}:{x?:number;y?:number;message?:boolean}){
 return <g transform={`translate(${x} ${y})`}>
  <rect x="-48" y="-76" width="96" height="165" rx="13" fill="#131d2b" stroke="#d8ae8e" strokeWidth="6"/>
  <rect x="-38" y="-60" width="76" height="124" rx="4" fill={message?'#496275':'#333f4d'}/>
  {message?<g><rect x="-28" y="-29" width="55" height="27" rx="6" fill="#c6a081"/>
    <path d="M-23 15H20M-23 30H9" stroke="#dae0d6" strokeWidth="4"/></g>:
    <circle cx="0" cy="5" r="19" fill="#8f8279"/>}
  <circle cy="76" r="5" fill="#c7b2a0"/>
 </g>;}
function Note({x=360,y=155,small=false}:{x?:number;y?:number;small?:boolean}){
 return <g transform={`translate(${x} ${y}) scale(${small?.63:1})`}>
  <rect x="-97" y="-85" width="194" height="168" rx="8" fill="#dac5ac" stroke="#f0d5b3" strokeWidth="5"/>
  <path d="M-65 -42H65M-65 -15H35M-65 13H64M-65 41H6" stroke="#938677" strokeWidth="6" strokeLinecap="round"/>
 </g>;}
function Camera({x=200,y=190}:{x?:number;y?:number}){
 return <g transform={`translate(${x} ${y})`}>
  <rect x="-73" y="-45" width="132" height="82" rx="12" fill="#a59086" stroke="#e0b99b" strokeWidth="5"/>
  <circle cx="-3" cy="-4" r="29" fill="#343e4b" stroke="#e1c3a6" strokeWidth="9"/>
  <path d="M60 -29L97 -48V44L60 24Z" fill="#c6a389"/>
  <path d="M-8 40V101M-8 101L-55 139M-8 101L45 139" stroke="#d4b296" strokeWidth="8"/>
 </g>;}
function Strip({frames=3,shift=0}:{frames?:number;shift?:number}){
 return <g>
 {Array.from({length:frames},(_,i)=>{
  const w=510/frames,x=65+i*w;
  return <g key={i}><rect x={x+4} y="100" width={w-8} height="146" rx="5"
    fill={i===shift?'#8c776b':'#485664'} stroke="#cfad91" strokeWidth="3"/>
   <circle cx={x+w*.5} cy="157" r="18" fill={i===shift?'#ead0b7':'#a7a5a1'}/>
   <path d={`M${x+15} 211L${x+w*.4} 174L${x+w*.65} 205L${x+w-18} 181`} fill="none" stroke="#bda78e" strokeWidth="6"/>
   <text x={x+w*.5} y="265" fontSize="13" textAnchor="middle" fill="#dfc6ab" fontFamily="monospace">0{i+1}</text>
  </g>
 })}
 </g>;
}
function Ribbon({items,selected}:{items:readonly string[];selected:Phase}){
 return <g>{items.map((label,i)=>{const x=52+i*186,active=i===selected;
 return <g key={i}><rect x={x} y="119" width="164" height="120" rx="10"
    fill={active?'#766053':'#3b4853'} stroke={active?'#edc39d':'#809097'} strokeWidth={active?5:2}/>
   <text x={x+82} y="173" fill={active?'#fff0dd':'#b8c6c4'} fontSize={label.length>13?12:16}
    fontFamily="system-ui" fontWeight="700" textAnchor="middle">{label}</text>
   <circle cx={x+82} cy="206" r={active?11:7} fill={active?'#f0cba5':'#899a9e'}/>
  </g>})}</g>;
}
export function FieldArtwork({id,phase}:{id:FieldId;phase:Phase}){
 const a=phase===0,b=phase===1,c=phase===2;
 return <svg className="fg-art" viewBox="0 0 640 350" data-field-illustration={id}
  aria-hidden="true" focusable="false">
  <rect width="640" height="350" fill="#23313d"/>
  <rect x="0" y="299" width="640" height="51" fill="#17232d"/>
  {id==='why'?<g>
    <path d="M0 267H640" stroke="#b9a087" strokeWidth="4"/>
    <rect x="49" y="38" width="168" height="184" fill="#476371" stroke="#aac4c2" strokeWidth="6"/>
    <path d="M133 38V222M49 130H217" stroke="#b8c8c6" strokeWidth="5"/>
    <Person x={322} y={204} small/>
    <path d="M396 265H523M430 263V299M497 263V299" stroke="#d6b499" strokeWidth="9"/>
    {b?<g><path d="M435 214L475 194L515 214" fill="none" stroke="#ecb991" strokeWidth="4"/>
      <path d="M475 192V266" stroke="#e2c9ac" strokeWidth="4" strokeDasharray="7 8"/></g>:null}
    {c?<g><circle cx="466" cy="96" r="53" fill="#dbc19e" stroke="#f0d7b6" strokeWidth="7"/>
      <path d="M466 58V96L490 114" stroke="#514641" strokeWidth="7" fill="none"/></g>:null}
  </g>:null}
  {id==='history'?<g>
    {a?<g><circle cx="319" cy="157" r="110" fill="#574e4c" stroke="#edc39c" strokeWidth="12"/>
      {Array.from({length:8},(_,i)=><g key={i} transform={`rotate(${i*45} 319 157)`}>
       <path d="M319 60V93" stroke="#c9ac8d" strokeWidth="10"/></g>)}
      <circle cx="319" cy="157" r="32" fill="#bda183"/></g>:b?<g>
        <Camera x={180} y={155}/><path d="M294 124L488 70L488 249L294 198Z" fill="#e4c39d" opacity=".24"/>
        <rect x="479" y="61" width="127" height="200" fill="#dac4aa" stroke="#f4d9b6" strokeWidth="6"/>
        <path d="M494 214L530 160L557 208L592 145" stroke="#897b70" strokeWidth="8" fill="none"/></g>:<g><Strip shift={2}/><text x="320" y="78" fill="#f0d2ae" fontSize="22" textAnchor="middle">FROM RECORDING TO STORY</text></g>}
  </g>:null}
  {id==='genres'?<g>
    <rect x="51" y="232" width="537" height="22" fill="#957f72"/>
    <Phone x={315} y={a?141:155} message={c}/>
    {a?<text x="318" y="67" fill="#edd0b2" textAnchor="middle" fontSize="24">WHERE IS THE PHONE?</text>:null}
    {b?<g><path d="M370 77Q444 65 479 121" fill="none" stroke="#efc5a1" strokeWidth="7"/>
      <path d="M467 111L479 124L489 109" fill="none" stroke="#efc5a1" strokeWidth="5"/>
      <text x="455" y="161" fill="#e7c5a6" fontSize="18">IN POCKET!</text></g>:null}
    {c?<g><text x="480" y="84" fill="#eed3b1" fontSize="20">UNKNOWN</text>
      <text x="480" y="108" fill="#eed3b1" fontSize="20">SENDER</text></g>:null}
  </g>:null}
  {id==='india'?<g>
    <Ribbon items={['1896 / SCREEN','1912–13 / FILMS','MANY LANGUAGES']} selected={phase}/>
    {b?<text x="317" y="82" fill="#efcdaa" fontSize="18" textAnchor="middle">TWO EARLY MILESTONES · HISTORY DEBATED</text>:null}
    {c?<g>{['తెలుగు','हिन्दी','தமிழ்'].map((word,i)=><text key={word} x={140+i*186} y="83"
      fill="#d6c4b3" fontSize="17" textAnchor="middle">{word}</text>)}</g>:null}
  </g>:null}
  {id==='sound'?<g>
    <rect x="51" y="58" width="197" height="170" fill="#4d6571" stroke="#bdd0d2" strokeWidth="6"/>
    <path d="M149 59V226" stroke="#c0cdcf" strokeWidth="5"/>
    <Person x={333} y={199} small/><Phone x={470} y={174}/>
    {b?<g>{[42,68,94].map(r=><circle key={r} cx="144" cy="148" r={r} stroke="#e5c39f" strokeWidth="3"
      fill="none" opacity=".75"/>)}</g>:null}
    {c?<g>{[24,43,63].map(r=><circle key={r} cx="470" cy="164" r={r} stroke="#f2c38d"
      strokeWidth="3" fill="none" opacity=".75"/>)}</g>:null}
  </g>:null}
  {id==='crew'?<g>
    {a?<g><rect x="63" y="93" width="202" height="176" fill="#4a6572" stroke="#e0bb9a" strokeWidth="6"/>
      <Cup x={398} y={218} size={1.12}/><path d="M323 255H546" stroke="#bca58e" strokeWidth="11"/></g>:null}
    {b?<g><Person x={350} y={173} small/><Camera x={169} y={166}/>
      <path d="M480 65L412 179L548 179Z" fill="#edc9a1" opacity=".27"/></g>:null}
    {c?<g><Strip shift={1}/><path d="M62 283H580" stroke="#e6ae86" strokeWidth="6"/></g>:null}
  </g>:null}
  {id==='craft24'?<g>
    {a?<g><rect x="186" y="82" width="267" height="172" rx="16" fill="#514943" stroke="#e3ba95" strokeWidth="5"/>
      <text x="319" y="170" fill="#f8dfbc" textAnchor="middle" fontSize="59" fontWeight="800">24</text>
      <text x="319" y="202" fill="#e3c8ad" textAnchor="middle" fontSize="17">INDUSTRY EXPRESSION</text></g>:null}
    {b?<g>{['SET','LIGHT','SOUND','EDIT','COSTUME','TRANSPORT'].map((x,i)=><g key={x}>
      <rect x={45+(i%3)*199} y={53+Math.floor(i/3)*115} width="174" height="83" rx="10" fill="#4d5660" stroke="#c9a68b" strokeWidth="3"/>
      <text x={132+(i%3)*199} y={101+Math.floor(i/3)*115} textAnchor="middle" fill="#eaceaf" fontSize="17">{x}</text>
    </g>)}</g>:null}
    {c?<g><circle cx="182" cy="149" r="55" fill="#a98b75"/><circle cx="440" cy="149" r="55" fill="#a98b75"/>
      <path d="M240 150H380" stroke="#f3c49b" strokeWidth="7" strokeDasharray="10 8"/>
      <text x="182" y="158" textAnchor="middle" fontSize="15" fill="#26313b">SMALL</text>
      <text x="440" y="158" textAnchor="middle" fontSize="15" fill="#26313b">LARGE</text>
      {[0,1,2,3,4].map(i=><circle key={i} cx={367+i*33} cy="247" r="10" fill="#c8a890"/>)}</g>:null}
  </g>:null}
  {id==='teams'?<g>
    {a?<Note x={320} y={177}/>:null}
    {b?<g><Cup x={305} y={196}/><Person x={480} y={194} small/>
      <path d="M70 258H576" stroke="#b9977c" strokeWidth="9"/></g>:null}
    {c?<g><Strip shift={1}/><path d="M65 286Q96 275 119 287Q145 301 171 283Q197 271 225 285Q262 300 294 283Q328 270 361 289Q408 306 440 280Q476 271 508 287L575 287"
      stroke="#e5c3a5" strokeWidth="4" fill="none"/></g>:null}
  </g>:null}
  {id==='pipeline'?<Ribbon items={['DEVELOP + PLAN','RECORD','FINISH + SHARE']} selected={phase}/>:null}
  {id==='making'?<g>{a?<Note x={320} y={173}/>:b?<g><Camera x={230} y={164}/><Person x={453} y={172} small/></g>:
    <g><Strip shift={1}/><path d="M283 64L283 91L322 76Z" fill="#f1c8a3"/></g>}</g>:null}
  {id==='shotlist'?<g>
    <rect x="72" y="55" width="495" height="226" rx="9" fill="#d0b99e" stroke="#f3d5b3" strokeWidth="4"/>
    <text x="105" y="101" fill="#503e36" fontSize="23" fontWeight="750">PHONE SCENE / SHOT LIST</text>
    {[0,1,2].map(i=><g key={i}><rect x="104" y={124+i*50} width="420" height="39" rx="5"
     fill={i===phase?'#90664f':'#bda68d'}/>
     <text x="121" y={150+i*50} fill={i===phase?'#fff1db':'#554438'} fontSize="18">
      {['01  WIDE   /  PLACE','02  DETAIL /  ACTION','03  INSERT /  NOTE'][i]}</text>
    </g>)}
  </g>:null}
  {id==='shootscene'?<g>{a?<g><Note x={324} y={174} small/><path d="M387 162l29 32 48 -64" stroke="#bfe0b4" strokeWidth="11" fill="none"/></g>:
    b?<g><Camera x={259} y={172}/><circle cx="482" cy="150" r="32" fill="#e58f76"/>
      <circle cx="482" cy="150" r="18" fill="#f3c5b2"/></g>:
    <g><Strip shift={2}/><path d="M481 58l25 24 53 -59" stroke="#b9dbb3" strokeWidth="11" fill="none"/></g>}</g>:null}
  {id==='editminute'?<g>
    {a?<Strip frames={4} shift={3}/>:b?<g><Strip frames={3} shift={1}/><path d="M70 285H571" stroke="#e2b38d" strokeWidth="4"/></g>:
    <g><Strip frames={3} shift={2}/><path d="M65 287Q96 277 123 290Q154 309 182 282Q218 269 246 286Q284 307 316 280Q354 273 385 292Q417 310 448 284Q476 269 510 286L575 286"
    stroke="#e6c5a3" strokeWidth="5" fill="none"/></g>}
  </g>:null}
  {id==='review'?<g>{a?<g><rect x="145" y="72" width="350" height="186" rx="8" fill="#495866" stroke="#e3b999" strokeWidth="6"/>
    <path d="M295 123L295 207L374 165Z" fill="#eed0b0"/></g>:
    b?<g><Person x={235} y={179} small/><rect x="330" y="78" width="224" height="102" rx="18" fill="#dfc9b0"/>
      <path d="M390 176L378 215L435 176" fill="#dfc9b0"/><text x="361" y="137" fill="#4c4140" fontSize="38">?</text></g>:
    <g><Strip shift={1}/><path d="M443 61l25 23 44 -50" fill="none" stroke="#b9d6b1" strokeWidth="10"/></g>}
  </g>:null}
  <Markers/>
  <text x="26" y="327" fill="#f0d2b3" fontFamily="monospace" fontSize="14">
    {String(phase+1).padStart(2,'0')} / 03  •  {id.toUpperCase()}
  </text>
 </svg>;
}
