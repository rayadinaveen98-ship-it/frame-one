/** The original v0.8B three-beat story curriculum and stable v0.7 storage shape. */
export const STORY_KEY='frameone-scene-v07';
export type StoryQuestion='mystery'|'reunion'|'decision';
export type StoryFraming='wide'|'medium'|'close';
export interface StoryPlan {
  question:StoryQuestion;
  shots:[StoryFraming,StoryFraming,StoryFraming];
  notes:[string,string,string];
}
export const storyQuestions:{
  [K in StoryQuestion]:{label:string;question:string;hints:[string,string,string]}
}={
  mystery:{label:'Mystery',question:'Why is this person waiting?',hints:['Introduce the person and place.','Add a clue without solving everything.','Show a response that raises another question.']},
  reunion:{label:'Reunion',question:'Who might the person meet?',hints:['Show the anticipation.','Introduce a sign that somebody could arrive.','Show how the waiting person reacts.']},
  decision:{label:'Decision',question:'Will the person stay or leave?',hints:['Show what makes the choice matter.','Introduce new information.','Show a decision through an action.']}
};
export const storyPhases=[
  {name:'Beginning',prompt:'Where are we, and who is here?'},
  {name:'Middle',prompt:'What new information do we learn?'},
  {name:'Ending',prompt:'What does the person do next?'}
] as const;
export const INITIAL_STORY:StoryPlan={
  question:'mystery',
  shots:['wide','medium','close'],
  notes:['A person waits at a bus stop.','Something makes the wait important.','The person makes a choice.']
};
export function safeStory(value:unknown):StoryPlan {
  const input=value && typeof value==='object'? value as Partial<StoryPlan>:{} as Partial<StoryPlan>;
  const validQuestion = input.question && Object.prototype.hasOwnProperty.call(storyQuestions,input.question);
  const sourceShots=Array.isArray(input.shots)?input.shots:[];
  const sourceNotes=Array.isArray(input.notes)?input.notes:[];
  return {
    question:validQuestion?input.question as StoryQuestion:INITIAL_STORY.question,
    shots:[0,1,2].map(i=>['wide','medium','close'].includes(sourceShots[i])?sourceShots[i]:INITIAL_STORY.shots[i]) as StoryPlan['shots'],
    notes:[0,1,2].map(i=>typeof sourceNotes[i]==='string'?sourceNotes[i].slice(0,240):INITIAL_STORY.notes[i]) as StoryPlan['notes']
  };
}
