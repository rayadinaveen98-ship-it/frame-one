/** Three original visual-first learning investigations.
 * Entirely offline. Descriptions are qualified observations, not promised emotions.
 * Same format can expand to further crafts without changing the lesson renderer.
 */
import type {LabName} from '../legacy/bridge';

export type VisualPilotId='lighting'|'rhythm'|'ambience';
export type VisualTake=Readonly<{label:string;cue:string;focus:string;description:string}>;
export type VisualPilot=Readonly<{
  id:VisualPilotId;index:string;eyebrow:string;question:string;hook:string;
  takes:readonly [VisualTake,VisualTake];
  discovery:string;reason:string;
  notice:readonly [string,string,string];
  takeaway:string;prompt:string;lab:LabName;labLabel:string;footnote:string;
}>;

export const visualPilots:Readonly<Record<VisualPilotId,VisualPilot>>={
 lighting:{
  id:'lighting',index:'01',eyebrow:'THE DIRECTOR’S EYE / LIGHT',
  question:'Same room. Different light. What changes?',
  hook:'Move the light—not the camera.',
  takes:[
   {label:'A · SOFT FRONT LIGHT',cue:'Soft light from near the camera',focus:'Surface and shape are both visible',
    description:'A broad light source illuminates the front of the cup. The shadows are softer and less directional.'},
   {label:'B · SIDE LIGHT',cue:'A narrow sidelight',focus:'One edge becomes brighter; the other falls into shadow',
    description:'The cup and camera stay put. Light from the side makes its highlight and shadow more distinct.'}
  ],
  discovery:'Nothing in the story moved. Only the light direction changed.',
  reason:'Light controls which surfaces are easy to see. Shadows can shape depth, texture and attention; the emotion a viewer feels also depends on context.',
  notice:['Look at the bright rim of the cup','Watch where the shadow falls','Check whether the background changed'],
  takeaway:'Lighting is not brightness alone. It is the direction of attention.',
  prompt:'Place a cup near a window. Keep your phone fixed; change the light direction. Compare the shadow.',
  lab:'light',labLabel:'Experiment in the Lighting Lab',
  footnote:'Original diagram, not photographed footage or a physically accurate light simulation.'
 },
 rhythm:{
  id:'rhythm',index:'02',eyebrow:'THE EDITOR’S EYE / RHYTHM',
  question:'One action. Two edits. Does time change what we notice?',
  hook:'Keep the action. Change the cuts.',
  takes:[
   {label:'A · ONE LONG HOLD',cue:'One continuous shot · 6 seconds',focus:'The entire room stays visible',
    description:'One unbroken six-second wide shot gives time to observe the room and the hand moving toward a cup.'},
   {label:'B · THREE SHOTS',cue:'Wide 2s · Hand 2s · Cup 2s',focus:'Attention is guided from space to action to detail',
    description:'Three two-second shots reveal the same simple action in stages. Each cut selects a different part of it.'}
  ],
  discovery:'Both versions last six seconds. The information arrives in a different order.',
  reason:'Cuts change not only pace but which detail is available at each moment. A rapid rhythm is not automatically more exciting or effective.',
  notice:['Count how many images the viewer receives','Look for the hand in each shot','Compare the total duration: six seconds'],
  takeaway:'Editing chooses what to reveal—and when.',
  prompt:'Film one simple action. Compare a single held take with a three-shot plan of the same action.',
  lab:'cut',labLabel:'Try the real Cut Lab',
  footnote:'Illustrated shot plan with exact durations, not an animated video or measured audience response.'
 },
 ambience:{
  id:'ambience',index:'03',eyebrow:'THE SOUND DESIGNER’S EYE / ATMOSPHERE',
  question:'Same picture. What does the sound suggest?',
  hook:'The room never changes. Your imagined space might.',
  takes:[
   {label:'A · ROOM TONE',cue:'An imagined quiet room',focus:'Small nearby actions could stand out',
    description:'Imagine a quiet room with faint indoor ambience. A character waits at a desk. No score is added.'},
   {label:'B · OUTSIDE TRAFFIC',cue:'An imagined distant street outside',focus:'The room may seem connected to a busier world',
    description:'Keep the exact same picture. Now imagine distant road noise outside and a faint fan indoors.'}
  ],
  discovery:'The frame is identical. Sound can add a place we cannot see.',
  reason:'Ambience can imply location, scale and activity outside the frame. Room tone and outdoor sound are related layers, not interchangeable terms.',
  notice:['Notice which sounds belong inside the room','Imagine what lies beyond the window','Ask what the image alone cannot tell you'],
  takeaway:'The world of a film extends beyond its frame.',
  prompt:'Record ten seconds of real room ambience on your phone. Notice two sounds you did not consciously hear before.',
  lab:'sound',labLabel:'Listen in the actual Sound Lab',
  footnote:'These are written sound directions, not audio playback. The Sound Lab contains separate original sound sketches.'
 }
};

export function visualPilotForLesson(lessonId:string):VisualPilot|null{
 return Object.prototype.hasOwnProperty.call(visualPilots,lessonId)
  ?visualPilots[lessonId as VisualPilotId]:null;
}
