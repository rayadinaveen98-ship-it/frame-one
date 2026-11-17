import curriculum from './curriculum.v08b.json';
import type {Lesson} from './schema';
import type {GuidedFoundation} from './foundations-guided';

/**
 * Canonical Chapter 5 education. Creative prompts are new, but graded facts,
 * original lesson IDs, note/backup storage and the formal curriculum stay in
 * the existing source of truth.
 */
type PeopleGuide=Omit<GuidedFoundation,'id'|'legacyId'|'lesson'|'chapterId'>;
const chapter=curriculum.chapters[4] as {ids:string[]};
export const PEOPLE_IDS=chapter.ids as readonly string[];
const byId=new Map((curriculum.lessons as unknown as Lesson[]).map(lesson=>[lesson.id,lesson]));
const guides:Record<string,PeopleGuide>={
 crew:{
  prompt:'A character finds an empty dinner table. Which team decision would you explore first?',
  observe:'A clear scene may begin with writing, but making it visible and audible draws on several collaborating crafts.',
  notice:'These are deliberately simplified examples; real crews can be larger or smaller and members frequently share responsibilities.',
  choices:[
   {label:'Story and performance',view:'medium',filter:'neutral',note:'The writer, director and actors can clarify what the character knows and how they react.'},
   {label:'Space and visible details',view:'wide',filter:'warm',note:'Production design, props, costume, camera and lighting can establish what is present and absent.'},
   {label:'Sound and transitions',view:'close',filter:'cool',note:'Sound crews and editors help convey information through what is heard, when it is heard, and what gets shown next.'}
  ],
  explorerLabel:'Meet collaborators',
  explorer:[
   {label:'Story',heading:'Writing, directing, acting',detail:'The script and performances establish the character’s actions. The director collaborates across departments on the scene.'},
   {label:'Image',heading:'Design, camera and lighting',detail:'Sets, costumes, camera choices and light help make the place and action legible.'},
   {label:'Finish',heading:'Sound and editing',detail:'Sound production/post and editorial work affect what the viewer hears and when information arrives.'}
  ],
  sceneLabel:'ONE SCENE · MANY COLLABORATORS',sources:[]
 },
 craft24:{
  prompt:'An aspiring filmmaker hears “24 crafts” on a Telugu film set. What does the phrase tell them?',
  observe:'“24 crafts” is a Telugu film-industry worker/federation expression. It is not a fixed worldwide roster of 24 individual film jobs.',
  notice:'This learning map shows example work areas—not an official exhaustive list of 24 associations or legally defined classifications.',
  choices:[
   {label:'Workers preparing a set',view:'wide',filter:'neutral',note:'Set construction, decoration and support workers are among many people contributing to a production.'},
   {label:'People recording image and sound',view:'medium',filter:'neutral',note:'Camera, lighting and location-sound work require coordinated technical teams.'},
   {label:'People completing and supporting the film',view:'close',filter:'warm',note:'Post-production, makeup, costumes, transport and other support can all be essential, depending on production needs.'}
  ],
  explorerLabel:'Think in work areas, not a magic job count',
  explorer:[
   {label:'Prepare',heading:'Before a camera rolls',detail:'Set work, props, costume, transport and planning can all affect the day’s shoot.'},
   {label:'Capture',heading:'On-set skills',detail:'Camera, lighting, location sound, performance and crew support overlap and depend on one another.'},
   {label:'Finish',heading:'After filming',detail:'Editors, sound specialists and colour teams may turn separate captured materials into a finished film.'}
  ],
  sceneLabel:'EXAMPLE WORK AREAS · NOT AN OFFICIAL 24-CRAFTS LIST',sources:[]
 },
 teams:{
  prompt:'The script says a child returns to an empty dinner table. Which department makes the absence visible?',
  observe:'One dramatic idea needs multiple coordinated decisions. Departments do not work in a rigid, isolated sequence.',
  notice:'The same illustration stays in view as different teams contribute. The scene is an original storyboard, not real production footage.',
  choices:[
   {label:'Writing and performance',view:'medium',filter:'neutral',note:'Story and actors communicate what the child expects, notices and chooses to do.'},
   {label:'Set, props and lighting',view:'wide',filter:'warm',note:'The dining table, empty chair, light and composition establish what viewers can see.'},
   {label:'Sound and the cut',view:'close',filter:'contrast',note:'Room ambience, a chair scrape or an edit can influence when absence becomes apparent.'}
  ],
  explorerLabel:'Collaborate on one scene',
  explorer:[
   {label:'Story',heading:'What should the viewer understand?',detail:'Writer, director and performers define the character’s objective and what changes.'},
   {label:'Stage',heading:'What must be prepared and recorded?',detail:'Art, camera, lighting and on-set sound coordinate the place, visible details and recordable action.'},
   {label:'Edit',heading:'What survives into the film?',detail:'The editor and sound post team shape timing, continuity and attention with the director.'}
  ],
  sceneLabel:'ONE DINNER TABLE · THREE TEAM DECISIONS',sources:[]
 },
 pipeline:{
  prompt:'You want to make a one-minute film. Which production stage needs attention now?',
  observe:'Movies often pass through idea development, pre-production, production, post-production and distribution. Stages may overlap.',
  notice:'This is a teaching overview, not a universal mandatory order or full legal/financial production plan.',
  choices:[
   {label:'Develop and prepare',view:'wide',filter:'neutral',note:'Write the scene, choose performers and locations, and plan how to record it safely.'},
   {label:'Record the scene',view:'medium',filter:'neutral',note:'During production, capture performances, images and appropriate sound while coordinating people.'},
   {label:'Edit and share',view:'close',filter:'warm',note:'Post-production shapes picture and sound; distribution makes the completed work accessible to audiences.'}
  ],
  explorerLabel:'Understand the film workflow',
  explorer:[
   {label:'Prepare',heading:'Development and pre-production',detail:'Define a story, script, budget, team, locations and practical shooting schedule.'},
   {label:'Shoot',heading:'Production / principal photography',detail:'Capture images, sound and performances safely, including alternate takes as needed.'},
   {label:'Finish',heading:'Post-production and distribution',detail:'Edit, sound-finish, colour-correct, export, and plan how the film reaches viewers.'}
  ],
  sceneLabel:'FILM WORKFLOW · CONCEPTUAL PROCESS MAP',sources:[]
 }
};
export const PEOPLE_BEHIND_FILM:readonly GuidedFoundation[]=PEOPLE_IDS.map(id=>{
 const lesson=byId.get(id),entry=guides[id];
 if(!lesson||!entry)throw new Error('Unknown canonical Chapter 5 lesson '+id);
 return {id,legacyId:lesson.id,chapterId:4,lesson,...entry};
});
export function peopleById(id:string):GuidedFoundation|undefined{
 return PEOPLE_BEHIND_FILM.find(l=>l.id===id);
}
