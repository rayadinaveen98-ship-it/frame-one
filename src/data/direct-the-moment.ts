/** Direct the Moment: completely original offline micro-scene and deterministic shot treatment.
 * All four decisions are independently selectable; no scores, diagnoses or saved work implied.
 */
export type FrameChoice = 'wide'|'close';
export type LightChoice = 'warm'|'cold';
export type SoundChoice = 'room'|'pulse';
export type EditChoice = 'hold'|'reveal';
export interface DirectorPlan {
  frame:FrameChoice;
  light:LightChoice;
  sound:SoundChoice;
  edit:EditChoice;
}
export const quietTake:DirectorPlan = {frame:'wide',light:'warm',sound:'room',edit:'hold'};
export const uneasyTake:DirectorPlan = {frame:'close',light:'cold',sound:'pulse',edit:'reveal'};
export const directionGroups = [
  {id:'frame',label:'01 · FRAME',prompt:'How close should we feel?',lab:'frame',
    choices:[{id:'wide',label:'Observe from afar'},{id:'close',label:'Stay with the face'}]},
  {id:'light',label:'02 · LIGHT',prompt:'Which part of the room speaks?',lab:'light',
    choices:[{id:'warm',label:'Warm practical lamp'},{id:'cold',label:'Cold window light'}]},
  {id:'sound',label:'03 · SOUND',prompt:'What should the audience hear?',lab:'sound',
    choices:[{id:'room',label:'Just the room'},{id:'pulse',label:'An imagined pulse'}]},
  {id:'edit',label:'04 · EDIT',prompt:'When do we reveal the message?',lab:'cut',
    choices:[{id:'hold',label:'Hold for 6 seconds'},{id:'reveal',label:'Cut after 4 seconds'}]}
] as const;

export interface DirectorTreatment {
  firstShot:string;
  secondShot:string|null;
  soundDirection:string;
  framingWhy:string;
  lightWhy:string;
  soundWhy:string;
  editWhy:string;
  possibleReading:string;
  shotDescription:string;
}

export function makeDirectorTreatment(plan:DirectorPlan):DirectorTreatment {
  const firstShot=`0–${plan.edit==='reveal'?'4':'6'}s · ${plan.frame==='wide'?'Wide view: a person waits beside an unreadable phone.':'Close reaction: the person watches the unreadable phone, then looks away.'} ${plan.light==='warm'?'A warm lamp reaches their face.':'Cool window light leaves half the face in shadow.'}`;
  const secondShot=plan.edit==='reveal'?'4–6s · Insert: the phone lights up. The message only reads “Typing…”.':null;
  const soundDirection=plan.sound==='room'
    ? 'Sound cue (described, not played): rain on glass, a room fan and no musical score.'
    : 'Sound cue (described, not played): a soft, regular musical pulse under the same room noise.';
  const framingWhy=plan.frame==='wide'
    ? 'Distance lets the viewer read the relationship between the character and the empty room.'
    : 'The face becomes the centre of attention; smaller changes in expression become easier to read.';
  const lightWhy=plan.light==='warm'
    ? 'The warm practical lamp draws the eye to the character, even while the room remains dark.'
    : 'Cool sidelight introduces shadow and uncertainty around what the character is thinking.';
  const soundWhy=plan.sound==='room'
    ? 'Without a score, the ordinary room sounds leave more of the emotion to the viewer.'
    : 'A repeating pulse encourages anticipation before the image explains what is coming.';
  const editWhy=plan.edit==='hold'
    ? 'Six uninterrupted seconds leave the notification’s contents hidden. The audience must watch and infer.'
    : 'The cut supplies new information at four seconds, moving the question from “what happened?” to “what will be said?”';
  const possibleReading=plan.frame==='close' && plan.sound==='pulse'
    ? 'A close reaction and a musical pulse may steer attention toward unease; the edit decides whether that uncertainty continues.'
    : plan.frame==='wide' && plan.sound==='room'
      ? 'Distance and unscored room sound may give the audience more freedom to interpret the wait.'
      : 'Framing and sound create different expectations: the image gives information, while the sound proposes how to listen.';
  const shotDescription=`Illustrated ${plan.frame==='wide'?'wide night interior':'close character reaction'} under ${plan.light==='warm'?'warm lamp':'cold window'} light, with ${plan.edit==='hold'?'one six-second held shot':'a four-second first shot and a two-second phone insert'}. Audio is a written cue, not playback.`;
  return {firstShot,secondShot,soundDirection,framingWhy,lightWhy,soundWhy,editWhy,possibleReading,shotDescription};
}
