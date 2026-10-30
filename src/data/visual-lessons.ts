/** Six original visual-first learning investigations.
 * Entirely offline. Descriptions are qualified observations, not promised emotions.
 * Same format can expand to further crafts without changing the lesson renderer.
 */
import type {LabName} from '../legacy/bridge';

export type VisualPilotId='lighting'|'rhythm'|'ambience'|'shot'|'composition'|'colour';
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
 },
 shot:{
  id:'shot',index:'04',eyebrow:'THE CAMERA’S EYE / SHOT SIZE',
  question:'Same action. How much should we show?',
  hook:'Change only the frame size, then ask what is easier to see.',
  takes:[
   {label:'A · WIDE SHOT',cue:'Subject and room together',focus:'You can read the subject in relation to the room',
    description:'A wide illustration shows the same person reaching for a cup, plus the surrounding window, table and empty space.'},
   {label:'B · CLOSE-UP',cue:'A closer, detail-focused view',focus:'The hand and cup occupy most of the image',
    description:'The illustration crops attention toward the hand and cup. It does not imply the person feels one particular emotion.'}
  ],
  discovery:'One action, two visible areas. The shot size changes which story details are available.',
  reason:'A wide view can establish geography and relationships; a close-up can reveal action or expression. Neither is always better.',
  notice:['Identify what the wide view shows that the close view hides','Find the most prominent detail in the close view','Ask which shot better answers your story question'],
  takeaway:'Choose your shot size for the information the viewer needs.',
  prompt:'Film a familiar object and reaching hand in a wide view, then safely move closer for a detail shot. Compare what each reveals.',
  lab:'frame',labLabel:'Experiment in the Frame Lab',
  footnote:'Original storyboard illustrations: not recorded footage or an optical lens simulation.'
 },
 composition:{
  id:'composition',index:'05',eyebrow:'THE COMPOSER’S EYE / NEGATIVE SPACE',
  question:'Same person. What does empty space do?',
  hook:'Keep the shot size; change where the subject sits within the frame.',
  takes:[
   {label:'A · CENTRED',cue:'The subject is centred',focus:'Visual weight gathers around the middle',
    description:'A small figure stands in the centre of the same illustrated space. The background stays visible on both sides.'},
   {label:'B · OFF-CENTRE',cue:'Subject toward the left third',focus:'Empty space becomes more prominent to the right',
    description:'The same figure moves toward the left side of the unchanged frame. More negative space is visible on the right.'}
  ],
  discovery:'The room, figure size and story have not changed. Placement changes visual balance.',
  reason:'Negative space can lead the eye, suggest where someone is looking, or allow another element to matter. The rule of thirds is a guide, not a law.',
  notice:['Look at the subject’s position against the vertical guide lines','Notice how much open space remains on the right','Imagine what kind of action might enter that space'],
  takeaway:'Composition decides what shares the frame with your subject.',
  prompt:'Take two pictures of the same object from a fixed position: one centred and one placed toward a side. Which has more useful empty space?',
  lab:'frame',labLabel:'Try composition in the Frame Lab',
  footnote:'Original illustration for placement and negative space, not a claim about universal emotion.'
 },
 colour:{
  id:'colour',index:'06',eyebrow:'THE COLOURIST’S EYE / ATTENTION',
  question:'Same scene. Which detail catches your eye?',
  hook:'The objects stay still while one colour choice changes.',
  takes:[
   {label:'A · MUTED PALETTE',cue:'Quiet, low-saturation room',focus:'The cup and background have similar visual intensity',
    description:'An illustrated cup, plant and wall share restrained colours. No single object has a strongly contrasting hue.'},
   {label:'B · COLOUR ACCENT',cue:'One warm red cup',focus:'The warm red cup separates from its cooler surroundings',
    description:'Only the illustrated cup changes to a warm red tone. Its different colour may make it stand out from the muted scene.'}
  ],
  discovery:'The framing and objects remain still. The cup becomes a distinct colour accent.',
  reason:'Contrast in hue and saturation can direct attention, but colour does not assign one fixed meaning to an object or scene.',
  notice:['Compare the cup against the background in both versions','Notice which colours are held constant','Ask why a story might want a particular object noticed'],
  takeaway:'Colour becomes storytelling when it helps guide attention.',
  prompt:'Arrange three ordinary objects. Add one item with a noticeably different colour, then photograph the group and compare what catches your eye.',
  lab:'colour',labLabel:'Compare palettes in the Colour Lab',
  footnote:'Original colour-block illustration, not a calibrated grading preview or a promise of a specific emotional reaction.'
 }
};

export function visualPilotForLesson(lessonId:string):VisualPilot|null{
 return Object.prototype.hasOwnProperty.call(visualPilots,lessonId)
  ?visualPilots[lessonId as VisualPilotId]:null;
}
