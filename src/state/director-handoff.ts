/** Review-only handoff. Nothing is persisted or overwritten until Make Lab
 * confirms the replacement through its existing v0.7 storyboard bridge.
 * Module memory intentionally clears on refresh, not another storage key.
 */
import type {DirectorPlan} from '../data/direct-the-moment';
import {safeStory,type StoryPlan} from '../components/labs/story-data';

let pending:DirectorPlan|null=null;
export function stageDirectorHandoff(plan:DirectorPlan):void {
  if(!['wide','close'].includes(plan.frame) ||
     !['warm','cold'].includes(plan.light) ||
     !['room','pulse'].includes(plan.sound) ||
     !['hold','reveal'].includes(plan.edit)) {
    throw new Error('Invalid director choices');
  }
  pending={...plan};
}
export function peekDirectorHandoff():DirectorPlan|null {return pending?{...pending}:null;}
export function clearDirectorHandoff():void {pending=null;}

/** Map a 6-second one/two-shot plan to the existing 3 storyboard *beats*.
 * Remaining beat(s) are explicitly future placeholders, NEVER invented cuts
 * within the six seconds. All four craft decisions travel in the notes.
 */
export function previewDirectorStoryboard(plan:DirectorPlan):StoryPlan {
  const frame=plan.frame;
  const shotLabel=frame==='wide'?'Wide room with waiting person':'Close reaction to unreadable phone';
  const light=plan.light==='warm'?'Warm lamp':'Cool window';
  const sound=plan.sound==='room'?'Rain and fan; no score':'Low repeating musical pulse';
  const held=plan.edit==='hold';
  const first=`${held?'0–6s, one unbroken shot':'0–4s, first shot'}: ${shotLabel}. ${light} light. Sound: ${sound} (written cue, not played).`;
  const second=held
    ? 'AFTER 6s (optional next beat, not a cut in the hold): choose a detail or action to continue the story.'
    : '4–6s, phone insert (close-up): screen says “Typing…”. Same lighting and sound continue. This completes the six-second scene.';
  const third='FUTURE BEAT (not within the six seconds): decide how the person responds. This slot is yours to write or change.';
  return safeStory({
    question:'mystery',
    shots:[frame,held?frame:'close','medium'],
    notes:[first,second,third]
  });
}
