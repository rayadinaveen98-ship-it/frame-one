import {useState} from 'react';
import './crew-decision-studio.css';

/** A compact visual-first exercise within Meet Film Roles. The role choices
 * show collaboration and trade-offs, not a universal production hierarchy.
 * Session state only: no course progress, permissions, or backup changes.
 */
type Role='direction'|'camera'|'sound'|'editing';
type ProblemId='face'|'dialogue'|'reaction';
type Problem={
  id:ProblemId;
  title:string;
  situation:string;
  question:string;
  cue:string;
  notes:Record<Role,string>;
  partnership:string;
};
const roles:readonly {id:Role;label:string}[]=[
  {id:'direction',label:'Direction'},
  {id:'camera',label:'Camera + lighting'},
  {id:'sound',label:'Location sound'},
  {id:'editing',label:'Editing'}
];
const problems:readonly Problem[]=[
  {
    id:'face',title:'A face lost in shadow',
    situation:'A character stands against a bright window. We cannot see their small reaction.',
    question:'Which team conversation would you begin, and what would you ask them to try?',
    cue:'The expression is hard to read',
    notes:{
      direction:'Start by deciding whether the audience really needs to see the expression. Agree on the story intention with the actor and cinematographer before adding light.',
      camera:'The cinematographer and lighting crew can test exposure, angle and controlled fill. Protect window detail while keeping the important parts of the face visible.',
      sound:'Sound can help make an unheard reaction meaningful, but audio alone will not restore missing visual detail. Work with the director on what must be readable.',
      editing:'A different shot or longer hold might reveal the reaction in the final cut—if that coverage was captured. The editor cannot recover facial detail that was never recorded.'
    },
    partnership:'Direction + cinematography + acting decide what the audience should notice before committing to a lighting setup.'
  },
  {
    id:'dialogue',title:'The line disappears',
    situation:'A quiet conversation happens near a busy street. The important line is difficult to hear.',
    question:'How would you protect the performance and keep the environment believable?',
    cue:'Traffic masks an important line',
    notes:{
      direction:'The director can arrange a pause, alternate blocking or another usable take with the actors while coordinating with sound and production.',
      camera:'Camera placement and framing affect where the microphone can go. Collaborate with the sound team to keep a useful mic position out of shot.',
      sound:'The location sound team can move the microphone closer, check levels and record room tone. Audio editing may help later, but clean recording is the safest starting point.',
      editing:'Editing can select a cleaner take if one exists. Sound post may shape the mix, but relying on repair instead of capture risks losing the performance.'
    },
    partnership:'Sound + direction + camera need a shared plan for the dialogue, frame and microphone position.'
  },
  {
    id:'reaction',title:'The moment arrives too late',
    situation:'The actor reacts, but the edit cuts away before the audience notices the change.',
    question:'Who could help make the turning point readable without explaining it in dialogue?',
    cue:'The reaction gets lost at the cut',
    notes:{
      direction:'The director can clarify which emotional beat matters and coordinate performance and coverage so an editor has a usable choice later.',
      camera:'A closer composition or a longer recorded hold might preserve a subtle performance. Avoid assuming a close-up automatically produces emotion.',
      sound:'An intentional quiet moment, breath or environmental cue might invite attention to the change. Sound is one part of the scene, not a substitute for readable timing.',
      editing:'Try holding the reaction before cutting or choosing different coverage. The timing can guide attention, but the performer and context still shape the meaning.'
    },
    partnership:'Editing + direction + acting can compare the recorded takes and choose where the reaction has room to register.'
  }
];

