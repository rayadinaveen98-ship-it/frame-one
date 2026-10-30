/** Fourteen illustrated, three-step mini lessons for the remaining real
 * curriculum routes. Original writing; labels do not impersonate video/audio.
 * Do not claim an exhaustive or officially verified list of industry crafts.
 */
import type {LabName} from '../legacy/bridge';
export type FieldId='why'|'history'|'genres'|'india'|'sound'|'crew'|'craft24'|
 'teams'|'pipeline'|'making'|'shotlist'|'shootscene'|'editminute'|'review';
export type FieldBeat=Readonly<{tag:string;title:string;observation:string}>;
export type FieldLesson=Readonly<{id:FieldId;eyebrow:string;question:string;setup:string;
 beats:readonly [FieldBeat,FieldBeat,FieldBeat];discovery:string;reason:string;
 takeaway:string;phoneTask:string;lab:LabName;labLabel:string;qualification:string}>;
export const fieldLessons:Readonly<Record<FieldId,FieldLesson>>={
 why:{
  id:'why',eyebrow:'THE VIEWER / NOTICE',
  question:'Why can one small moment stay with us?',
  setup:'Follow someone waiting, then notice what the film can reveal without explanation.',
  beats:[
   {tag:'PERSON',title:'Someone is waiting',observation:'One character sits by the window. We do not know why.'},
   {tag:'DETAIL',title:'The empty chair',observation:'An unused chair becomes a visual question about who might be missing.'},
   {tag:'TIME',title:'Look at the clock',observation:'A repeated look at the time can suggest that the wait matters.'}
  ],
  discovery:'Images, timing and attention can turn an ordinary wait into a story moment.',
  reason:'People may interpret the same moment differently. No single feeling is guaranteed; film offers details that let audiences form their own responses.',
  takeaway:'Cinema lets us notice life through another frame.',
  phoneTask:'Record one small action and ask a friend what they noticed first before you explain it.',
  lab:'frame',labLabel:'Explore a frame in the Frame Lab',
  qualification:'Original drawings, not a recorded film. Reactions vary by viewer.'
 },
 history:{
  id:'history',eyebrow:'CINEMA HISTORY / MORE THAN ONE INVENTOR',
  question:'How did pictures begin to move?',
  setup:'A three-stop illustration of technologies and storytelling, not an exhaustive history.',
  beats:[
   {tag:'EXPERIMENTS',title:'Moving-image experiments',observation:'Many inventors explored ways to record and view sequential images in the nineteenth century.'},
   {tag:'SCREENINGS',title:'Pictures for an audience',observation:'A famous paid Lumière screening took place in Paris on 28 December 1895, after other public moving-image demonstrations.'},
   {tag:'STORIES',title:'Film finds many forms',observation:'Everyday scenes, comedy and inventive tricks helped cinema become a varied storytelling medium.'}
  ],
  discovery:'Film history is a collaboration across inventors, countries and evolving artistic practices.',
  reason:'1895 is a useful milestone, not the undisputed first moving picture or screening. Early cinema took many forms and evolved in different places.',
  takeaway:'Cinema did not arrive in a single moment.',
  phoneTask:'Make a three-picture sequence of someone walking. Change the order and notice how movement becomes suggested.',
  lab:'cut',labLabel:'Build an image sequence in the Cut Lab',
  qualification:'Original historical diagrams, not authentic archival footage or a complete chronology.'
 },
 genres:{
  id:'genres',eyebrow:'GENRE / STORY EXPECTATIONS',
  question:'Can one lost phone become two films?',
  setup:'Keep the missing phone. Change how the story presents the discovery.',
  beats:[
   {tag:'PREMISE',title:'The phone is missing',observation:'A character searches a desk. That premise does not yet decide the genre.'},
   {tag:'COMEDY',title:'One possible comic turn',observation:'The phone rings from a pocket. The surprise could play as a joke.'},
   {tag:'MYSTERY',title:'One possible mystery turn',observation:'A strange message appears on an unfamiliar phone. The story now invites questions.'}
  ],
  discovery:'Genre describes storytelling patterns and expectations; the premise can support different tones.',
  reason:'Comedy and mystery can coexist. Documentary and fiction are different approaches, and labels are not rules that restrict filmmakers.',
  takeaway:'Genre is a promise of possibilities, not a prison.',
  phoneTask:'Use one missing object and write two different reveal shots: one amusing, one mysterious.',
  lab:'story',labLabel:'Try two story directions in the Make Lab',
  qualification:'Illustrated genre possibilities, not predictions about how every audience will react.'
 },
 india:{
  id:'india',eyebrow:'INDIAN CINEMA / MANY HISTORIES',
  question:'How did Indian cinema become many cinemas?',
  setup:'Three milestones, with the important early-film debate kept visible.',
  beats:[
   {tag:'1896',title:'Screenings in Bombay',observation:'Moving pictures were screened in Bombay, now Mumbai, in 1896.'},
   {tag:'1912–13',title:'Early feature-film debate',observation:'Shree Pundalik (1912) is discussed in early-film history; Raja Harishchandra (1913) is widely recognized as foundational.'},
   {tag:'MANY VOICES',title:'Languages and regions',observation:'Filmmaking flourished in many Indian languages and regional traditions, with sound, colour and technology changing over time.'}
  ],
  discovery:'Indian cinema is not the history of just one language, one production centre or one inventor.',
  reason:'The term “first Indian feature” requires context because of the Shree Pundalik / Raja Harishchandra discussion. A three-panel overview cannot capture every regional tradition.',
  takeaway:'India has a shared film history and many distinct cinemas.',
  phoneTask:'Ask an older family member about a film they remember. Note its language, period and one craft detail.',
  lab:'story',labLabel:'Plan an original local story',
  qualification:'Illustrated milestone overview, not archival stills or an exhaustive list of Indian cinema achievements.'
 },
 sound:{
  id:'sound',eyebrow:'SOUND / WHAT WE CANNOT SEE',
  question:'How much of a scene exists outside its frame?',
  setup:'One illustrated room. Add three possible sound layers as written cues.',
  beats:[
   {tag:'IMAGE',title:'The room alone',observation:'A person waits in a room. The picture establishes the visible space.'},
   {tag:'AMBIENCE',title:'A distant street',observation:'Imagine road noise beyond the window; the world seems to extend outside the frame.'},
   {tag:'DETAIL',title:'One phone rings',observation:'Imagine a phone ringing in the room. A small sound might redirect our attention.'}
  ],
  discovery:'Sound can provide story information even when a source is out of frame.',
  reason:'Ambience, effects, dialogue and music are different layers. No music is not the same thing as complete silence.',
  takeaway:'A film can suggest a larger world with sound.',
  phoneTask:'Record ten seconds of quiet room ambience and list three audible sources that are not visible.',
  lab:'sound',labLabel:'Hear original sound sketches in the Sound Lab',
  qualification:'Written imagined sound cues, not audio recordings or functioning playback in this illustration.'
 },
 crew:{
  id:'crew',eyebrow:'FILM CREW / ONE SCENE MANY PEOPLE',
  question:'Who makes one rainy-night scene?',
  setup:'Watch how different contributions support one shared scene.',
  beats:[
   {tag:'BUILD',title:'Create the space',observation:'Art and production design set the location, props and visual details.'},
   {tag:'CAPTURE',title:'Record the moment',observation:'Performers, camera, lighting and sound teams develop and record the scene.'},
   {tag:'SHAPE',title:'Choose what remains',observation:'Editing and sound finishing help shape the recorded material for viewers.'}
  ],
  discovery:'One scene is made from decisions that involve many different skills.',
  reason:'The workflow shown is simplified. Departments overlap, and small independent films may combine roles rather than having a separate person for every job.',
  takeaway:'Good filmmaking is coordinated creative work.',
  phoneTask:'Pick a rainy scene and write one decision for the set, camera and sound teams.',
  lab:'story',labLabel:'Plan the scene with Make Lab',
  qualification:'Illustrated crew contributions, not a fixed hierarchy, staffing plan or exhaustive role list.'
 },
 craft24:{
  id:'craft24',eyebrow:'TELUGU CINEMA / WORKERS AND CRAFTS',
  question:'Are there exactly 24 jobs in every film?',
  setup:'Explore the meaning of a familiar Telugu film-industry expression.',
  beats:[
   {tag:'CONTEXT',title:'Industry expression',observation:'“24 crafts” refers to a Telugu film-industry worker and federation context.'},
   {tag:'WORKERS',title:'Many kinds of work',observation:'Filming can involve lighting, sets, costume, transport, sound, editing and many others.'},
   {tag:'PRODUCTION',title:'Different team sizes',observation:'A small project may combine many jobs; a large film may need far more specialists.'}
  ],
  discovery:'The expression describes an industry organisation context, not 24 universal creative job titles.',
  reason:'We deliberately do not present an unverified official list of 24 association names. Federation categories and individual crew jobs are not interchangeable.',
  takeaway:'Respect the workers behind every craft.',
  phoneTask:'Choose one unnoticed behind-the-scenes task and describe how it changes what the audience sees or hears.',
  lab:'story',labLabel:'Explore what a scene needs in Make Lab',
  qualification:'Conceptual infographic; not a verified official 24-member association roster.'
 },
 teams:{
  id:'teams',eyebrow:'COLLABORATION / ONE DINNER TABLE',
  question:'Who decides what an empty table means?',
  setup:'One prop moves through three overlapping filmmaking conversations.',
  beats:[
   {tag:'WRITING',title:'An empty place matters',observation:'Writing and direction define the action and why the table matters in the story.'},
   {tag:'VISUAL',title:'Show the absence',observation:'Art, camera, lighting, acting and costume choices determine what is visible.'},
   {tag:'SOUND + EDIT',title:'Create the audience’s view',observation:'Sound and editing choices shape the moment, alongside input from the director and other departments.'}
  ],
  discovery:'A prop in the story becomes meaningful through decisions shared across departments.',
  reason:'These are overlapping collaborations, not strict gates. A change in one craft can force adjustments throughout the scene.',
  takeaway:'Every department can help communicate the same idea.',
  phoneTask:'Take one ordinary object and make three notes: story purpose, visual treatment and sound clue.',
  lab:'story',labLabel:'Build a simple scene plan',
  qualification:'An educational collaboration map, not a universal real-world chain of command.'
 },
 pipeline:{
  id:'pipeline',eyebrow:'FILMMAKING PIPELINE / BIG PICTURE',
  question:'How does a film travel from idea to audience?',
  setup:'Discover three connected blocks of a much larger, often overlapping workflow.',
  beats:[
   {tag:'PREPARE',title:'Develop and plan',observation:'Write and develop, find people and resources, schedule, scout and prepare the shoot.'},
   {tag:'PRODUCE',title:'Record the material',observation:'Capture performances, images and useful sound; review takes and adapt when needed.'},
   {tag:'FINISH + SHARE',title:'Edit, finish and distribute',observation:'Assemble the story, finish picture and sound, then prepare how audiences can watch it.'}
  ],
  discovery:'Finishing and distribution matter as much as gathering the raw material.',
  reason:'Development, pre-production, production, post-production and distribution can overlap. The diagram groups these into three teachable steps, not a rigid mandatory sequence.',
  takeaway:'A film is made again in planning, shooting and editing.',
  phoneTask:'Write a five-step plan for a 30-second film: idea, preparation, shoot, edit and show.',
  lab:'story',labLabel:'Begin your plan in Make Lab',
  qualification:'Simplified three-block illustration of a more detailed and overlapping film production pipeline.'
 },
 making:{
  id:'making',eyebrow:'FIRST FILM / MAKE IT COMPLETE',
  question:'What would your first 30-second film need?',
  setup:'A tiny note-discovery story, from a manageable idea to something watchable.',
  beats:[
   {tag:'PLAN',title:'Someone finds a note',observation:'Decide the character’s goal, the place and which shots reveal the note.'},
   {tag:'FILM',title:'Record the useful actions',observation:'Capture a wider view, the important detail and whatever reaction helps your story.'},
   {tag:'FINISH',title:'Make a first cut',observation:'Choose your shots, check speech and background sound, then watch your sequence through.'}
  ],
  discovery:'A small complete film teaches more than an enormous unfinished plan.',
  reason:'The illustrated three-stage example is only one approach; your film can have a different length or number of shots. Use footage and music you have rights to share.',
  takeaway:'Start small. Complete something. Learn from the result.',
  phoneTask:'Make a 30-second scene of finding a message using no more than five planned shots.',
  lab:'story',labLabel:'Draft your first film in Make Lab',
  qualification:'Original three-step sample plan, not real captured footage or a promise of automatic editing.'
 },
 shotlist:{
  id:'shotlist',eyebrow:'PRE-PRODUCTION / SHOT LIST',
  question:'Which shots do you actually need to record?',
  setup:'Build a short filming plan without confusing shooting order with edit order.',
  beats:[
   {tag:'01 / WIDE',title:'Establish the place',observation:'Write a wide view: where the character is and what the audience needs to know.'},
   {tag:'02 / ACTION',title:'Capture the important movement',observation:'Plan a hand reaching for the note, with the action clearly visible.'},
   {tag:'03 / DETAIL',title:'Get the important insert',observation:'Plan a close view of the note. You may record it before or after the wide shot.'}
  ],
  discovery:'A shot list plans what to record; it does not dictate the final edit order.',
  reason:'Shot size, action and notes support a practical shoot. Storyboards are visual plans. Neither requires exactly three shots for every film.',
  takeaway:'Plan the footage. Discover the edit afterward.',
  phoneTask:'Write three lines: shot size, action and one important note. Capture them in any safe filming order.',
  lab:'story',labLabel:'Build a shot list in Make Lab',
  qualification:'Original sample shot list, not a fixed shooting rule or a finished storyboard export.'
 },
 shootscene:{
  id:'shootscene',eyebrow:'PRACTICAL SHOOTING / PHONE FILM',
  question:'How do you know a take is usable?',
  setup:'A three-part check before, during and after recording.',
  beats:[
   {tag:'BEFORE',title:'Check location and consent',observation:'Confirm permission, safe access, available light and a manageable idea.'},
   {tag:'DURING',title:'Record the key action',observation:'Hold the frame steady when useful. Check that the dialogue and important sounds are understandable.'},
   {tag:'AFTER',title:'Review before leaving',observation:'Check footage and sound for missing action, focus problems or unwanted noise. Repeat safely if needed.'}
  ],
  discovery:'A usable scene begins with safe preparation and ends with a quality check.',
  reason:'A phone is enough to begin learning. No fixed shot count guarantees a film will work, and recording people or locations may require permission.',
  takeaway:'Check the frame and the sound before moving on.',
  phoneTask:'Shoot one consenting participant performing one safe action; review picture and sound immediately.',
  lab:'story',labLabel:'Prepare a small scene with Make Lab',
  qualification:'A visual filming checklist, not camera capture or device permission granted by this lesson.'
 },
 editminute:{
  id:'editminute',eyebrow:'POST-PRODUCTION / FIRST CUT',
  question:'Can a shorter cut tell a clearer story?',
  setup:'The same simple recorded moment becomes a more selective first edit.',
  beats:[
   {tag:'RAW',title:'All recorded material',observation:'You have a wide take, an action detail and an extra repeated moment.'},
   {tag:'SELECT',title:'Keep what advances the story',observation:'Select the useful views; remove unnecessary repetition without hiding a necessary action.'},
   {tag:'REVIEW',title:'Listen across the cuts',observation:'Check the transitions, ambience and dialogue. Export only after the full first cut makes sense.'}
  ],
  discovery:'Editing chooses what is useful, not merely what was recorded.',
  reason:'A first version may run 30–60 seconds, but the story—not an arbitrary duration—should determine its length. Background sound deserves attention.',
  takeaway:'Keep the footage that helps the viewer follow the action.',
  phoneTask:'Make two arrangements of three shots in any editor. Check both with the sound playing.',
  lab:'cut',labLabel:'Compare your first edit in the Cut Lab',
  qualification:'An original illustrated edit plan, not media playback or a real timeline editor.'
 },
 review:{
  id:'review',eyebrow:'FILMMAKER FEEDBACK / IMPROVE',
  question:'What can one viewer actually teach you?',
  setup:'Watch a tiny draft, ask one clear question, change one useful detail.',
  beats:[
   {tag:'SHOW',title:'Share without explaining',observation:'Let a willing viewer watch your rough cut before you describe what they should feel.'},
   {tag:'ASK',title:'Ask what they understood',observation:'Ask where the action was unclear or a sound could not be heard.'},
   {tag:'CHANGE',title:'Revise one thing',observation:'Try a clearer cut, a re-recorded line or a visible detail. Watch again.'}
  ],
  discovery:'Specific feedback gives you a concrete experiment for your next edit.',
  reason:'Audience interpretations differ; critique is information, not a pass/fail score for art. Prioritize clarity without abandoning your own intent.',
  takeaway:'A useful revision starts with a useful question.',
  phoneTask:'Show someone your short scene with permission and ask: “What happened?” and “Where were you confused?”',
  lab:'story',labLabel:'Revise your story in Make Lab',
  qualification:'An original sample feedback workflow, not user testing or an automatic quality score.'
 }
};
export function fieldLessonForId(id:string):FieldLesson|null{
 return Object.prototype.hasOwnProperty.call(fieldLessons,id)?fieldLessons[id as FieldId]:null;
}
