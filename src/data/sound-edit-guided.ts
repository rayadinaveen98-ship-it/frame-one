import curriculum from './curriculum.v08b.json';
import type {Lesson} from './schema';
import type {GuidedFoundation} from './foundations-guided';

/**
 * Chapter 4 belongs to the original 33-lesson curriculum. The new exercises
 * are original, offline conceptual learning materials; none claims to play,
 * record or synthesize real sound, music or copyrighted footage.
 */
type SoundGuide=Omit<GuidedFoundation,'id'|'legacyId'|'lesson'|'chapterId'>;
const chapter=curriculum.chapters[3] as {ids:string[]};
export const SOUND_EDIT_IDS=chapter.ids as readonly string[];
const byId=new Map((curriculum.lessons as unknown as Lesson[]).map(l=>[l.id,l]));

const guide:Record<string,SoundGuide>={
 sound:{
  prompt:'The person still waits on our illustrated street. What unseen sound would change the information viewers notice?',
  observe:'A single frame can suggest different stories when different sounds are imagined around it.',
  notice:'These are written sound-design directions, not real audio tracks. Your device will not play sounds in this lesson.',
  choices:[
   {label:'Distant traffic',view:'wide',filter:'neutral',note:'An offscreen road could make the place seem active beyond the frame; it does not prove a car is visible.'},
   {label:'A phone vibration',view:'medium',filter:'neutral',note:'One short event can direct attention to a pocket or bag without changing the image.'},
   {label:'Quiet room tone',view:'close',filter:'neutral',note:'Reducing a soundtrack to low ambience might make gestures more noticeable. No music is not no sound.'}
  ],
  explorerLabel:'Three layers of a soundtrack',
  explorer:[
   {label:'World',heading:'Environmental sound',detail:'Wind, traffic and insects can suggest where action takes place, including outside the camera frame.'},
   {label:'Event',heading:'A specific sound',detail:'Footsteps, a message alert or a door can reveal an action or focus attention.'},
   {label:'Music',heading:'An optional musical layer',detail:'Score can influence expectations, but never guarantees that every audience member feels the same.'}
  ],
  sceneLabel:'CONCEPTUAL SOUND DESIGN · NO AUDIO PLAYBACK',sources:[]
 },
 editing:{
  prompt:'Three shots show a street, a person and a phone. Which information would your sequence reveal first?',
  observe:'A cut switches from one shot to the next; editing chooses the order and length of those views.',
  notice:'Our timeline diagrams use static illustrated shots. They demonstrate planned editing, not a rendered video.',
  choices:[
   {label:'Place → Person → Phone',view:'wide',filter:'neutral',note:'A location-first sequence establishes context, then moves toward the message.'},
   {label:'Phone → Person → Place',view:'close',filter:'neutral',note:'Beginning with a detail creates a question before giving the viewer a location.'},
   {label:'Person → Place → Phone',view:'medium',filter:'neutral',note:'Starting with body language can focus on the character before revealing the source of the reaction.'}
  ],
  explorerLabel:'What an editor decides',
  explorer:[
   {label:'Order',heading:'When does information arrive?',detail:'The order of shots can reveal facts early or withhold them for curiosity.'},
   {label:'Cut',heading:'When does the picture change?',detail:'A cut moves directly from one shot to another. A sequence can also use a long continuous shot.'},
   {label:'Hold',heading:'How long can we look?',detail:'Short or long durations give viewers different amounts of time to observe. Neither guarantees one emotion.'}
  ],
  sceneLabel:'ORIGINAL STORYBOARD TIMELINE · NOT PLAYING VIDEO',sources:[]
 },
 ambience:{
  prompt:'How could we suggest the world around the café without showing every street or room?',
  observe:'Dialogue, effects and environmental sound together can communicate a place.',
  notice:'Ambient noise and room tone are related but distinct. The following are written listening cues, not actual audio samples.',
  choices:[
   {label:'Traffic far behind',view:'wide',filter:'neutral',note:'A distant sound can suggest an offscreen road while leaving the subject unobstructed.'},
   {label:'Footsteps approaching',view:'medium',filter:'neutral',note:'A nearby effect can suggest another character entering the space.'},
   {label:'The hum of a quiet room',view:'close',filter:'neutral',note:'Room tone is usually the recorded background of a filming location, useful for matching edited dialogue.'}
  ],
  explorerLabel:'Design a believable place',
  explorer:[
   {label:'Dialogue',heading:'Protect important words',detail:'Keep spoken lines clear. Closer microphone placement and test recordings can prevent hard-to-fix problems.'},
   {label:'Effects',heading:'Events with a source',detail:'Footsteps, a phone alert or a closing door help tell us what happened.'},
   {label:'Ambience',heading:'What continues behind action?',detail:'Traffic, fans or insects make an environment believable, even when their source is offscreen.'}
  ],
  sceneLabel:'LISTENING PLAN · NO MICROPHONE OR AUDIO ENGINE',sources:[]
 },
 music:{
  prompt:'The character waits for news. Where would music belong in this scene, if at all?',
  observe:'Music may be inside the fictional world, outside it as a score, or absent.',
  notice:'This lesson uses an original diagram and descriptions. No licensed songs, music notes, or generated playback are included.',
  choices:[
   {label:'A radio in the café',view:'wide',filter:'warm',note:'If characters can hear it as part of their world, the radio music is diegetic.'},
   {label:'Audience-only background score',view:'medium',filter:'cool',note:'A score heard by viewers but not the characters is usually non-diegetic.'},
   {label:'No music; just location sound',view:'close',filter:'neutral',note:'Removing music might give more space to footsteps, breathing or pauses. No score does not mean literal silence.'}
  ],
  explorerLabel:'Where does music exist?',
  explorer:[
   {label:'In-world',heading:'Diegetic music',detail:'A radio or live performer that characters can hear belongs to the fictional scene world.'},
   {label:'Score',heading:'Non-diegetic music',detail:'Music intended for the audience, without a source that characters hear, is commonly called score.'},
   {label:'None',heading:'Make room for reality',detail:'A scene can be expressive without music; ambience and dialogue may carry the moment.'}
  ],
  sceneLabel:'MUSIC SOURCE DIAGRAM · NO COPYRIGHTED AUDIO',sources:[]
 },
 continuity:{
  prompt:'The character places a cup by their right hand. What happens when we cut to another camera position?',
  observe:'Continuity helps edited views feel like one understandable action.',
  notice:'We illustrate matching and mismatching prop placement with original shapes. This is not extracted film footage.',
  choices:[
   {label:'Cup stays in the same story position',view:'medium',filter:'neutral',note:'A matching prop position helps a viewer track the action across separate shots.'},
   {label:'Cup jumps sides without action',view:'close',filter:'contrast',note:'An unexplained change can distract the viewer. An intentional change can serve a stylized edit.'},
   {label:'Show the character moving the cup',view:'wide',filter:'neutral',note:'Showing the movement between positions gives a story reason for the change.'}
  ],
  explorerLabel:'Continuity is about clarity',
  explorer:[
   {label:'Objects',heading:'Keep props trackable',detail:'A cup, letter or phone should not silently change places unless that change is intended.'},
   {label:'Action',heading:'Match the movement',detail:'Across a cut, the beginning and end of an action should usually make sense together.'},
   {label:'Intent',heading:'When breaking a match works',detail:'Montage, dreams and deliberate discontinuity can interrupt expected continuity for a reason.'}
  ],
  sceneLabel:'TWO ORIGINAL FRAMES · CONTINUITY ILLUSTRATION',sources:[]
 },
 rhythm:{
  prompt:'A person waits, checks a phone and finally looks up. How long would you hold each shot?',
  observe:'Editing rhythm comes from relationships among shot duration, action, performance and sound.',
  notice:'The following timing bars are diagrams, not a video player or a promise of a particular emotional result.',
  choices:[
   {label:'Equal short holds',view:'medium',filter:'neutral',note:'Three short even beats can quickly deliver information, but speed alone does not create tension.'},
   {label:'A long first hold',view:'wide',filter:'neutral',note:'Holding the place before the reveal may invite observation or anticipation.'},
   {label:'A long final reaction',view:'close',filter:'neutral',note:'Giving a reaction more time can invite interpretation after new information arrives.'}
  ],
  explorerLabel:'Build a sequence in time',
  explorer:[
   {label:'Duration',heading:'Time within a shot',detail:'One second provides less viewing time than four seconds, but impact depends on what is happening.'},
   {label:'Contrast',heading:'Long and short together',detail:'Changing the relative lengths of shots creates an editing pattern viewers may notice.'},
   {label:'Flow',heading:'Picture, action and sound',detail:'Pacing is shaped by movement, dialogue, silence and the surrounding sequence—not just counting cuts.'}
  ],
  sceneLabel:'SHOT-DURATION DIAGRAM · STATIC STUDY',sources:[]
 }
};

export const SOUND_EDITING:readonly GuidedFoundation[]=SOUND_EDIT_IDS.map(id=>{
 const lesson=byId.get(id),entry=guide[id];
 if(!lesson||!entry)throw new Error('Unknown Sound and Editing lesson '+id);
 return {id,legacyId:lesson.id,chapterId:3,lesson,...entry};
});
export function soundEditingById(id:string):GuidedFoundation|undefined{
 return SOUND_EDITING.find(m=>m.id===id);
}
