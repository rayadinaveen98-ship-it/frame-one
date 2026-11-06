import curriculum from './curriculum.v08b.json';
import type {Lesson} from './schema';

type CreativeOption={label:string;view:'wide'|'medium'|'close';filter:'neutral'|'warm'|'cool'|'contrast';note:string};
export type FieldGuide={label:string;heading:string;detail:string};
export interface GuidedFoundation{
  id:string;legacyId:string;chapterId:0|1|2|3|4;lesson:Lesson;
  prompt:string;observe:string;notice:string;
  choices:[CreativeOption,CreativeOption,CreativeOption];
  explorerLabel:string;explorer:[FieldGuide,FieldGuide,FieldGuide];
  sceneLabel:string;
  sources:string[];
}

/**
 * Canonical prose, factual quiz, completion identity and practice prompt come
 * from the already-shipped Frame One curriculum, NOT from duplicated V2 copy.
 *
 * All creative choices, comparisons and feedback below are original authoring.
 * Choices explore trade-offs; only the existing curriculum quiz is graded.
 */
const byId=new Map((curriculum.lessons as unknown as Lesson[]).map(lesson=>[lesson.id,lesson]));
const chapter=curriculum.chapters[0] as {ids:string[]};
export const FOUNDATION_IDS=chapter.ids as readonly string[];
const guide:Record<string,Omit<GuidedFoundation,'id'|'legacyId'|'lesson'|'chapterId'>>={
 why:{
  prompt:'A person waits outside a café, checking a phone. What should the audience notice first?',
  observe:'The same little moment can feel different depending on which detail you reveal.',
  notice:'Viewers bring their own experiences. Camera, sound and performance can guide attention but cannot dictate emotion.',
  choices:[
   {label:'The empty street',view:'wide',filter:'neutral',note:'The environment can establish the waiting situation before the character’s expression.'},
   {label:'The waiting person',view:'medium',filter:'neutral',note:'A medium view can encourage us to notice posture and anticipation.'},
   {label:'The phone detail',view:'close',filter:'warm',note:'A close detail can create a question: what message arrived? The answer still depends on context.'}
  ],
  explorerLabel:'What shapes our response?',
  explorer:[
   {label:'Picture',heading:'Where we look',detail:'Composition and shot size can direct attention, without guaranteeing a particular feeling.'},
   {label:'Time',heading:'How long we wait',detail:'Holding a shot or cutting sooner can alter expectation and pacing.'},
   {label:'Sound',heading:'What we hear',detail:'Ambience or silence can make viewers notice details they cannot see.'}
  ],
  sceneLabel:'ORIGINAL ILLUSTRATION · NOT REAL FOOTAGE',
  sources:['https://www.bfi.org.uk/education']
 },
 history:{
  prompt:'A group is seeing moving pictures for the first time. How would you arrange the experience?',
  observe:'Cinema grew from multiple inventions, craftspeople and exhibition methods—not one single “first”.',
  notice:'The Lumière Paris screening of 28 December 1895 is famous, but earlier moving-picture shows and individual viewing devices existed.',
  choices:[
   {label:'One person peeks into a viewer',view:'close',filter:'neutral',note:'Kinetoscope-style viewing was an early way to experience moving pictures individually.'},
   {label:'Project to a room',view:'wide',filter:'warm',note:'A shared screening creates a collective audience; public projection existed before December 1895.'},
   {label:'Show a single still picture',view:'medium',filter:'neutral',note:'A still image can suggest movement through composition, but it is not a moving-picture projection.'}
  ],
  explorerLabel:'Three ways to read early cinema',
  explorer:[
   {label:'Before 1895',heading:'Many experiments',detail:'Moving-image ideas involved optics, photography, mechanisms and several inventors.'},
   {label:'1894',heading:'Individual Kinetoscope viewers',detail:'People paid to look through peephole machines at short moving pictures.'},
   {label:'1895',heading:'More projected screenings',detail:'Different exhibitors projected films; the Lumière December Paris event became particularly influential.'}
  ],
  sceneLabel:'STORYBOARD EXAMPLE · NOT A HISTORICAL RECONSTRUCTION',
  sources:[
   'https://www.bfi.org.uk/sight-and-sound/features/origins-cinema-early-inventors-pioneers',
   'https://blog.scienceandmediamuseum.org.uk/the-lumiere-brothers-pioneers-of-cinema-and-colour-photography/'
  ]
 },
 units:{
  prompt:'A person waits, reads a message and walks away. How would you show that action?',
  observe:'A frame, a shot, a scene and a take are different ways of describing moving-image work.',
  notice:'The same scene can contain one continuous shot or many edited shots. A frame is one image inside a shot.',
  choices:[
   {label:'Stay on one unbroken view',view:'medium',filter:'neutral',note:'In the finished film, an uninterrupted camera view is one shot, even if it contains several actions.'},
   {label:'Cut closer to the phone',view:'close',filter:'neutral',note:'A cut begins a new shot; both shots can still belong to the same scene.'},
   {label:'Establish the entire location',view:'wide',filter:'neutral',note:'A wide view is still only one shot unless the edit changes to another view.'}
  ],
  explorerLabel:'Tap the term to understand it',
  explorer:[
   {label:'Frame',heading:'A single image',detail:'Pause a video on one picture: that visible picture is a frame.'},
   {label:'Shot',heading:'One unbroken view',detail:'Watch between two cuts: that uninterrupted stretch is a shot in the finished film.'},
   {label:'Scene',heading:'One segment of story action',detail:'A scene often groups action in a place and stretch of time, and may use many shots.'}
  ],
  sceneLabel:'STORYBOARD STUDY · NOT A RECORDING',
  sources:['https://www.bfi.org.uk/education']
 },
 genres:{
  prompt:'A character receives a strange phone message. Which storytelling tone could you explore?',
  observe:'Genre gives audiences a clue about a film’s common features, but films can mix genres.',
  notice:'A lighting treatment alone never determines genre. Story, performance, sound and editing matter too.',
  choices:[
   {label:'Curious comedy',view:'medium',filter:'warm',note:'A surprising situation could be played with comic timing, performance and sound.'},
   {label:'Uneasy mystery',view:'close',filter:'cool',note:'Holding information back may invite curiosity. Colour alone cannot create a mystery.'},
   {label:'Reflective drama',view:'wide',filter:'contrast',note:'A slower reaction could give the moment different emotional stakes; visual treatment is only one choice.'}
  ],
  explorerLabel:'See how genres can overlap',
  explorer:[
   {label:'Comedy',heading:'Humour',detail:'Comedy often invites amusement, but it may also contain serious themes or suspense.'},
   {label:'Mystery',heading:'Questions',detail:'A mystery can withhold information, inviting us to investigate what happened.'},
   {label:'Documentary',heading:'Real-world subjects',detail:'Documentary explores actual people and events while still involving choices about filming and editing.'}
  ],
  sceneLabel:'GENRE STUDY · ILLUSTRATIVE IMAGE ONLY',
  sources:['https://www.bfi.org.uk/education']
 },
 india:{
  prompt:'You are arranging an exhibition about the beginnings of cinema in India. What would you introduce first?',
  observe:'Indian cinema grew through screenings, technical experiments and filmmaking in many regions and languages.',
  notice:'The word “first” needs context: early screenings and early Indian-made films are different milestones.',
  choices:[
   {label:'Moving-picture screenings',view:'wide',filter:'warm',note:'Moving pictures were screened in Bombay in 1896, before indigenous feature production.'},
   {label:'Shree Pundalik (1912)',view:'medium',filter:'neutral',note:'This early film is part of debates about what counts as India’s first feature.'},
   {label:'Raja Harishchandra (1913)',view:'close',filter:'contrast',note:'Phalke’s landmark Indian-made feature is widely recognised, though earlier attempts also deserve discussion.'}
  ],
  explorerLabel:'Explore three Indian cinema milestones',
  explorer:[
   {label:'1896',heading:'Screenings in Bombay',detail:'Moving-picture exhibitions introduced audiences in Bombay to the new medium.'},
   {label:'1912',heading:'Shree Pundalik',detail:'Dadasaheb Torne’s film appears in discussion of early Indian feature production and disputed “first” claims.'},
   {label:'1913',heading:'Raja Harishchandra',detail:'Dadasaheb Phalke’s landmark silent feature helped establish Indian film production.'}
  ],
  sceneLabel:'HISTORICAL LEARNING · ILLUSTRATION NOT ARCHIVAL',
  sources:[
   'https://www.publicationsdivision.nic.in/journals/Journalarchives/Yojana/Yojana-English/1995/August/Yojana_1995_August_1611045932.pdf',
   'https://filmcitymumbai.org/Filmcity/filmcity_history'
  ]
 }
};
export const FOUNDATIONS:readonly GuidedFoundation[]=FOUNDATION_IDS.map(id=>{
  const lesson=byId.get(id),entry=guide[id];
  if(!lesson||!entry)throw new Error('Unknown first-chapter curriculum lesson '+id);
  return {id,legacyId:lesson.id,chapterId:0,lesson,...entry};
});
export function foundationById(id:string):GuidedFoundation|undefined{
  return FOUNDATIONS.find(l=>l.id===id);
}
