/** Three learn-by-revealing storyboard studies; original, offline and editorially
 * distinct from visual A/B comparisons. No synthetic film/audio or tracking.
 */
import type {LabName} from '../legacy/bridge';
export type SequenceId='units'|'showdonttell'|'continuity';
export type SequenceBeat=Readonly<{heading:string;caption:string;focus:string}>;
export type SceneSequence=Readonly<{
 id:SequenceId;eyebrow:string;question:string;setup:string;
 beats:readonly [SequenceBeat,SequenceBeat,SequenceBeat];
 discovery:string;why:string;takeaway:string;challenge:string;lab:LabName;labTitle:string;
}>;
export const sceneSequences:Readonly<Record<SequenceId,SceneSequence>>={
 units:{
  id:'units',eyebrow:'THE STORYBOARD ROOM / 01',question:'When does a frame become a scene?',
  setup:'Follow one tiny action. Reveal how a still image fits into a shot, then into a scene.',
  beats:[
   {heading:'One frame',caption:'An image paused at one instant.',focus:'A single picture contains the cup, table and reaching hand.'},
   {heading:'One shot',caption:'One uninterrupted camera view across time.',focus:'The same view can contain many frames while the hand moves.'},
   {heading:'One scene',caption:'A part of the story, sometimes told in several shots.',focus:'A wide view, an insert and a result can belong to the same scene.'}
  ],
  discovery:'A frame is one image. A shot is an uninterrupted view. A scene is a unit of story action.',
  why:'A take is a recording attempt; an editor chooses footage and may build a scene from one shot or several. These drawings illustrate structure, not actual moving footage.',
  takeaway:'Frame = picture · Shot = continuous view · Scene = story event.',
  challenge:'Watch a short conversation. Pause on a frame, count the cuts, then ask whether the scene itself has changed.',
  lab:'cut',labTitle:'Build a three-shot scene in the Cut Lab'
 },
 showdonttell:{
  id:'showdonttell',eyebrow:'THE STORYTELLER’S ROOM / 02',question:'Can an action suggest a feeling?',
  setup:'Watch someone set a table. No dialogue tells you what to think.',
  beats:[
   {heading:'Set the scene',caption:'Two cups, two empty places.',focus:'The composition introduces two places without explaining who belongs there.'},
   {heading:'Notice the pause',caption:'A person’s hand reaches toward the second cup.',focus:'The small hesitation may make you wonder why this cup matters.'},
   {heading:'One quiet choice',caption:'The second cup is put away.',focus:'One visible action can suggest an idea without spelling out a single interpretation.'}
  ],
  discovery:'The action gives a clue. Different viewers can still imagine different reasons.',
  why:'Visual storytelling can guide curiosity and inference. A line of dialogue could also help when the action needs context; “show, don’t tell” is not an absolute prohibition.',
  takeaway:'An action can make viewers ask the next question.',
  challenge:'Film two objects and one hand movement. Show the short clip without explaining it, then ask somebody what they noticed.',
  lab:'story',labTitle:'Plan the action in the Make Lab'
 },
 continuity:{
  id:'continuity',eyebrow:'THE EDITOR’S ROOM / 03',question:'Did the cup move by itself?',
  setup:'Observe the table across three connected views. One detail quietly jumps.',
  beats:[
   {heading:'Establish the position',caption:'A cup sits at the left of the table.',focus:'The wide shot tells us where the cup begins.'},
   {heading:'Cut closer',caption:'The hand approaches; the cup stays on the left.',focus:'The action continues without a visible move to the other side.'},
   {heading:'Something changed',caption:'The cup suddenly appears on the right.',focus:'No shown action explains the new position. Can you spot the mismatch?'}
  ],
  discovery:'The cup jumps from left to right across a cut with no shown reason.',
  why:'Matching details across connected shots helps the audience follow action. A discontinuity can be deliberate, but accidental jumps may distract from the moment.',
  takeaway:'A cut can change the view without unexpectedly changing the story’s facts.',
  challenge:'Record a hand reaching for a cup from two angles. Keep its position the same when you cut.',
  lab:'continuity',labTitle:'Test the change in the Continuity Lab'
 }
};
export function sceneSequenceForLesson(id:string):SceneSequence|null{
 return Object.prototype.hasOwnProperty.call(sceneSequences,id)?sceneSequences[id as SequenceId]:null;
}
