/** Editorial shelves. Every entry points at real offline curriculum or a working Lab.
 * Adding content later means editing data, not rewriting the Home layout.
 */
import type {LabName} from '../legacy/bridge';
export type PosterArt='projector'|'story'|'frame'|'light'|'sound'|'cut'|'studio'|'crew';
export type CinemaEntry=
  |{kind:'lesson';id:string;art:PosterArt}
  |{kind:'lab';id:LabName;title:string;subtitle:string;art:PosterArt}
  |{kind:'roles';id:'crafts';title:string;subtitle:string;art:PosterArt};
export interface CinemaShelf {
  id:string;
  heading:string;
  introduction:string;
  entries:readonly CinemaEntry[];
}
const lesson=(id:string,art:PosterArt):CinemaEntry=>({kind:'lesson',id,art});
const lab=(id:LabName,title:string,subtitle:string,art:PosterArt):CinemaEntry=>
  ({kind:'lab',id,title,subtitle,art});
export const cinemaShelves:readonly CinemaShelf[]=[
  {id:'beginnings',heading:'Where cinema begins',
   introduction:'Understand the images that started it all.',
   entries:[
     lesson('why','projector'),lesson('history','projector'),lesson('units','frame'),
     lesson('genres','story'),lesson('india','crew')
   ]},
  {id:'storytelling',heading:'A story takes shape',
   introduction:'From an idea to characters, decisions and action.',
   entries:[
     lesson('story','story'),lesson('script','story'),lesson('character','crew'),
     lesson('acting','crew'),lesson('dialogue','sound'),lesson('showdonttell','frame')
   ]},
  {id:'visual',heading:'What the camera reveals',
   introduction:'Composition, movement, light and colour.',
   entries:[
     lesson('shot','frame'),lesson('camera','frame'),lesson('lighting','light'),
     lesson('composition','frame'),lesson('movement','cut'),lesson('lenses','projector'),
     lesson('colour','light')
   ]},
  {id:'sound-cut',heading:'The unseen half of cinema',
   introduction:'Listen, cut and discover how a scene changes.',
   entries:[
     lesson('sound','sound'),lesson('ambience','sound'),lesson('music','sound'),
     lesson('editing','cut'),lesson('continuity','cut'),lesson('rhythm','cut')
   ]},
  {id:'studio',heading:'Your director’s workbench',
   introduction:'Real interactive experiments. Make a choice and see what changes.',
   entries:[
     lab('frame','Find the frame','Crop and compose a single moment.','frame'),
     lab('light','Shape the light','Move light and change the mood.','light'),
     lab('sound','Reimagine the sound','Listen to a moment differently.','sound'),
     lab('cut','Make the cut','Change the order and rhythm.','cut'),
     lab('colour','Explore colour','Watch colour guide attention.','light'),
     lab('continuity','Keep it consistent','Spot what changes between shots.','cut'),
     lab('story','Make three shots','Sketch your first small scene.','studio')
   ]},
  {id:'film-team',heading:'Behind every frame',
   introduction:'Meet the people and decisions that make films possible.',
   entries:[
     lesson('crew','crew'),lesson('craft24','studio'),lesson('teams','crew'),
     lesson('pipeline','cut'),
     {kind:'roles',id:'crafts',title:'Meet the film roles',
       subtitle:'Explore the people behind production.',art:'crew'}
   ]}
] as const;
export const allLibraryEntries=cinemaShelves.flatMap(shelf=>shelf.entries);
