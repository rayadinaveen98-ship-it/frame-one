/** Ephemeral lesson-to-practice handoff. Never stored or included in backups.
 * Consumption occurs exactly once when the Home practice desk mounts.
 */
import type {PracticeId} from '../data/film-it-yourself';

export const lessonPracticeMatches:Readonly<Record<string,PracticeId>>={
  units:'three-shots',
  shot:'three-shots',
  composition:'three-shots',
  shotlist:'three-shots',
  making:'three-shots',
  shootscene:'three-shots',
  lighting:'light',
  colour:'light',
  sound:'silence',
  ambience:'silence',
  dialogue:'silence',
  showdonttell:'silence',
  editing:'rhythm',
  rhythm:'rhythm',
  editminute:'rhythm'
};

let pending:PracticeId|null=null;
const allMissions:readonly PracticeId[]=['three-shots','light','silence','rhythm'];

export function practiceForLesson(lessonId:string):PracticeId|null{
  return Object.prototype.hasOwnProperty.call(lessonPracticeMatches,lessonId)
    ? lessonPracticeMatches[lessonId] : null;
}

export function stagePracticeHandoff(mission:PracticeId):void{
  if(!allMissions.includes(mission))throw Error('Unknown filmmaking practice');
  pending=mission;
}

export function takePracticeHandoff():PracticeId|null{
  const next=pending;
  pending=null;
  return next;
}
