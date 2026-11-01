import {useState} from 'react';
import type {VisualPilotId} from '../data/visual-lessons';
import './camera-decision-board.css';

/** Optional hands-on decision study for three existing camera lessons.
 * It is an illustrated reasoning aid, never a camera/lens physics simulator.
 * No tracking, local data, camera permission, audio, or lesson completion.
 */
type CameraLesson=Extract<VisualPilotId,'camera'|'movement'|'lenses'>;
type Choice=Readonly<{id:string;label:string;effect:string;reason:string;phoneTask:string}>;
type Brief=Readonly<{title:string;setup:string;question:string;choices:readonly [Choice,Choice,Choice];summary:string}>;
const briefs:Record<CameraLesson,Brief>={
  camera:{
    title:'Where should the camera stand?',
    setup:'A person has found a letter. The story needs their face and the room to communicate the moment.',
    question:'Before filming, compare three camera heights. Which information changes?',
    choices:[
      {id:'level',label:'Eye-level view',effect:'The person and room are presented from approximately the same height.',
       reason:'This can make faces and background relationships straightforward to read. It is not necessarily neutral for every story.',
       phoneTask:'Photograph a safe, still object at approximately its height and note the background.'},
      {id:'low',label:'Lower viewpoint',effect:'More of the ceiling and the upward lines can appear behind the same person.',
       reason:'Moving down and aiming upward changes the vertical relationship, but does not automatically make the subject powerful.',
       phoneTask:'Lower the phone carefully, point slightly upward, and compare which background surfaces appear.'},
      {id:'high',label:'Higher viewpoint',effect:'More floor and the top surfaces of nearby objects can enter the picture.',
       reason:'Looking down may explain spatial relationships differently. Story context and distance also influence the shot.',
       phoneTask:'Raise the phone to a safe height and angle it down. Compare the floor and the person’s apparent proportions.'}
    ],
    summary:'Camera height, tilt and distance work together. Choose a viewpoint for what the audience needs to understand.'
  },
  movement:{
    title:'Rotate, travel, or move closer?',
    setup:'A character notices a second person by the doorway. You want to reveal them without confusing camera motion.',
    question:'Compare the camera path before deciding what kind of move to film.',
    choices:[
      {id:'pan',label:'Pan from one spot',effect:'The camera turns toward the doorway without changing its physical position.',
       reason:'A pan changes viewing direction. The scene remains viewed from the same camera location; a turn is not a sideways track.',
       phoneTask:'From a fixed, safe position, gently rotate your phone toward a nearby doorway.'},
      {id:'track',label:'Travel sideways',effect:'The camera shifts to a new position while looking toward the scene.',
       reason:'Moving sideways can change foreground/background overlap through parallax; different depths shift relative to one another.',
       phoneTask:'Walk sideways slowly in a clear space while pointing at a still object. Keep the phone secure.'},
      {id:'push',label:'Move toward subject',effect:'Camera distance decreases, so nearby objects may grow relative to a distant background.',
       reason:'A push-in changes viewpoint and distance. This is not the same as rotating a fixed camera or merely cropping the image.',
       phoneTask:'Take two still images from safe, different distances; inspect the subject-to-background relationship.'}
    ],
    summary:'A pan rotates around a position; a track translates sideways; a push changes camera distance. A handheld move may combine these.'
  },
  lenses:{
    title:'What changed: crop or camera position?',
    setup:'A cup is in front of a distant window. You want the cup larger in the frame.',
    question:'Keep track of which choices change the viewpoint and which only narrow the field of view.',
    choices:[
      {id:'wide',label:'Wide view, stay here',effect:'The cup and window occupy the original wider composition.',
       reason:'From this fixed viewpoint, the relative perspective of near and far objects is established. Many choices can alter framing later.',
       phoneTask:'Make a wide still photo of a cup with a distant object behind it, without moving the phone.'},
      {id:'crop',label:'Crop from same spot',effect:'The frame tightens, but the size relationship between cup and distant window stays linked to the same camera position.',
       reason:'A tighter crop changes what remains visible, not perspective. Changing focal length from the same spot likewise does not change perspective geometry.',
       phoneTask:'Duplicate the first photo and crop it tighter. Compare relative size and object overlap.'},
      {id:'move',label:'Move closer',effect:'The cup may become larger relative to a far background because the viewpoint and distances changed.',
       reason:'Camera position can change perspective. A different lens or field of view may also be needed if you want the same subject size in the final composition.',
       phoneTask:'Make a second still from closer to the cup, with permission and stable footing; compare the distant background.'}
    ],
    summary:'Cropping cannot replace camera movement. Lens and sensor determine field of view; camera position determines perspective.'
  }
};
function Diagram({lesson,choice}:{lesson:CameraLesson;choice:number}){
  const isSecond=choice===1,isThird=choice===2;
  return <svg className="camera-board-art" viewBox="0 0 640 310" role="img"
    data-camera-illustration={lesson} data-camera-view={choice}
    aria-label={`Original conceptual diagram for ${lesson}, option ${choice+1}: ${briefs[lesson].choices[choice].label}`}>
    <rect width="640" height="310" rx="12" fill="#16242e"/>
    <rect x="24" y="36" width="592" height="225" rx="9" fill="#233440" stroke="#61727a" strokeWidth="2"/>
    {lesson==='camera'?<g>
      <path d={isSecond?'M26 69L320 22L614 69':'M25 63H615'} fill="none" stroke="#6f8b91" strokeWidth="4"/>
      <path d={isThird?'M26 215L320 174L614 215':isSecond?'M26 242L320 208L614 242':'M26 225H614'}
        stroke="#a89686" strokeWidth="5" fill="none"/>
      <rect x="70" y="85" width="128" height="124" fill="#4a6670" stroke="#a6b5b8" strokeWidth="5"/>
      <path d="M134 85V209M70 147H198" stroke="#a6b5b8" strokeWidth="4"/>
      <g transform={`translate(350 ${isSecond?125:isThird?172:146}) scale(${isSecond?1.14:isThird?.88:1})`}>
        <circle cx="0" cy="-40" r="28" fill="#d1a68b"/>
        <path d="M-40 1Q0 -24 40 1L46 89H-46Z" fill="#957b80"/>
        <path d="M-18 88L-23 123M20 88L24 123" stroke="#8e8488" strokeWidth="11" strokeLinecap="round"/>
      </g>
      <g transform={`translate(142 ${isSecond?232:isThird?61:146})`}>
        <rect x="-34" y="-17" width="68" height="36" rx="6" fill="#c4a88b" stroke="#e9c8a5" strokeWidth="4"/>
        <circle cx="0" cy="0" r="12" fill="#253641"/>
        <path d={isSecond?'M34 0L166 -78M34 0L166 -33':isThird?'M34 0L166 69M34 0L166 112':'M34 -9H180M34 9H180'}
          stroke="#e3b48e" strokeWidth="3" strokeDasharray="8 6" fill="none"/>
      </g>
    </g>:lesson==='movement'?<g>
      <rect x="71" y="60" width="490" height="175" rx="9" fill="#3a4b55" stroke="#728a92" strokeWidth="2"/>
      <rect x="418" y="76" width="98" height="77" fill="#71868b" stroke="#a8b7b8" strokeWidth="3"/>
      <rect x="238" y="140" width="69" height="53" rx="6" fill="#b6977e"/>
      <circle cx="288" cy="107" r="23" fill="#d1ad8f"/>
      <g fill="#e3bc96" stroke="#efd2ad" strokeWidth="3">
        <path d={isSecond?'M134 230L151 211L168 230L161 251H141Z':isThird?'M260 230L277 211L294 230L287 251H267Z':'M165 230L182 211L199 230L192 251H172Z'}/>
        {isSecond?<path d="M413 230L430 211L447 230L440 251H420Z"/>:null}
        {isThird?<path d="M270 144L287 125L304 144L297 165H277Z"/>:null}
      </g>
      {isSecond?<g><path d="M171 240H413M401 230L416 240L401 250" stroke="#f0c497" strokeWidth="5" fill="none"/>
        <path d="M150 218L289 107M430 218L289 107" stroke="#e8c195" strokeDasharray="7 7" strokeWidth="3"/></g>
      :isThird?<g><path d="M289 213V160M279 173L289 157L299 173" stroke="#f0c497" strokeWidth="5" fill="none"/>
        <path d="M276 208L238 141M296 208L308 140" stroke="#e8c195" strokeDasharray="7 7" strokeWidth="3"/></g>
      :<g><path d="M183 209L243 149M183 209L379 123" stroke="#e8c195" strokeDasharray="7 7" strokeWidth="3"/>
        <path d="M150 170Q184 132 242 153M228 137L244 154L224 162" stroke="#f0c497" strokeWidth="5" fill="none"/></g>}
    </g>:<g>
      <rect x="80" y="73" width="470" height="162" rx="9" fill="#465c66" stroke="#8c9fa5" strokeWidth="3"/>
      <rect x="360" y="99" width="127" height="90" fill="#78929a" stroke="#c7b8a8" strokeWidth="4"/>
      <path d="M422 99V189M360 143H487" stroke="#c7b8a8" strokeWidth="3"/>
      <g transform={`translate(${isThird?236:240} 0) scale(${isThird?1.18:1} 1)`}>
        <path d="M-55 146H55L45 215H-46Z" fill="#bd987a" stroke="#ecd2b0" strokeWidth="5"/>
        <ellipse cy="146" rx="56" ry="14" fill="#64554d" stroke="#e6c5a8" strokeWidth="5"/>
        <path d="M55 165Q91 160 79 190Q69 205 47 199" stroke="#dfbd9d" strokeWidth="9" fill="none"/>
      </g>
      {isSecond?<rect x="176" y="91" width="151" height="146" rx="4" fill="none" stroke="#f0c596" strokeWidth="5" strokeDasharray="11 8"/>:null}
      {isThird?<g><path d="M21 278L120 251L176 235" stroke="#f0c596" strokeWidth="4" strokeDasharray="7 6" fill="none"/>
        <path d="M122 240L176 235L151 265" fill="none" stroke="#f0c596" strokeWidth="4"/></g>:null}
      <g transform={`translate(${isThird?142:82} 245)`}>
        <path d="M0 20L17 0L34 20L27 35H7Z" fill="#d4ae91" stroke="#eed0b0" strokeWidth="3"/>
        <path d="M17 0L135 -65M17 0L135 -115" stroke="#e8bb91" strokeWidth="2.5" strokeDasharray="7 6" fill="none"/>
      </g>
    </g>}
    <text x="31" y="26" fontSize="12" fontWeight="700" fill="#eac39f" fontFamily="system-ui">CAMERA NOTEBOOK · CONCEPT STUDY</text>
    <text x="606" y="289" textAnchor="end" fontSize="12" fill="#e8d0b5" fontFamily="monospace">
      {['A / ','B / ','C / '][choice]}{lesson.toUpperCase()}
    </text>
  </svg>;
}
export function CameraDecisionBoard({lesson}:{lesson:CameraLesson}){
  const [selected,setSelected]=useState(0);
  const [discussed,setDiscussed]=useState(false);
  const brief=briefs[lesson],active=brief.choices[selected];
  return <section className="camera-decision" data-camera-decision={lesson}
    aria-label="Optional cinematography decision exercise">
    <details>
      <summary><span className="camera-decision-summary">
        <span className="vl-eyebrow">OPTIONAL · DIRECT THE CAMERA</span>
        <strong>{brief.title}</strong>
        <small>Three ways to shoot. Choose one to change the illustrated plan.</small>
      </span><span className="camera-decision-chevron" aria-hidden="true">⌄</span></summary>
      <div className="camera-decision-body">
        <p className="camera-decision-setup"><strong>THE SCENE</strong> {brief.setup}</p>
        <p className="camera-decision-question">{brief.question}</p>
        <div className="camera-decision-options" role="group" aria-label="Choose a camera setup">
          {brief.choices.map((option,index)=><button type="button" key={option.id}
            data-camera-choice={option.id} aria-pressed={selected===index}
            onClick={()=>{setSelected(index);setDiscussed(false);}}>
            <span>{String.fromCharCode(65+index)}</span>{option.label}
          </button>)}
        </div>
        <Diagram lesson={lesson} choice={selected}/>
        <p className="camera-decision-effect" data-camera-effect role="status">{active.effect}</p>
        <button type="button" className="camera-decision-discuss" data-camera-discuss
          aria-expanded={discussed} onClick={()=>setDiscussed(old=>!old)}>
          {discussed?'Hide director’s explanation':'Why does this choice matter?'}
          <span aria-hidden="true">{discussed?'−':'+'}</span>
        </button>
        {discussed?<div className="camera-decision-insight" data-camera-insight role="region"
          aria-label="Camera choice explanation">
          <p>{active.reason}</p><strong>TRY WITH YOUR PHONE</strong><p>{active.phoneTask}</p>
          <small>{brief.summary}</small>
        </div>:null}
        <small className="camera-decision-note">Illustrations show only the concept, not calibrated camera optics, motion paths or an audience emotion. No app camera access.</small>
      </div>
    </details>
  </section>;
}
