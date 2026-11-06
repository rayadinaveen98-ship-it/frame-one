import curriculum from './curriculum.v08b.json';
import type {Lesson} from './schema';
import type {GuidedFoundation} from './foundations-guided';

/**
 * Chapter 6: make an achievable first film, using the unchanged canonical
 * curriculum and quiz. All exercises are original conceptual learning aids;
 * the app never claims to record, import, edit or publish footage here.
 */
type FilmGuide=Omit<GuidedFoundation,'id'|'legacyId'|'lesson'|'chapterId'>;
const chapter=curriculum.chapters[5] as {ids:string[]};
export const FIRST_FILM_IDS=chapter.ids as readonly string[];
const byId=new Map((curriculum.lessons as unknown as Lesson[]).map(lesson=>[lesson.id,lesson]));

const guides:Record<string,FilmGuide>={
 making:{
  prompt:'You want to finish your first film this weekend. Which story could you shoot with what you already have?',
  observe:'A small, finished story teaches more than an ambitious idea that cannot be recorded safely or completed.',
  notice:'These are original planning exercises, not footage capture. Any filming requires permission, practical safety and appropriate people.',
  choices:[
   {label:'One place, one choice',view:'wide',filter:'neutral',note:'A character receives a surprising message and chooses whether to reply. One location keeps the idea manageable.'},
   {label:'One person, one discovery',view:'medium',filter:'warm',note:'A character notices a forgotten object and changes their mind. The action can be filmed without many performers.'},
   {label:'One gesture, one reaction',view:'close',filter:'neutral',note:'A small action and response may fit a short film. Make sure the audience can understand what changed.'}
  ],
  explorerLabel:'Keep the first project finishable',
  explorer:[
   {label:'Story',heading:'One clear change',detail:'Who wants something, what stops them, and what do they decide? A tiny arc can fit a short film.'},
   {label:'Plan',heading:'Know what you need',detail:'Choose an accessible location, willing participants, a small shot list and sound you can capture clearly.'},
   {label:'Finish',heading:'Leave time to watch the result',detail:'Record, select, arrange, export, and ask a viewer what they understood before planning your next film.'}
  ],
  sceneLabel:'SMALL FIRST FILM · ORIGINAL STORYBOARD',sources:[]
 },
 shotlist:{
  prompt:'Your film is about a person discovering a message. What should the shot list tell you to record?',
  observe:'A shot list describes planned camera setups and actions, not the final order of the edited film.',
  notice:'The illustrated shot list can be used as a reference while filming elsewhere. It does not export a real shooting schedule.',
  choices:[
   {label:'Establish the location',view:'wide',filter:'neutral',note:'A wider setup could make the place and character’s starting action clear.'},
   {label:'Record the discovery',view:'medium',filter:'neutral',note:'Capture the character actually finding and lifting the message so an editor can follow the action.'},
   {label:'Capture a useful reaction',view:'close',filter:'warm',note:'A separate response may add information. You only need it if it helps your particular story.'}
  ],
  explorerLabel:'Prepare three possible shots',
  explorer:[
   {label:'Place',heading:'Shot A · Where?',detail:'A wide or medium view establishes the location and what the character is doing.'},
   {label:'Action',heading:'Shot B · What happens?',detail:'Plan a recordable action such as a hand picking up the note. Check action continuity across setups.'},
   {label:'Reaction',heading:'Shot C · What changes?',detail:'Capture an expression, gesture or choice. These plans can change during the shoot.'}
  ],
  sceneLabel:'SAMPLE SHOT LIST · ORIGINAL ILLUSTRATION',sources:[]
 },
 shootscene:{
  prompt:'You are on location with a phone, a friend and a short script. What is the most useful next step?',
  observe:'A useful shot needs clear action, understandable sound and safe working conditions, not expensive equipment.',
  notice:'This is an instructional checklist; it cannot test your microphone, lighting, location permissions or phone settings automatically.',
  choices:[
   {label:'Check the location and consent',view:'wide',filter:'neutral',note:'Ask permission before filming people and spaces, identify hazards and establish where action happens.'},
   {label:'Record and check a short take',view:'medium',filter:'neutral',note:'Watch and listen back to a test: can the audience see the action and hear the important line?'},
   {label:'Capture the decisive detail',view:'close',filter:'neutral',note:'Record the action or reaction you need for the edit. Check any props remain consistent between shots.'}
  ],
  explorerLabel:'A practical phone-shoot checklist',
  explorer:[
   {label:'Safe',heading:'Prepare people and place',detail:'Confirm consent and location permission. Avoid hazards, traffic, unsafe stunts and filming where prohibited.'},
   {label:'Clear',heading:'Check image and voice',detail:'Frame the action, keep the phone steady when useful, and test the actual recorded speech or environmental sound.'},
   {label:'Complete',heading:'Review before leaving',detail:'Look for a missing action, usable reaction, continuity mismatch or audio problem while a retake is still possible.'}
  ],
  sceneLabel:'FIRST PHONE SHOOT · CONCEPTUAL SHOT DIAGRAM',sources:[]
 },
 editminute:{
  prompt:'You have recorded three usable shots. Which editing rhythm makes the action easiest to follow?',
  observe:'Begin with shots that communicate the action, then adjust their order and lengths. You do not need to use every take.',
  notice:'The diagram changes storyboard order and timing only. It does not import, play or render a real video file.',
  choices:[
   {label:'Place → discovery → reaction',view:'wide',filter:'neutral',note:'Establishing context before a reveal may help a new viewer understand where and why events happen.'},
   {label:'Discovery → place → reaction',view:'close',filter:'neutral',note:'Opening on the detail creates a question. The wider shot can clarify the situation later.'},
   {label:'Reaction → detail → place',view:'medium',filter:'cool',note:'A reaction-first sequence may invite curiosity, but could withhold too much information for a short beginner film.'}
  ],
  explorerLabel:'Make the first cut readable',
  explorer:[
   {label:'Order',heading:'What is revealed first?',detail:'Try different shot orders. Confirm the action remains understandable from beginning through its end.'},
   {label:'Length',heading:'Give each shot useful time',detail:'A short shot can guide attention to an event; a longer hold can help viewers read a place or reaction.'},
   {label:'Sound',heading:'Listen across each join',detail:'Check dialogue levels, abrupt background changes and music rights. A clear soundtrack can tie the cut together.'}
  ],
  sceneLabel:'ORIGINAL EDIT PLAN · STATIC TIMING DIAGRAM',sources:[]
 },
 review:{
  prompt:'Your first cut is done. A viewer says the important message was confusing. Which response helps you improve it?',
  observe:'Specific feedback can show where a film communicates clearly and where information is missing.',
  notice:'Feedback examples are fictional and illustrate a useful review method. They are not measured reactions from real audiences.',
  choices:[
   {label:'Ask what they understood',view:'medium',filter:'neutral',note:'An open question may reveal which story information the viewer actually received without leading them.'},
   {label:'Ask when confusion began',view:'wide',filter:'neutral',note:'A time or shot reference gives a practical clue you can compare against your edit.'},
   {label:'Try one targeted revision',view:'close',filter:'warm',note:'Adjust one cut, sound level or missing detail, then see whether the change improves understanding.'}
  ],
  explorerLabel:'Turn feedback into one useful iteration',
  explorer:[
   {label:'Listen',heading:'Ask before explaining',detail:'Watch the viewer’s first reaction, and ask what they understood before telling them what you intended.'},
   {label:'Identify',heading:'Choose a specific issue',detail:'A quiet line at 20 seconds is actionable; “bad movie” does not tell you what to change.'},
   {label:'Revise',heading:'Change, compare, learn',detail:'Revise the relevant shot or audio, export a new version, then ask whether the story now reads more clearly.'}
  ],
  sceneLabel:'FIRST-CUT REVIEW · ORIGINAL FEEDBACK EXERCISE',sources:[]
 }
};

export const FIRST_FILM:readonly GuidedFoundation[]=FIRST_FILM_IDS.map(id=>{
 const lesson=byId.get(id),entry=guides[id];
 if(!lesson||!entry)throw new Error('Unknown original Chapter 6 curriculum lesson '+id);
 return {id,legacyId:lesson.id,chapterId:5,lesson,...entry};
});
export function firstFilmById(id:string):GuidedFoundation|undefined{
 return FIRST_FILM.find(m=>m.id===id);
}
