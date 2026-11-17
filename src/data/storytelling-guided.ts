import curriculum from './curriculum.v08b.json';
import type {Lesson} from './schema';
import type {GuidedFoundation} from './foundations-guided';

/**
 * Chapter 2 uses the same approved Option B scene as a continuing small story:
 * a person waiting outside a café. Each lesson examines a different decision.
 * This is an original illustrated exercise, NOT captured footage, a simulated
 * performance, or a replacement for the canonical Frame One curriculum.
 */
type StoryGuide=Omit<GuidedFoundation,'id'|'legacyId'|'lesson'|'chapterId'>;
const chapter=curriculum.chapters[1] as {ids:string[]};
export const STORYTELLING_IDS=chapter.ids as readonly string[];
const byId=new Map((curriculum.lessons as unknown as Lesson[]).map(lesson=>[lesson.id,lesson]));

const guide:Record<string,StoryGuide>={
 story:{
  prompt:'Someone waits outside a café to hand over a letter. Which information would you reveal first?',
  observe:'An ordinary wait becomes a story when we understand what someone wants and why the answer matters.',
  notice:'The camera can suggest a question, but stakes come from the situation—not an automatically emotional lens or soundtrack.',
  choices:[
   {label:'The empty place',view:'wide',filter:'neutral',note:'A wide view establishes that someone is missing. It can invite a question before providing an answer.'},
   {label:'The person waiting',view:'medium',filter:'warm',note:'Body language can suggest anticipation, but we still need context to understand the stakes.'},
   {label:'The unopened letter',view:'close',filter:'contrast',note:'A detail can focus our attention on an object the character cares about. Its meaning must be developed.'}
  ],
  explorerLabel:'Build an emotional question',
  explorer:[
   {label:'Want',heading:'What are they trying to do?',detail:'The character wants to give someone a letter. A clear objective gives the audience a direction to follow.'},
   {label:'Obstacle',heading:'What is difficult?',detail:'The other person may not arrive—or our character may be afraid to hand the letter over.'},
   {label:'Stakes',heading:'Why does it matter?',detail:'If the letter might repair a friendship, the outcome has personal consequences. Stakes are not just danger.'}
  ],
  sceneLabel:'ORIGINAL CAFÉ STORY · CONCEPTUAL ILLUSTRATION',sources:[]
 },
 script:{
  prompt:'Turn the café waiting idea into filmable instructions. What would you put on the page?',
  observe:'A screenplay translates intentions into actions, sounds, places and dialogue the crew can try to film.',
  notice:'“They feel nervous” describes an interior state; “they fold and unfold the letter” describes an observable action.',
  choices:[
   {label:'Establish the café exterior',view:'wide',filter:'neutral',note:'An exterior establishing image can help the crew understand location and action, but may be optional.'},
   {label:'Show the repeated gesture',view:'medium',filter:'neutral',note:'A playable, visible action gives actor and camera a concrete event to capture.'},
   {label:'Reveal the letter',view:'close',filter:'warm',note:'A close detail can be written as a filmable action rather than merely explaining a feeling.'}
  ],
  explorerLabel:'What makes a scene filmable?',
  explorer:[
   {label:'Place',heading:'Where are we?',detail:'EXT. CAFÉ – DAY identifies a possible exterior location and time. Formats are conventions, not creativity tests.'},
   {label:'Action',heading:'What can the crew record?',detail:'“A hand creases the envelope” is visible action. “Life feels hopeless” needs translation into something observable or performed.'},
   {label:'Turn',heading:'What changes?',detail:'A message arrives and the character chooses to leave or stay. One action can give a short scene an arc.'}
  ],
  sceneLabel:'ORIGINAL SCENE PLAN · NOT AN ACTUAL SHOOT',sources:[]
 },
 acting:{
  prompt:'The person at the café sees a message. How might a performer play the moment?',
  observe:'Actors can express a character through movement, gaze, speech, silence and timing.',
  notice:'No gesture automatically means sadness or joy. The audience interprets performance in the context of the story.',
  choices:[
   {label:'Stay still and wait',view:'medium',filter:'neutral',note:'A held posture can give the audience time to search for a reaction.'},
   {label:'Look across the street',view:'wide',filter:'neutral',note:'Movement toward the environment may communicate what the character is looking for.'},
   {label:'Look down at the message',view:'close',filter:'cool',note:'A closer frame can reveal a subtle response, but cannot create an acting choice on its own.'}
  ],
  explorerLabel:'Direct the performance',
  explorer:[
   {label:'Objective',heading:'What is the performer pursuing?',detail:'The character wants to speak to their friend. Knowing that objective can give every action purpose.'},
   {label:'Beat',heading:'What changes in the moment?',detail:'A new message may turn hopeful waiting into hesitation. The performer can change timing or movement.'},
   {label:'Frame',heading:'What can viewers notice?',detail:'A wide view highlights whole-body movement; a close view reveals small expressions. Either may suit the scene.'}
  ],
  sceneLabel:'PERFORMANCE STUDY · ORIGINAL STORYBOARD',sources:[]
 },
 character:{
  prompt:'A character is waiting for someone who may not arrive. What part of their struggle would you show?',
  observe:'A character’s want, an obstacle and a consequential choice can create a small but complete dramatic situation.',
  notice:'Conflict does not need a villain or a fight. A character can face uncertainty or their own reluctance.',
  choices:[
   {label:'The meeting place',view:'wide',filter:'neutral',note:'The location can establish the goal: someone is expected here.'},
   {label:'A decision to stay',view:'medium',filter:'warm',note:'Choosing to wait can reveal what matters to the character, especially after a delay.'},
   {label:'The letter in their hand',view:'close',filter:'contrast',note:'An object may hold the stakes of an apology, promise or unfinished conversation.'}
  ],
  explorerLabel:'Make a character decision',
  explorer:[
   {label:'Want',heading:'Something concrete',detail:'“Give the letter to a friend” is a visible goal; “be happy” is broader and harder to stage directly.'},
   {label:'Obstacle',heading:'Something in the way',detail:'The friend is absent, or the character is afraid of the response. Obstacles can be external or internal.'},
   {label:'Choice',heading:'A revealing action',detail:'They leave the letter behind, send a message, or keep waiting. Their choice reveals something about them.'}
  ],
  sceneLabel:'CHARACTER EXERCISE · ORIGINAL ILLUSTRATION',sources:[]
 },
 dialogue:{
  prompt:'The friend arrives and says, “You’re early.” Which visual emphasis could invite us to question the words?',
  observe:'The same line can mean different things depending on context, performance and what goes unsaid.',
  notice:'Subtext is a possible implied meaning, not a secret subtitle every audience must decode in exactly one way.',
  choices:[
   {label:'Keep both people in the place',view:'wide',filter:'neutral',note:'A wider view could allow gestures and distance between the characters to carry meaning.'},
   {label:'Observe a hesitant response',view:'medium',filter:'cool',note:'Pauses and posture may create a contrast between polite words and uneasy behaviour.'},
   {label:'Focus on the unopened letter',view:'close',filter:'neutral',note:'An object the characters avoid mentioning can invite a second layer of interpretation.'}
  ],
  explorerLabel:'Read between the words',
  explorer:[
   {label:'Words',heading:'Literal dialogue',detail:'“You’re early” is a statement about arrival time, but the line alone does not tell us the relationship.'},
   {label:'Context',heading:'What happened before?',detail:'If they had argued yesterday, the line may carry tension. If they planned a surprise, it may be playful.'},
   {label:'Subtext',heading:'What might be implied?',detail:'Avoided eye contact, a held letter and a long pause might suggest discomfort—one possible reading, not a fact.'}
  ],
  sceneLabel:'DIALOGUE STUDY · CONCEPTUAL STORYBOARD',sources:[]
 },
 showdonttell:{
  prompt:'The person wants to say they missed their friend. How could the scene communicate that?',
  observe:'Action can reveal a feeling without naming it. Dialogue can also be the clearest choice.',
  notice:'“Show, don’t tell” is a creative tool, not a ban on spoken words or clear explanation.',
  choices:[
   {label:'Show two empty seats',view:'wide',filter:'neutral',note:'The arrangement can establish an absence; viewers still need context to know what it means.'},
   {label:'See the person set down a cup',view:'medium',filter:'warm',note:'A small action might suggest a remembered routine, especially beside other story information.'},
   {label:'Let the person speak plainly',view:'close',filter:'neutral',note:'A direct line such as “I missed you” can be powerful when performance and timing support it.'}
  ],
  explorerLabel:'Compare ways to communicate',
  explorer:[
   {label:'Action',heading:'Something we see',detail:'Setting out two cups and removing one can suggest someone is missed, but interpretation remains open.'},
   {label:'Dialogue',heading:'Something we hear',detail:'“I wish you were here” explicitly communicates a wish. Directness can help rather than weaken a scene.'},
   {label:'Together',heading:'Choices can cooperate',detail:'An action, a pause and one simple line can reinforce or deliberately complicate one another.'}
  ],
  sceneLabel:'SHOW AND TELL STUDY · ORIGINAL ILLUSTRATION',sources:[]
 }
};

export const STORYTELLING:readonly GuidedFoundation[]=STORYTELLING_IDS.map(id=>{
 const lesson=byId.get(id),entry=guide[id];
 if(!lesson||!entry)throw new Error('Unknown second-chapter curriculum lesson '+id);
 return {id,legacyId:lesson.id,chapterId:1,lesson,...entry};
});
export function storytellingById(id:string):GuidedFoundation|undefined{
 return STORYTELLING.find(l=>l.id===id);
}
