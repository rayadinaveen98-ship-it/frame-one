/** Portable, user-owned plain-text filming guide. Data comes entirely from
 * existing offline exercises. No activity analytics, external API or storage.
 */
import type {PracticeMission} from './film-it-yourself';

export function formatPracticeSheet(mission:PracticeMission,ownObservation=''):string{
  const notes=ownObservation.slice(0,240).trim();
  const steps=mission.steps.map((step,index)=>[
    'SHOT / STEP '+String(index+1).padStart(2,'0')+' — '+step.title,
    step.instruction,
    'WHY: '+step.purpose
  ].join('\n')).join('\n\n');
  return [
    'FRAME ONE — POCKET SHOOT PLAN',
    mission.title,
    mission.tagline,
    'APPROXIMATE TIME: '+mission.time,
    'GEAR: A phone and everyday objects. Film safely and with permission.',
    '',
    steps,
    '',
    'AFTER YOU WATCH — WHAT CHANGED?',
    mission.observation,
    '',
    'MY OBSERVATION',
    notes||'(Write something you noticed after filming.)',
    '',
    'This is a filmmaking guide, not a recording or a completed shoot.',
    'Prepared offline with Frame One.'
  ].join('\n');
}
