/** Practical, shootable exercises; no timers, recording, uploads or saved progress.
 * These exercises require only a phone and ordinary objects in a safe space.
 * The educational goal is to compare a single filmmaking variable deliberately.
 */
import type {LabName} from '../legacy/bridge';

export type PracticeId = 'three-shots'|'light'|'silence'|'rhythm'|'performance'|'camera-height';

export type PracticeStep = Readonly<{
  title:string;
  instruction:string;
  purpose:string;
}>;

export type PracticeMission = Readonly<{
  id:PracticeId;
  title:string;
  tagline:string;
  time:string;
  lab:LabName;
  lessonId:string;
  observation:string;
  steps:readonly [PracticeStep,PracticeStep,PracticeStep];
}>;

export const practiceMissions:readonly PracticeMission[]=[
  {
    id:'three-shots',title:'One action. Three shots.',tagline:'Turn an ordinary action into a tiny sequence.',
    time:'10–15 MIN',lab:'story',lessonId:'shot',
    observation:'When did the action become clear: in the wide shot, the detail, or the final shot? There is no one correct answer.',
    steps:[
      {title:'Show the place',instruction:'Film a steady, wide shot of a cup and a table. Leave space around the objects.',purpose:'Give the viewer the setting.'},
      {title:'Choose one detail',instruction:'Move the phone closer and film a hand reaching toward the cup. Keep the action simple.',purpose:'Guide attention to an important action.'},
      {title:'Show the result',instruction:'Film the cup being lifted or placed back. Hold each shot steady, then watch the three clips in order.',purpose:'Let the viewer see what changed.'}
    ]
  },
  {
    id:'light',title:'One subject. Two moods.',tagline:'See how the direction of light changes what we notice.',
    time:'10 MIN',lab:'light',lessonId:'lighting',
    observation:'Which parts of the subject became easier to see? Did the mood feel different to you? Light influences a reading; it does not guarantee an emotion.',
    steps:[
      {title:'Choose a still subject',instruction:'Place a book or cup near a window in daytime. Keep the phone and object in the same positions.',purpose:'Hold composition and subject constant.'},
      {title:'Make a soft-light take',instruction:'Film a few seconds with indirect window light on the front or side of the object.',purpose:'Observe how the surface and shadows appear.'},
      {title:'Change just the light',instruction:'Change the object’s position relative to the window so the side or back catches the light. Keep phone framing similar, then compare.',purpose:'Notice what directional light reveals or hides.'}
    ]
  },
  {
    id:'silence',title:'Tell it without dialogue.',tagline:'Use visible action and natural sound to suggest a question.',
    time:'10–15 MIN',lab:'sound',lessonId:'ambience',
    observation:'What did you understand from the images alone? Which sounds helped you imagine the space? Silence does not mean sound has to be absent.',
    steps:[
      {title:'Choose a tiny mystery',instruction:'Put a closed notebook beside a phone. Decide what the viewer should wonder about.',purpose:'Start with one simple visual question.'},
      {title:'Film without speaking',instruction:'Film the two objects, then a hand hesitating before opening the notebook. Avoid spoken explanation.',purpose:'Use timing and action to direct attention.'},
      {title:'Listen back',instruction:'Play the clips and listen for room tone, footsteps or handling noise. Compare once with sound and once muted.',purpose:'Find which details come from the images and which come from the soundtrack.'}
    ]
  },
  {
    id:'rhythm',title:'One action. Two rhythms.',tagline:'Try changing duration before changing the story.',
    time:'10–15 MIN',lab:'cut',lessonId:'rhythm',
    observation:'Did the longer take give you time to notice something the shorter edit did not? Fast is not always more exciting.',
    steps:[
      {title:'Record a repeatable action',instruction:'Film a hand placing a key beside a notebook in one steady take, keeping both objects visible.',purpose:'Keep the story information simple.'},
      {title:'Watch the whole take',instruction:'Watch the uninterrupted clip. Notice when you first understand the action and when your attention moves.',purpose:'Feel the duration before making cuts.'},
      {title:'Make a shorter comparison',instruction:'On your phone, trim a copy to begin closer to the action, without deleting the original. Watch both versions.',purpose:'Compare how the starting point and duration affect attention.'}
    ]
  },
  {
    id:'performance',title:'One action. Two intentions.',tagline:'Direct a simple gesture so the audience notices a choice.',
    time:'10–15 MIN',lab:'story',lessonId:'acting',
    observation:'Without changing the words, which take gave you more time to imagine what the character wanted? The same pause can mean different things to different viewers.',
    steps:[
      {title:'Choose one clear action',instruction:'Place a closed envelope or folded sheet on a table. Film only your hand and the paper, with the same steady phone framing for both takes.',purpose:'Keep the setting and action identical so your performance choice is easier to notice.'},
      {title:'Direct Take A: decide quickly',instruction:'Record yourself reaching for the paper and picking it up straight away, with one simple continuous gesture and no spoken explanation.',purpose:'Explore what an immediate, uninterrupted decision might communicate.'},
      {title:'Direct Take B: let the choice breathe',instruction:'Record the same action again, but pause with your hand above the paper, move back slightly, then reach for it. Compare the two takes.',purpose:'Study how timing and intention in an action can invite a different reading.'}
    ]
  },
  {
    id:'camera-height',title:'One subject. Two viewpoints.',tagline:'Explore camera height without changing the tabletop story.',
    time:'10–15 MIN',lab:'frame',lessonId:'camera',
    observation:'From which height did you notice the cup first, and when was the notebook easier to understand? The change is about visual information, not a guaranteed feeling.',
    steps:[
      {title:'Set a repeatable tabletop scene',instruction:'Place a cup beside a closed notebook on a steady table. Use the same daylight, object positions and phone orientation for both short recordings.',purpose:'Control the scene so camera height is the clearest deliberate difference.'},
      {title:'Take A: shoot from above',instruction:'Hold the phone safely above the table and film a brief steady view down toward both objects. Check that the cup and notebook remain visible.',purpose:'See how a higher view explains the relationship between objects.'},
      {title:'Take B: move near cup height',instruction:'Lower the phone to roughly the cup’s height while keeping a safe, steady grip. Film again without moving the objects, then compare both views.',purpose:'Notice how a lower position changes prominence and hides some information.'}
    ]
  }
] as const;

export function practiceById(id:PracticeId):PracticeMission {
  const found=practiceMissions.find(item=>item.id===id);
  if(!found)throw new Error('Unknown filmmaking practice');
  return found;
}
