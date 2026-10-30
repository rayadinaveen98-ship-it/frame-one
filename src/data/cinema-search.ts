/** The offline home search is a READ-ONLY index over actual published content.
 * No remote API, saved search history or separate lesson-progress model.
 */
import curriculum from './curriculum.v08b.json';
import {allLibraryEntries,type CinemaEntry} from './cinema-library';
import type {Lesson} from './schema';

export type CinemaSearchResult={
  entry:CinemaEntry;
  title:string;
  subtitle:string;
  category:string;
  minutes:number|null;
};

const lessons=curriculum.lessons as unknown as Lesson[];
const byId=new Map(lessons.map(lesson=>[lesson.id,lesson]));
const additionalTerms:Readonly<Record<string,string>>={
  lighting:'light shadows mood cinematography exposure',
  shot:'shot sizes wide medium close closeup framing visual',
  composition:'framing visual balance camera cinematography',
  camera:'cinematography filming camera work',
  lenses:'focus depth of field camera',
  editing:'edit cut rhythm pacing montage',
  rhythm:'pacing editing cuts timing',
  sound:'audio silence quiet natural sound voice sound design',
  ambience:'silence quiet sound atmosphere background noise',
  music:'score soundtrack background music emotion',
  dialogue:'dialog speech voice conversation',
  story:'direction storytelling narrative plot',
  showdonttell:'visual storytelling without dialogue silence',
  crew:'filmmaker director cinematographer producer film team',
  script:'screenwriting screenplay writing',
  'lab:story':'director storyboard filmmaking shoot plan',
  'lab:light':'lighting mood light shadows',
  'lab:frame':'camera shot composition framing',
  'lab:cut':'edit editing rhythm pacing',
  'lab:sound':'audio music ambience silence sound',
  'roles:crafts':'director cinematographer editor actors producer jobs film crew'
};

export const cinemaSearchIndex:readonly CinemaSearchResult[]=allLibraryEntries.map(entry=>{
  if(entry.kind==='lesson'){
    const lesson=byId.get(entry.id);
    if(!lesson)throw Error('Cinema library references missing lesson '+entry.id);
    return {
      entry,title:lesson.title,subtitle:lesson.subtitle,category:lesson.unit,
      minutes:lesson.minutes
    };
  }
  return {
    entry,title:entry.title,subtitle:entry.subtitle,
    category:entry.kind==='lab'?'Creative Lab':'Film roles',minutes:null
  };
});

function normalize(value:string):string{
  return value.normalize('NFKC').toLowerCase().trim().replace(/\s+/g,' ');
}

/** Ranked AND-token matching. An empty field cannot generate results. */
export function searchCinemaLibrary(raw:string,maxResults=8):{total:number;results:readonly CinemaSearchResult[]}{
  const query=normalize(raw).slice(0,100);
  if(!query)return {total:0,results:[]};
  const tokens=query.split(' ').filter(Boolean);
  const scored=cinemaSearchIndex.map((item,index)=>{
    const title=normalize(item.title);
    const subtitle=normalize(item.subtitle);
    const category=normalize(item.category);
    const aliases=normalize(additionalTerms[item.entry.kind==='lesson'?item.entry.id:item.entry.kind+':'+item.entry.id]??'');
    const combined=[title,subtitle,category,aliases].join(' ');
    if(!tokens.every(token=>combined.includes(token)))return null;
    let score=0;
    if(title===query)score+=100;
    if(title.startsWith(query))score+=50;
    if(title.includes(query))score+=26;
    if(subtitle.includes(query))score+=12;
    if(category.includes(query))score+=8;
    if(aliases.includes(query))score+=5;
    for(const token of tokens){
      if(title.split(/[^\p{L}\p{N}]+/u).includes(token))score+=9;
      else if(title.includes(token))score+=5;
      if(subtitle.includes(token))score+=2;
    }
    return {item,score,index};
  }).filter((value):value is {item:CinemaSearchResult;score:number;index:number}=>value!==null);
  scored.sort((a,b)=>b.score-a.score||a.index-b.index);
  const limit=Number.isFinite(maxResults)?Math.max(0,Math.min(50,Math.trunc(maxResults))):8;
  return {total:scored.length,results:scored.slice(0,limit).map(value=>value.item)};
}
