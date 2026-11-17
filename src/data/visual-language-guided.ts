import curriculum from './curriculum.v08b.json';
import type {Lesson} from './schema';
import type {GuidedFoundation} from './foundations-guided';

/** Chapter 3: use original Frame One factual curriculum, not renamed V2 lessons. */
type VisualGuide=Omit<GuidedFoundation,'id'|'legacyId'|'lesson'|'chapterId'>;
const chapter=curriculum.chapters[2] as {ids:string[]};
export const VISUAL_IDS=chapter.ids as readonly string[];
const lessons=new Map((curriculum.lessons as unknown as Lesson[]).map(lesson=>[lesson.id,lesson]));

/** Creative decisions explore trade-offs, never grade subjective taste. */
const guides:Record<string,VisualGuide>={
 shot:{
  prompt:'A filmmaker stops on a street after reading a message. What should we see?',
  observe:'A beautiful shot is not automatically a useful shot. First ask what the story needs us to notice.',
  notice:'Compare the same original illustrated street at three crops. Cropping changes information, not the camera’s physical perspective.',
  choices:[
   {label:'Show the whole street',view:'wide',filter:'neutral',note:'The environment can tell us where the character is and what they might be searching for.'},
   {label:'Focus on body language',view:'medium',filter:'neutral',note:'A medium view can keep action and surrounding context in balance.'},
   {label:'Focus on one detail',view:'close',filter:'neutral',note:'A tighter crop gives an object more attention but removes context. Tight is not inherently more emotional.'}
  ],
  explorerLabel:'Compare shot sizes',
  explorer:[
   {label:'Wide',heading:'Show relationships',detail:'A wide view can establish space, distance and action, but may hide a small reaction.'},
   {label:'Medium',heading:'Show a person in context',detail:'A medium view can support gesture and nearby story information.'},
   {label:'Close',heading:'Show detail',detail:'A closer framing enlarges a face or object while withholding surroundings. Meaning comes from the edit and story.'}
  ],
  sceneLabel:'ORIGINAL STORYBOARD · FRAMING STUDY',sources:[]
 },
 camera:{
  prompt:'You want to understand the character’s reaction. Where should the camera be placed?',
  observe:'The camera’s location, direction and height help shape what is visible and what stays hidden.',
  notice:'The camera-plan diagram is a diagram, not a rendered live camera-angle simulation. An angle never has one fixed meaning.',
  choices:[
   {label:'Watch from the street',view:'wide',filter:'neutral',note:'A distant street view can reveal environment and the character’s position in it.'},
   {label:'Move closer to the person',view:'medium',filter:'neutral',note:'Changing camera position can change perspective relationships as well as framing.'},
   {label:'Study the gesture',view:'close',filter:'neutral',note:'A closer shot can direct attention to a detail; the subject’s meaning still comes from context.'}
  ],
  explorerLabel:'Position, direction, height',
  explorer:[
   {label:'Place',heading:'Where is the camera?',detail:'Moving camera position affects spatial relationships. Getting closer is different from cropping an unchanged frame.'},
   {label:'Aim',heading:'Where does the camera point?',detail:'Rotating the camera can reveal different information without moving its position.'},
   {label:'Height',heading:'What level is the lens?',detail:'A low or high camera can change our view of a person; it does not automatically mean power or weakness.'}
  ],
  sceneLabel:'CAMERA BLOCKING STUDY · ORIGINAL ILLUSTRATION',sources:[]
 },
 lighting:{
  prompt:'The filmmaker needs to read the message. Which lighting approach helps show that?',
  observe:'Light direction, size, distance and intensity change visibility, shape and contrast.',
  notice:'The colour-filter preview is only a conceptual treatment. It does not calculate real light direction, shadows or exposure.',
  choices:[
   {label:'Keep the existing scene',view:'medium',filter:'neutral',note:'The baseline image lets you judge what details are already visible.'},
   {label:'Try a warm treatment',view:'medium',filter:'warm',note:'Warm-looking colours may change perception, but this is a filter—not physical relighting.'},
   {label:'Try higher contrast',view:'medium',filter:'contrast',note:'A stronger contrast treatment may emphasise shapes but lose shadow detail. Real light placement is a separate choice.'}
  ],
  explorerLabel:'Study light without a fake simulation',
  explorer:[
   {label:'Direction',heading:'Where does the light arrive?',detail:'Front, side and back light reveal different surfaces. The diagram describes positions, not a physical render.'},
   {label:'Size',heading:'How soft are the shadows?',detail:'A larger apparent source often produces softer-edged shadows under comparable conditions.'},
   {label:'Intensity',heading:'What remains visible?',detail:'More or less light changes exposure and contrast, depending on camera settings and surrounding sources.'}
  ],
  sceneLabel:'LIGHT STUDY · FILTER IS NOT RELIGHTING',sources:[]
 },
 composition:{
  prompt:'Your character is alone in a busy street. What arrangement draws attention to their situation?',
  observe:'Composition organises subjects, empty space, lines and visual contrast inside the frame.',
  notice:'The rule of thirds is an optional guide. Centered, off-centre and asymmetric framing can each be effective.',
  choices:[
   {label:'Keep more surroundings',view:'wide',filter:'neutral',note:'Environment and negative space can tell us about a situation, but they do not guarantee loneliness.'},
   {label:'Balance person and place',view:'medium',filter:'neutral',note:'A mid-size view can preserve expression and location together.'},
   {label:'Exclude distractions',view:'close',filter:'neutral',note:'Removing unnecessary information can guide attention, at the cost of losing spatial context.'}
  ],
  explorerLabel:'Compare three arrangements',
  explorer:[
   {label:'Center',heading:'A stable focal point',detail:'A centered subject can feel purposeful, still or confrontational; this depends on the scene.'},
   {label:'Thirds',heading:'An optional organising guide',detail:'The nine-cell grid suggests placements, but good compositions do not have to use its intersections.'},
   {label:'Space',heading:'Let the environment speak',detail:'Negative space can lead the eye or reveal story context. It is neither automatically empty nor automatically lonely.'}
  ],
  sceneLabel:'FRAMING GUIDE · ORIGINAL STORYBOARD',sources:[]
 },
 movement:{
  prompt:'The filmmaker hears a sound offscreen. How should the camera reveal what happened?',
  observe:'A pan changes where the camera points. A tracking move changes where the camera is.',
  notice:'The camera path graphic is a top-down conceptual diagram. It is not simulated captured footage or a true optical motion model.',
  choices:[
   {label:'Keep the view still',view:'wide',filter:'neutral',note:'Stillness can invite viewers to search the frame or anticipate new information.'},
   {label:'Reveal the source slowly',view:'medium',filter:'neutral',note:'A pan rotates the view without necessarily moving the camera’s position.'},
   {label:'Move to follow the subject',view:'close',filter:'neutral',note:'A tracking movement physically changes camera position and relationships in depth.'}
  ],
  explorerLabel:'Which motion is which?',
  explorer:[
   {label:'Hold',heading:'Let the action move',detail:'A fixed camera can create tension or clarity without adding motion.'},
   {label:'Pan',heading:'Rotate, stay in place',detail:'A pan turns the camera left or right. A tilt turns it up or down.'},
   {label:'Track',heading:'Change position',detail:'A tracking or dolly move travels through space. Moving position creates different perspective relationships.'}
  ],
  sceneLabel:'MOVEMENT CONCEPT · NOT A CAMERA FOOTAGE SIMULATION',sources:[]
 },
 lenses:{
  prompt:'The subject stays on the street, but you need different amounts of background. What can you change?',
  observe:'Focal length changes field of view on a given sensor. Camera position has the main effect on perspective.',
  notice:'Cropping this existing drawing resembles a narrower field of view. It does not simulate optical lens rendering or a change of viewpoint.',
  choices:[
   {label:'Keep a wide field of view',view:'wide',filter:'neutral',note:'More surroundings stay visible. Perspective relationships are still determined by camera position.'},
   {label:'Use a narrower crop',view:'medium',filter:'neutral',note:'The frame excludes more environment. This is a crop demo, not a focal-length change with optics.'},
   {label:'Inspect a close crop',view:'close',filter:'neutral',note:'A tight crop from the same position does not recreate the perspective from physically moving closer.'}
  ],
  explorerLabel:'Separate field of view from perspective',
  explorer:[
   {label:'Wide',heading:'A wider field of view',detail:'At the same sensor size and position, a shorter focal length usually captures a wider angle.'},
   {label:'Long',heading:'A narrower field of view',detail:'At the same sensor size and position, a longer focal length usually shows less of the scene.'},
   {label:'Move',heading:'Position changes perspective',detail:'Moving the camera changes how foreground and background relate. Cropping from one position does not.'}
  ],
  sceneLabel:'FIELD-OF-VIEW CROP · NOT A LENS SIMULATOR',sources:[]
 },
 colour:{
  prompt:'The character sees an important message. What colour treatment supports what you want us to notice?',
  observe:'Colour in a film involves objects, sets, costume, lighting, capture and post-production decisions.',
  notice:'Our illustrated treatments change screen colours only. No palette has a guaranteed universal emotional meaning.',
  choices:[
   {label:'Keep the neutral palette',view:'medium',filter:'neutral',note:'A neutral illustration keeps the original visual differences. It is not emotion-free.'},
   {label:'Explore warm colour',view:'medium',filter:'warm',note:'A warm treatment may shift attention or associations, but cannot dictate an emotion.'},
   {label:'Explore cool colour',view:'medium',filter:'cool',note:'A cool treatment may feel different in context; this simple filter is not a calibrated colour-grade.'}
  ],
  explorerLabel:'Read colour in context',
  explorer:[
   {label:'Subject',heading:'Where is the accent?',detail:'A small saturated object against a quieter background may attract the eye.'},
   {label:'Palette',heading:'How do colours relate?',detail:'Contrast and harmony depend on several colours together, not a single magic hue.'},
   {label:'Context',heading:'What does the story tell us?',detail:'Red can signal romance, celebration or danger depending on setting and experience. No fixed emotional dictionary exists.'}
  ],
  sceneLabel:'ORIGINAL COLOUR STUDY · CONCEPTUAL FILTER',sources:[]
 }
};
export const VISUAL_LANGUAGE:readonly GuidedFoundation[]=VISUAL_IDS.map(id=>{
 const lesson=lessons.get(id),entry=guides[id];
 if(!lesson||!entry)throw new Error('Unknown visual-language curriculum lesson '+id);
 return {id,legacyId:lesson.id,chapterId:2,lesson,...entry};
});
export function visualLanguageById(id:string):GuidedFoundation|undefined{
 return VISUAL_LANGUAGE.find(item=>item.id===id);
}