function CrewDiagram({selected,cue}:{selected:Role|null;cue:string}){
  const lit=(role:Role)=>selected===role;
  const stroke=(role:Role)=>lit(role)?'#f6c294':'#82929b';
  const fill=(role:Role)=>lit(role)?'#5d493d':'#34434c';
  return <svg className="crew-decision-art" viewBox="0 0 640 330" role="img"
    aria-label={`Original illustrated film set. Selected department: ${selected?roles.find(r=>r.id===selected)?.label:'none yet'}. Issue: ${cue}.`}>
    <rect width="640" height="330" rx="17" fill="#16232d"/>
    <rect x="29" y="40" width="582" height="232" rx="10" fill="#253746" stroke="#667c85" strokeWidth="2"/>
    <rect x="77" y="73" width="126" height="152" fill="#8b9ba0" stroke="#c5b9aa" strokeWidth="4"/>
    <path d="M140 73V225M77 148H203" stroke="#d5c1aa" strokeWidth="4"/>
    <path d="M77 225H203L173 252H107Z" fill="#64737b"/>
    <g stroke={stroke('direction')} strokeWidth="3" fill={fill('direction')}>
      <rect x="258" y="63" width="126" height="66" rx="12"/>
      <path d="M277 90H363M289 105H351" fill="none" stroke="#dac8ad" strokeWidth="3"/>
    </g>
    <text x="321" y="82" fontSize="12" fill="#f1dac2" textAnchor="middle">SCENE PLAN</text>
    <g>
      <circle cx="320" cy="182" r="28" fill="#d4a888"/>
      <path d="M284 230Q288 204 320 205Q351 205 356 230L366 263H275Z" fill="#867f82"/>
      <path d="M292 179Q300 174 309 180M332 180Q341 175 349 179" stroke="#64505a" strokeWidth="3" fill="none"/>
    </g>
    <g stroke={stroke('camera')} strokeWidth="4" fill={fill('camera')}>
      <rect x="443" y="153" width="75" height="53" rx="8"/>
      <circle cx="479" cy="179" r="19" fill="#26313b" stroke="#e1c5a9" strokeWidth="5"/>
      <path d="M520 167L554 147V209L520 194Z"/>
      <path d="M477 207V250M477 250L451 267M477 250L503 267" fill="none"/>
    </g>
    <g stroke={stroke('sound')} fill={fill('sound')} strokeWidth="4">
      <rect x="407" y="74" width="79" height="26" rx="13" transform="rotate(14 407 74)"/>
      <path d="M443 102L402 154" fill="none"/>
    </g>
    <g stroke={stroke('editing')} fill={fill('editing')} strokeWidth="3">
      <rect x="45" y="286" width="550" height="28" rx="5"/>
      {[0,1,2,3,4].map(i=><rect key={i} x={55+i*108} y="291" width="96" height="18" rx="3"
        fill={lit('editing')&&i===2?'#ecc093':'#6f838c'} stroke="none"/>)}
    </g>
    <text x="33" y="26" fontSize="12" fill="#f5d7b7" fontWeight="700">ONE SCENE · MANY COLLABORATORS</text>
    <text x="605" y="26" fontSize="11" fill="#b4c3c7" textAnchor="end">ORIGINAL DIAGRAM</text>
  </svg>;
}
export function CrewDecisionStudio(){
  const [problem,setProblem]=useState<ProblemId>('face');
  const [role,setRole]=useState<Role|null>(null);
  const challenge=problems.find(item=>item.id===problem)??problems[0];
  return <section className="crew-decision" data-crew-decision-studio aria-label="Interactive film crew problem-solving exercise">
    <details>
      <summary><span className="crew-decision-summary">
        <span className="eyebrow">TRY A REAL FILMMAKING DECISION · OPTIONAL</span>
        <strong>Who would you work with?</strong>
        <small>Three scene problems. Explore how different departments can help.</small>
      </span><span className="crew-decision-chevron" aria-hidden="true">⌄</span></summary>
      <div className="crew-decision-body">
        <div className="crew-decision-problems" role="group" aria-label="Choose a crew challenge">
          {problems.map(item=><button type="button" data-crew-problem={item.id}
            key={item.id} aria-pressed={problem===item.id}
            onClick={()=>{setProblem(item.id);setRole(null);}}>{item.title}</button>)}
        </div>
        <p className="crew-decision-situation"><strong>ON SET</strong> {challenge.situation}</p>
        <CrewDiagram selected={role} cue={challenge.cue}/>
        <p className="crew-decision-question">{challenge.question}</p>
        <div className="crew-decision-roles" role="group" aria-label="Choose a department to consult">
          {roles.map(item=><button type="button" key={item.id} data-crew-role={item.id}
            aria-pressed={role===item.id} onClick={()=>setRole(item.id)}>
            {item.label}</button>)}
        </div>
        {role?<div className="crew-decision-feedback" role="status" data-crew-feedback aria-live="polite">
          <strong>ONE POSSIBLE CONTRIBUTION · {roles.find(item=>item.id===role)?.label.toUpperCase()}</strong>
          <p>{challenge.notes[role]}</p>
          <div className="crew-decision-handshake"><strong>WORK TOGETHER</strong><p>{challenge.partnership}</p></div>
          <small>There is no universal first department or guaranteed outcome. Real sets solve these problems collaboratively.</small>
        </div>:<p className="crew-decision-invite">Choose a department to see one practical approach. Then switch roles to compare what others contribute.</p>}
      </div>
    </details>
  </section>;
}
