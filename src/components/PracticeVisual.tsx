import {useState} from 'react';
import type {PracticeId} from '../data/film-it-yourself';
import './practice-visual.css';

/** Original illustrated A/B filming guide for the two new phone exercises.
 * No video, camera permissions, progress or persistent state.
 */
type VisualMission=Extract<PracticeId,'performance'|'camera-height'>;
const captions:Record<VisualMission,readonly [string,string]>={
  performance:[
    'Take A · Reach for the letter without pausing. The gesture communicates a more immediate action.',
    'Take B · Hover, withdraw, then reach again. The pause gives the viewer a possible question about the choice.'
  ],
  'camera-height':[
    'Take A · A higher view makes the tabletop layout easy to read and can emphasize relationships between objects.',
    'Take B · A lower, level view makes the cup more prominent against its background. Compare what becomes hidden.'
  ]
};
export function PracticeVisual({mission}:{mission:VisualMission}){
  const [take,setTake]=useState<0|1>(0);
  const isPerformance=mission==='performance';
  return <section className="practice-visual" data-practice-visual={mission}
    aria-label="Original two-take filming storyboard">
    <div className="practice-visual-head">
      <div><span className="practice-overline">VISUAL STUDY · TWO TAKES</span>
        <h4>{isPerformance?'One prop. Different acting choices.':'One tabletop. Different camera heights.'}</h4></div>
      <div className="practice-visual-switch" role="group" aria-label="Compare the two illustrated filming takes">
        {([0,1] as const).map(n=><button key={n} type="button" data-practice-take={n}
          aria-pressed={take===n} onClick={()=>setTake(n)}>{n===0?'Take A':'Take B'}</button>)}
      </div>
    </div>
    <svg viewBox="0 0 640 270" className="practice-visual-art" role="img"
      data-practice-frame={take}
      aria-label={isPerformance
        ?take===0?'Drawing of a hand reaching straight for an envelope on a table':'Drawing of a hand paused above an envelope on a table'
        :take===0?'Top-down illustrated camera view of a cup and notebook':'Lower camera-angle illustration showing a cup in front of a notebook'}>
      <rect width="640" height="270" rx="14" fill="#172530"/>
      <rect x="24" y="18" width="592" height="234" rx="10" fill="#2a3944" stroke="#758791" strokeWidth="3"/>
      {isPerformance?<g>
        <rect x="60" y="180" width="520" height="37" rx="4" fill="#8e7260"/>
        <rect x="312" y="116" width="178" height="76" rx="4" fill="#dfc4a3" stroke="#f2d9b5" strokeWidth="4"/>
        <path d="M318 123L400 168L486 123" stroke="#8b776b" strokeWidth="4" fill="none"/>
        {take===0?<g>
          <path d="M128 168Q180 129 235 141L300 145L336 136L356 145L338 161L294 172L230 177L162 201Z"
            fill="#b88d77" stroke="#ecc4a4" strokeWidth="5"/>
          <path d="M290 145L331 129" stroke="#e8c5ac" strokeWidth="3"/>
          <path d="M91 105L148 105M102 88L134 88" stroke="#dcae86" strokeWidth="5" strokeLinecap="round"/>
        </g>:<g>
          <path d="M90 136Q162 102 234 112L296 112L328 104L344 117L327 131L284 139L204 151L124 177Z"
            fill="#b88d77" stroke="#ecc4a4" strokeWidth="5"/>
          <path d="M350 90L350 111M339 101L361 101" stroke="#e6c095" strokeWidth="4"/>
          <path d="M375 108Q399 86 425 111" stroke="#edb78a" strokeWidth="3" fill="none" strokeDasharray="6 7"/>
        </g>}
        <text x="55" y="46" fontSize="15" fill="#f2d7b7">{take===0?'GESTURE WITHOUT A PAUSE':'GESTURE WITH A PAUSE'}</text>
      </g>:<g>
        {take===0?<g>
          <rect x="74" y="54" width="490" height="162" rx="11" fill="#7b695d"/>
          <rect x="327" y="76" width="154" height="113" rx="5" fill="#ddd0ad" stroke="#f2e0bd" strokeWidth="5"/>
          <path d="M347 108H455M347 134H438M347 157H465" stroke="#a89b86" strokeWidth="5"/>
          <ellipse cx="199" cy="139" rx="48" ry="46" fill="#c4aa89" stroke="#ead2ad" strokeWidth="6"/>
          <ellipse cx="199" cy="135" rx="34" ry="31" fill="#594e49"/>
          <path d="M245 128Q278 113 275 143Q270 163 244 159" stroke="#e4ccaa" strokeWidth="9" fill="none"/>
          <text x="52" y="42" fontSize="15" fill="#f2d7b7">HIGHER VIEW · TABLETOP RELATIONSHIP</text>
        </g>:<g>
          <rect x="74" y="66" width="490" height="150" fill="#4b5b65"/>
          <rect x="74" y="168" width="490" height="45" fill="#827060"/>
          <rect x="344" y="116" width="164" height="61" fill="#d9c6a8" stroke="#efdaba" strokeWidth="5"/>
          <path d="M355 139H485M355 153H467" stroke="#9c917e" strokeWidth="4"/>
          <path d="M166 97H281L265 199H182Z" fill="#ba9b7a" stroke="#f3d6ae" strokeWidth="6"/>
          <ellipse cx="223" cy="98" rx="59" ry="15" fill="#4e4744" stroke="#e9c8a4" strokeWidth="7"/>
          <path d="M283 122Q327 109 317 152Q314 180 267 177" stroke="#e4c6a4" strokeWidth="11" fill="none"/>
          <text x="52" y="42" fontSize="15" fill="#f2d7b7">LOWER VIEW · CUP PROMINENCE</text>
        </g>}
      </g>}
      <path d="M41 45V37H61M580 37H599V56M41 220V234H61M580 234H599V219"
        fill="none" stroke="#e8c9a8" strokeWidth="3" opacity=".8"/>
    </svg>
    <p data-practice-visual-note role="status">{captions[mission][take]}</p>
    <small>Original simplified storyboard, not real footage or a physical camera simulation. Try both versions with your phone.</small>
  </section>;
}
