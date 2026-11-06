import type {LabName} from '../legacy/bridge';

type LabCard={id:LabName;title:string;line:string;note:string;icon:'story'|'frame'|'light'|'cut'|'sound'|'colour'|'continuity'};
/** These are existing React-owned production labs. No fake copies or new storage. */
const LABS:readonly LabCard[]=[
 {id:'story',title:'Make a scene',line:'Turn a moment into a shot plan',note:'Real storyboard projects',icon:'story'},
 {id:'frame',title:'Frame',line:'Work with shot size and guides',note:'Real framing controls',icon:'frame'},
 {id:'light',title:'Lighting',line:'Explore light direction and softness',note:'Real lighting workshop',icon:'light'},
 {id:'cut',title:'Cut',line:'Reorder and time your shots',note:'Working timed storyboard',icon:'cut'},
 {id:'sound',title:'Sound',line:'Build a sound environment',note:'Real sound lab',icon:'sound'},
 {id:'colour',title:'Colour',line:'Compare looks with intention',note:'Real colour controls',icon:'colour'},
 {id:'continuity',title:'Continuity',line:'Make separate shots connect',note:'Real continuity workshop',icon:'continuity'}
];
export const REAL_LAB_IDS:readonly LabName[]=LABS.map(lab=>lab.id);

function LabArtwork({kind,large=false}:{kind:LabCard['icon'];large?:boolean}){
 const value=kind==='story'?0:kind==='frame'?1:kind==='light'?2:kind==='cut'?3:kind==='sound'?4:kind==='colour'?5:6;
 return <svg className="real-lab-art" viewBox={large?'0 0 315 146':'0 0 130 96'}
   aria-hidden="true" focusable="false">
   <defs>
     <linearGradient id={'rl-bg-'+kind} x1="0" y1="0" x2="1" y2="1">
       <stop stopColor="#e6f9ed"/><stop offset="1" stopColor="#cdeceb"/>
     </linearGradient>
   </defs>
   <rect width={large?315:130} height={large?146:96} rx="16" fill={'url(#rl-bg-'+kind+')'}/>
   <g transform={large?'translate(31 17) scale(1.2)':'translate(9 7) scale(.78)'}>
     <rect x="10" y="8" width="116" height="84" rx="11" fill="#f9fff9" stroke="#9dcbbf" strokeWidth="3"/>
     <rect x="21" y="22" width="94" height="58" rx="8" fill="#c5e6df"/>
     <path d="M21 66Q46 41 74 69T115 63V80H21Z" fill="#85c9b0"/>
     <circle cx="89" cy="37" r="12" fill="#f6cc81"/>
     <circle cx="58" cy="47" r="11" fill="#f3be87" stroke="#b28b69" strokeWidth="2"/>
     <path d="M43 83Q54 56 71 83" fill="#406e82"/>
     {value===1&&<><path d="M21 41h94M52 22v58M84 22v58" stroke="#fff" strokeDasharray="3 5" strokeWidth="2"/></>}
     {value===2&&<><path d="M96 21L63 72" stroke="#fff3a5" strokeWidth="13" opacity=".8"/><circle cx="105" cy="17" r="12" fill="#ffc96f"/></>}
     {value===3&&<><path d="M24 91h23m6 0h33m7 0h20" stroke="#3e9684" strokeWidth="9" strokeLinecap="round"/></>}
     {value===4&&<path d="M19 97v-13m9 13V72m9 25V81m9 16V66m9 31V82m9 15V71m9 26V87"
       stroke="#3d948b" strokeWidth="4" strokeLinecap="round"/>}
     {value===5&&<><rect x="21" y="22" width="94" height="58" rx="8" fill="#e5a282" opacity=".23"/><circle cx="107" cy="74" r="8" fill="#ea9e91"/></>}
     {value===6&&<><rect x="28" y="28" width="33" height="26" rx="3" stroke="#fff" strokeWidth="3" fill="none"/><rect x="73" y="28" width="33" height="26" rx="3" stroke="#fff" strokeWidth="3" fill="none"/></>}
     {value===0&&<><path d="M137 21h38M137 36h49M137 51h30M137 66h42"
       stroke="#8ec5b4" strokeWidth="6" strokeLinecap="round"/><rect x="136" y="80" width="50" height="18" rx="7" fill="#f5d18a"/></>}
   </g>
   {large&&<g transform="translate(207 29)">
     <rect x="0" y="0" width="86" height="90" rx="13" fill="#fff" stroke="#b1dad1" strokeWidth="2"/>
     <text x="12" y="19" fill="#2b856f" fontWeight="850" fontSize="9">SHOT LIST</text>
     <rect x="11" y="30" width="18" height="16" rx="3" fill="#e3f5e7"/>
     <path d="M38 36h35M38 43h25" stroke="#b4d9cc" strokeWidth="5" strokeLinecap="round"/>
     <rect x="11" y="54" width="18" height="16" rx="3" fill="#e3f5e7"/>
     <path d="M38 60h35M38 67h25" stroke="#b4d9cc" strokeWidth="5" strokeLinecap="round"/>
     <path d="M12 79h62" stroke="#e7f1ea" strokeWidth="3"/>
   </g>}
 </svg>;
}

export function OptionBRealLabs({onOpen,onBack}:{
 onOpen:(lab:LabName)=>void;onBack:()=>void;
}){
 const primary=LABS[0];
 return <div className="screen real-labs-screen" data-v2-real-labs-screen>
   <div className="real-labs-intro">
     <button type="button" className="foundation-return" data-v2-real-labs-back onClick={onBack}>
       ← Back to your chapter
     </button>
     <span className="eyebrow">YOUR CREATIVE STUDIO</span>
     <h1>Don't just learn film. Make it.</h1>
     <p>Seven real Frame One labs. Pick a craft and continue with its working tools and saved work.</p>
   </div>
   <div className="real-labs-collection">
     <button type="button" className="real-labs-featured" data-v2-real-lab="story"
       onClick={()=>onOpen(primary.id)}>
       <div className="real-labs-featured-head"><span>✦ START MAKING</span><span className="real-labs-open-arrow" aria-hidden="true">↗</span></div>
       <LabArtwork kind="story" large/>
       <div className="real-labs-featured-copy">
         <strong>Make a scene</strong><span>Build a real shot plan, keep multiple storyboard projects and export a shot list.</span>
       </div>
       <span className="real-labs-featured-footer">OPEN YOUR WORKING MAKE LAB <span aria-hidden="true">→</span></span>
     </button>
     <div className="real-labs-divider"><span className="eyebrow">THE FILMMAKER'S TOOLBOX</span><span>6 MORE LABS</span></div>
     <div className="real-labs-grid">
       {LABS.slice(1).map(lab=><button type="button" key={lab.id} className="real-lab-card"
         data-v2-real-lab={lab.id} aria-label={'Open the real '+lab.title+' lab'}
         onClick={()=>onOpen(lab.id)}>
         <div className="real-lab-card-art"><LabArtwork kind={lab.icon}/></div>
         <div className="real-lab-card-copy"><strong>{lab.title}</strong><span>{lab.line}</span></div>
         <span className="real-lab-card-open">OPEN REAL LAB <span aria-hidden="true">↗</span></span>
       </button>)}
     </div>
   </div>
   <div className="real-labs-integrity" role="note">
     <span className="real-labs-integrity-icon" aria-hidden="true">✓</span>
     These open the actual seven production labs, not demo copies. Your existing storyboards, notes and backups stay in the original Frame One app.
   </div>
 </div>;
}
