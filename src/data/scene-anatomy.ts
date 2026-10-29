/** Original fictional scene studies, authored for Frame One and bundled offline.
 * These are A/B creative possibilities, not universal rules about emotion.
 * Soundtrack choices are screenplay cues, not playable audio; real playback is in Sound Lab.
 */
import type {LabName} from '../legacy/bridge';

export type AnatomyId='sound'|'light'|'edit'|'reaction'|'rhythm';
export type AnatomyVariant='a'|'b';
export interface AnatomyChoice{
  id:AnatomyVariant;
  label:string;
  direction:string;
  reading:string;
  alt:string;
}
export interface AnatomyStudy{
  id:AnatomyId;
  tab:string;
  title:string;
  question:string;
  lesson:string;
  lab:LabName;
  sceneCue:string;
  observation:string;
  choices:readonly [AnatomyChoice,AnatomyChoice];
}
export const sceneAnatomyStudies:readonly AnatomyStudy[]=[
  {
    id:'sound',tab:'01 · SOUND',title:'Why can silence feel louder?',
    question:'A person waits for a message. The image stays exactly the same. What changes when you change its imagined soundtrack?',
    lesson:'sound',lab:'sound',
    sceneCue:'SOUND DIRECTION · DESCRIBED, NOT PLAYED',
    observation:'Without a score, we may listen more closely for tiny noises and pauses. Adding a pulse can guide our expectations earlier. Neither approach always creates the same feeling for every viewer.',
    choices:[
      {id:'a',label:'Just the room',direction:'A fan turns. Rain against a window. No musical score.',
       reading:'Small sounds leave space for us to notice the wait. We decide whether the quiet feels peaceful or uncomfortable.',
       alt:'Unchanged wide shot of a lone figure at a table with an unanswered phone. Room sound is described in text, not played.'},
      {id:'b',label:'A rising pulse',direction:'A low, repeating musical pulse grows underneath the same action.',
       reading:'Rhythm suggests something is approaching. The music gives us an expectation that the picture alone never stated.',
       alt:'The exact same wide shot of a lone figure at a table; a rising musical pulse is described in text, not played.'}
    ]
  },
  {
    id:'light',tab:'02 · LIGHT',title:'What does the light suggest?',
    question:'The actor and action do not move. Alter only the light. Where does your eye go—and what might you assume?',
    lesson:'lighting',lab:'light',
    sceneCue:'LIGHTING DIRECTION · SAME COMPOSITION',
    observation:'A warm source can make a place feel familiar while surrounding darkness still implies isolation. Hard, cool sidelight may emphasize uncertainty. Context, colour and acting all affect the interpretation.',
    choices:[
      {id:'a',label:'Warm lamp',direction:'A soft amber pool reaches the face and the empty tabletop.',
       reading:'The illuminated face invites us closer. The dark edges leave the rest of the room unknown.',
       alt:'Wide night interior. A person and empty table are illuminated by a soft warm lamp.'},
      {id:'b',label:'Cold window',direction:'Cool blue sidelight touches one side of the face; the room falls away.',
       reading:'The face feels less accessible because part of it disappears. The same pause may now read as guarded.',
       alt:'The same night interior and person with cold blue window light and deep shadows.'}
    ]
  },
  {
    id:'edit',tab:'03 · EDIT',title:'What does a cut reveal?',
    question:'One message arrives. Choose whether the audience stays with the character or sees the phone.',
    lesson:'editing',lab:'cut',
    sceneCue:'EDITING DIRECTION · ONE MOMENT, TWO VIEWS',
    observation:'Holding the reaction asks us to infer meaning from the person. Cutting to the screen supplies information and changes what we wait for next. Both are motivated choices, not rules.',
    choices:[
      {id:'a',label:'Stay on the face',direction:'Keep the wide shot. The phone is visible, but we cannot read it.',
       reading:'The unanswered question belongs to the person. We watch their hesitation and imagine what the notification means.',
       alt:'Wide view of a person watching an unreadable phone at night; the edit remains on their reaction.'},
      {id:'b',label:'Reveal the phone',direction:'Cut to a close shot: the phone reads “Typing…”',
       reading:'Now we know someone is responding. Suspense moves from “what happened?” to “what will they say?”',
       alt:'Close-up shot of a phone on the table with a message bubble that reads Typing.'}
    ]
  },
  {
    id:'reaction',tab:'04 · REACTION',title:'Why does a reaction matter?',
    question:'The phone lights up, but we still do not know the message. Is the story in the object—or in the person who sees it?',
    lesson:'acting',lab:'frame',
    sceneCue:'SHOT SELECTION · SHOW US WHAT MATTERS',
    observation:'A reaction shot is not automatically more emotional: what the actor does, what happened before and how long we stay all change its meaning. Compare information about an object with information about a person.',
    choices:[
      {id:'a',label:'Watch the object',direction:'Hold on the glowing phone beside the chair. The person remains small and indistinct.',
       reading:'The bright phone draws attention to the event, but leaves the character’s response uncertain. We know something happened; we do not know what it means to them.',
       alt:'Wide night interior with a glowing phone drawing attention while the waiting person remains small in the background.'},
      {id:'b',label:'Find the reaction',direction:'Cut in close to the person’s eyes. They look at the phone, then look away.',
       reading:'Now the person’s hesitation becomes the subject. We can infer conflict or doubt without reading a message. It is a possible interpretation, not a guaranteed feeling.',
       alt:'Close shot of the waiting character’s face and eyes, looking away from the phone after a notification.'}
    ]
  },
  {
    id:'rhythm',tab:'05 · RHYTHM',title:'How long should we stay?',
    question:'The same wait lasts six seconds. Will one uninterrupted shot feel the same as three cuts? Compare the planned edit, not a simulated playback.',
    lesson:'rhythm',lab:'cut',
    sceneCue:'EDIT PLAN · SHOT DURATIONS, NOT PLAYBACK',
    observation:'Cut frequency changes where we look and what we expect. A held image can let a performance breathe; quick cuts can connect details or create urgency. Pacing depends on the complete scene, not an arbitrary “correct” number of seconds.',
    choices:[
      {id:'a',label:'One patient shot',direction:'0–6s: hold the same wide frame. No cut interrupts the wait.',
       reading:'The viewer has time to inspect the room and the person. The duration itself may make an ordinary pause feel significant.',
       alt:'One uninterrupted six-second wide-shot plan, illustrated by a single continuous six-second timeline segment.'},
      {id:'b',label:'Three quick views',direction:'0–2s: face. 2–4s: phone. 4–6s: face again.',
       reading:'Each cut redirects attention. The return to the face gives the viewer a comparison: did the character’s expression change?',
       alt:'Three planned two-second shots of face, phone and face, illustrated by three distinct timeline segments.'}
    ]
  }

] as const;
