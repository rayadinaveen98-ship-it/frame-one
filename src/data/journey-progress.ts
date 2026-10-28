/**
 * Pure, offline re-entry summaries based on the ORIGINAL lesson completion key.
 *
 * No visit timestamps are recorded, so this is ordered by unfinished-first and
 * lessons finished, never presented as "recently watched".
 * Studio/Labs are excluded because there is no verified completion signal.
 */
import {cinemaShelves,type CinemaEntry} from './cinema-library';
import {actAtIndex,seriesById} from './cinema-series';

export interface JourneyResume{
  id:string;
  heading:string;
  completed:number;
  total:number;
  allDone:boolean;
  actIndex:number;
  actTitle:string;
  nextEntry:Extract<CinemaEntry,{kind:'lesson'}>;
}

export function startedFilmJourneys(completed:ReadonlySet<string>):JourneyResume[]{
  const summaries:JourneyResume[]=[];
  for(const shelf of cinemaShelves){
    const series=seriesById(shelf.id);
    if(!series)continue;
    const lessonEntries=shelf.entries.filter(
      (entry):entry is Extract<CinemaEntry,{kind:'lesson'}>=>entry.kind==='lesson'
    );
    const total=lessonEntries.length;
    if(total===0)continue; // Labs/roles do not generate "completed" progress.
    const done=lessonEntries.filter(entry=>completed.has(entry.id)).length;
    if(done===0)continue; // Opening a collection is not proof of learning.
    const pending=lessonEntries.find(entry=>!completed.has(entry.id));
    const nextEntry=pending??lessonEntries[0];
    const entryIndex=shelf.entries.findIndex(entry=>entry.kind==='lesson'&&entry.id===nextEntry.id);
    const actIndex=actAtIndex(series,entryIndex);
    summaries.push({
      id:shelf.id,heading:shelf.heading,completed:done,total,
      allDone:done===total,actIndex,actTitle:series.acts[actIndex].title,
      nextEntry
    });
  }
  return summaries.sort((a,b)=>Number(a.allDone)-Number(b.allDone)||
    b.completed-a.completed);
}
