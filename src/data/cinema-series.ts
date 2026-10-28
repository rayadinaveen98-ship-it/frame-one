/**
 * The editorial spine of Frame One's first six offline film journeys.
 * Copy guides observation; it never implies videos or exercises we don't have.
 * Each act covers a contiguous subset of the existing collection.
 */
import {cinemaShelves} from './cinema-library';

export interface FilmAct{
  title:string;
  cue:string;
  reflection:string;
  count:number;
}
export interface FilmSeries{
  id:string;
  invitation:string;
  closing:string;
  acts:readonly FilmAct[];
}
export const filmSeries:readonly FilmSeries[]=[
  {
    id:'beginnings',
    invitation:'Before learning how to make a film, start by noticing what makes moving images matter to us.',
    closing:'Cinema can begin with a single observation. What everyday moment would you film?',
    acts:[
      {title:'The first flicker',cue:'Look for the difference between watching and truly observing.',reflection:'What draws you back to a film after the credits?',count:2},
      {title:'A shared language',cue:'Notice how shots and genres shape what we expect to feel.',reflection:'How could one scene change when its genre changes?',count:2},
      {title:'Close to home',cue:'Explore stories and filmmaking traditions around you.',reflection:'Which local image deserves to be on screen?',count:1}
    ]
  },
  {
    id:'storytelling',
    invitation:'A film begins as a question, becomes a choice, and finally becomes a moment an audience can feel.',
    closing:'Write down one small decision a character could make. You may have the beginning of a film.',
    acts:[
      {title:'Find the heartbeat',cue:'Watch how a simple idea becomes a sequence of actions.',reflection:'What does the character want right now?',count:2},
      {title:'Give it a human face',cue:'Notice behaviour before dialogue: what can a face or gesture tell us?',reflection:'What would your character do if nobody spoke?',count:2},
      {title:'Let the image speak',cue:'Listen to the pauses as carefully as the words.',reflection:'Could one shot replace a line of dialogue?',count:2}
    ]
  },
  {
    id:'visual',
    invitation:'Your camera is not simply recording the world. Each frame asks the audience to notice something.',
    closing:'Look at the same place from two different positions. What has changed about its meaning?',
    acts:[
      {title:'Choose what we see',cue:'Start by changing the distance and position of the viewer.',reflection:'Who or what should the audience see first?',count:2},
      {title:'Shape the feeling',cue:'Watch how light, composition, and motion redirect attention.',reflection:'What could you hide in shadow?',count:3},
      {title:'Look through a different eye',cue:'Compare the choices of perspective and colour.',reflection:'Which colour or perspective tells the truth of your scene?',count:2}
    ]
  },
  {
    id:'sound-cut',
    invitation:'Half of cinema is felt before it is seen. Follow the sound, then discover how time is shaped.',
    closing:'Close your eyes for one minute. How could those sounds become the opening of a scene?',
    acts:[
      {title:'Hear the world',cue:'Begin with the sounds that exist inside and around a place.',reflection:'Which quiet sound changes the mood most?',count:2},
      {title:'Feel time shift',cue:'Notice when music and cuts invite the audience to anticipate.',reflection:'When should a cut arrive—and when should it wait?',count:2},
      {title:'Make the moment believable',cue:'Follow the details that connect shots and set a rhythm.',reflection:'What happens if two shots hold for one beat longer?',count:2}
    ]
  },
  {
    id:'studio',
    invitation:'A film can change with one choice. Experiment with the image, sound, colour, and order of a small moment.',
    closing:'Keep one creative choice that surprised you. That is a direction worth exploring.',
    acts:[
      {title:'Compose the moment',cue:'Try a different crop, then change the direction of light.',reflection:'Which choice changed the feeling more?',count:2},
      {title:'Make it move and breathe',cue:'Experiment with the soundtrack, the cut, and the colour.',reflection:'Which element made the same moment feel new?',count:3},
      {title:'Connect the pieces',cue:'Look for continuity, then design your own tiny sequence.',reflection:'What would the audience understand from only three shots?',count:2}
    ]
  },
  {
    id:'film-team',
    invitation:'One person can imagine a scene; many people help make it real. Follow how those jobs connect.',
    closing:'Choose the role you are most curious about, then imagine how you would collaborate on one scene.',
    acts:[
      {title:'People behind the image',cue:'Meet the crafts that turn a story into a shared effort.',reflection:'Whose decision changes the shot before the camera rolls?',count:2},
      {title:'Work together',cue:'Discover what each department needs from the others.',reflection:'What question should a director ask their crew?',count:2},
      {title:'Step onto the set',cue:'Explore the roles in a practical film-making workflow.',reflection:'Which crew member would you ask to solve a difficult scene?',count:1}
    ]
  }
] as const;

export function seriesById(id:string):FilmSeries|undefined{
  return filmSeries.find(series=>series.id===id);
}
export function actAtIndex(series:FilmSeries,entryIndex:number):number{
  let start=0;
  for(let i=0;i<series.acts.length;i++){
    start+=series.acts[i].count;
    if(entryIndex<start)return i;
  }
  return Math.max(0,series.acts.length-1);
}
export function seriesLessonPosition(seriesId:string,lessonId:string){
  const shelf=cinemaShelves.find(s=>s.id===seriesId);
  if(!shelf)return null;
  const lessons=shelf.entries.filter(e=>e.kind==='lesson');
  const index=lessons.findIndex(e=>e.id===lessonId);
  return index<0?null:{shelf,index,count:lessons.length,
    prev:index>0?lessons[index-1].id:null,
    next:index<lessons.length-1?lessons[index+1].id:null,
    actIndex:actAtIndex(seriesById(seriesId)!,shelf.entries.findIndex(e=>e.id===lessonId))};
}
