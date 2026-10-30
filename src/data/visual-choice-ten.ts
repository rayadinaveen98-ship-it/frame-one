/** Ten original filmmaking decisions, each linked to real curriculum and
 * a materially changing visual example. No simulated playback or fake audio.
 * All editorial observations are non-universal: context can change meaning.
 */
import type {VisualPilot,VisualPilotId} from './visual-lessons';

type ChoiceId=Extract<VisualPilotId,
 'story'|'script'|'acting'|'character'|'dialogue'|'camera'|'movement'|'lenses'|'music'|'editing'>;

export const tenChoices:Readonly<Record<ChoiceId,VisualPilot>>={
 story:{
  id:'story',index:'07',eyebrow:'THE STORYTELLER’S EYE / STAKES',
  question:'Same search. Why should we care?',
  hook:'An object is missing. Give the character something to lose.',
  takes:[
   {label:'A · LOST KEY',cue:'A key is missing from a desk',focus:'A small problem without its consequence',
    description:'A person searches a tabletop for a key. We can follow the action, but we do not yet know why finding it matters.'},
   {label:'B · WHAT IT OPENS',cue:'A box holds an important letter',focus:'The missing key is tied to a personal goal',
    description:'The same missing key now opens a box holding an important letter. The goal has a reason and possibly greater stakes.'}
  ],
  discovery:'The action stayed simple. Knowing what the key opens changes our understanding of the search.',
  reason:'Stakes are the possible consequences of success or failure. An ordinary object can matter because of a character’s relationship to it, not because every movie needs extreme danger.',
  notice:['Locate the same missing key in both panels','Look for the letter revealed in the second version','Ask what the character risks missing'],
  takeaway:'Story stakes turn a simple action into a meaningful choice.',
  prompt:'Film a person looking for one object. Give the object a clear reason to matter without adding a speech.',
  lab:'story',labLabel:'Plan a story in the Make Lab',
  footnote:'Original storyboard illustrations. The letter is a fictional story detail, not real personal information.'
 },
 script:{
  id:'script',index:'08',eyebrow:'THE WRITER’S EYE / FILMABLE ACTION',
  question:'Can a camera film this sentence?',
  hook:'Translate an internal thought into something observable.',
  takes:[
   {label:'A · ABSTRACT IDEA',cue:'“He feels uneasy.”',focus:'We know the intention but not the visible action',
    description:'A script note names an inner feeling, but offers no specific action or image for an actor or camera to perform.'},
   {label:'B · PLAYABLE ACTION',cue:'“He hides the letter.”',focus:'An observable action makes the idea shootable',
    description:'A person folds a letter and quietly hides it when someone approaches. Viewers can interpret the action in context.'}
  ],
  discovery:'Both versions suggest an intention. The second also gives the cast and crew something concrete to show.',
  reason:'A screenplay communicates actions, sounds and dialogue that can be produced. Inner states can guide actors, but clear observable behavior helps teams plan and shoot.',
  notice:['Look for an action the actor can perform','Identify a visible prop that carries information','Ask what remains open to interpretation'],
  takeaway:'Write actions people can perform and cameras can show.',
  prompt:'Replace one vague feeling in a scene outline with a filmable action using a real object.',
  lab:'story',labLabel:'Translate it in the Make Lab',
  footnote:'Original screenplay-study illustration; these are examples, not rigid rules for professional script formatting.'
 },
 acting:{
  id:'acting',index:'09',eyebrow:'THE ACTOR’S EYE / PERFORMANCE',
  question:'Same line. What can a body add?',
  hook:'Hold the words constant. Change posture and eye direction.',
  takes:[
   {label:'A · OPEN GREETING',cue:'“I am here.” · upright posture',focus:'Facing the other character supports a straightforward greeting',
    description:'The actor faces forward with open shoulders and a raised head while speaking the same words.'},
   {label:'B · GUARDED ARRIVAL',cue:'“I am here.” · turned away',focus:'Turned shoulders can suggest a different relationship',
    description:'The same line is spoken while the actor looks away and folds their arms. The meaning depends on the situation.'}
  ],
  discovery:'Nothing about the spoken words changed. Performance supplies additional clues.',
  reason:'Acting choices include eye line, gesture, timing, voice and body orientation. These choices do not determine one emotion automatically.',
  notice:['Compare the direction of the eyes','Observe what the arms and shoulders are doing','Imagine how delivery might further change meaning'],
  takeaway:'Performance is what a character does, not only what they say.',
  prompt:'Film yourself saying the same short line with two different postures and eye lines. Compare without music.',
  lab:'story',labLabel:'Stage a character choice',
  footnote:'Original static poses; no live acting, voice playback or measured emotional response.'
 },
 character:{
  id:'character',index:'10',eyebrow:'THE CHARACTER’S EYE / OBSTACLES',
  question:'What makes a character choose?',
  hook:'Give someone a goal, then place a decision in their path.',
  takes:[
   {label:'A · CLEAR PATH',cue:'The exit is open',focus:'We can see the destination with no obvious obstacle',
    description:'An illustrated person faces an open doorway. Their immediate goal appears reachable without a visible complication.'},
   {label:'B · BLOCKED PATH',cue:'The door is locked',focus:'The character must now decide what to do',
    description:'The same doorway is locked and a small sign says CLOSED. The character must look for a new approach or change their goal.'}
  ],
  discovery:'The goal did not change. Introducing an obstacle creates a question about the next action.',
  reason:'A character becomes legible through wants, obstacles and choices. Obstacles can be external or internal, and dramatic meaning comes from their context.',
  notice:['Find the goal in both versions','Identify the object blocking the way','Imagine two credible next decisions'],
  takeaway:'A character becomes active when they respond to an obstacle.',
  prompt:'Draw or shoot a person trying to reach a door or object. Add one simple obstacle and imagine two choices.',
  lab:'story',labLabel:'Explore choices in the Make Lab',
  footnote:'Original diagram of a story obstacle; not a game with predetermined correct choices.'
 },
 dialogue:{
  id:'dialogue',index:'11',eyebrow:'THE DIALOGUE WRITER’S EYE / SUBTEXT',
  question:'Can “I’m fine” mean more than it says?',
  hook:'Keep the exact words. Watch the behavior around them.',
  takes:[
   {label:'A · DIRECT ANSWER',cue:'“I’m fine.” · steady eye contact',focus:'The response and outward action align',
    description:'The character speaks the same short line while facing another person with relaxed posture.'},
   {label:'B · HIDING SOMETHING',cue:'“I’m fine.” · avoids eye contact',focus:'The action might complicate the words',
    description:'The same short line appears, but the person turns away and folds a letter. Their intention remains open to interpretation.'}
  ],
  discovery:'Dialogue communicates words. Performance and action can complicate their meaning.',
  reason:'Subtext is possible meaning beneath spoken lines. It can arise from context, relationship, gesture and timing—not a guaranteed interpretation of one glance.',
  notice:['Read the identical line in both frames','Watch the head and eye direction','Notice the second frame includes a letter'],
  takeaway:'What characters do can change how we hear what they say.',
  prompt:'Write “I’m fine” once. Shoot two versions with different actions but unchanged words.',
  lab:'story',labLabel:'Plan a dialogue moment',
  footnote:'Illustrated line delivery, with no actual actor recording or spoken audio.'
 },
 camera:{
  id:'camera',index:'12',eyebrow:'THE CINEMATOGRAPHER’S EYE / CAMERA HEIGHT',
  question:'What changes when the camera goes lower?',
  hook:'Hold the character in view; change the illustrated camera height.',
  takes:[
   {label:'A · EYE-LEVEL',cue:'A level view of one person',focus:'The camera and subject are approximately level',
    description:'An eye-level illustration frames a person and the surrounding room with a relatively straightforward vertical relationship.'},
   {label:'B · LOW ANGLE',cue:'Camera looks upward',focus:'More ceiling and upward perspective are visible',
    description:'A lower illustrated viewpoint looks up at the same person. Foreground height and perspective cues become more prominent.'}
  ],
  discovery:'The person is the same; camera placement alters which surfaces and relationships are visible.',
  reason:'Camera height, tilt and distance can change perspective and attention. A low angle is not automatically powerful; the story and performance matter.',
  notice:['Compare the amount of ceiling in both frames','Trace the changing horizon and floor lines','Ask which angle serves the scene'],
  takeaway:'Where the camera sits is a storytelling decision.',
  prompt:'Photograph a still object at eye level and from lower down. Keep a safe distance and compare the background.',
  lab:'frame',labLabel:'Experiment with framing in the Frame Lab',
  footnote:'Original perspective sketches, not simulated camera optics or a guarantee of emotional effect.'
 },
 movement:{
  id:'movement',index:'13',eyebrow:'THE CAMERA OPERATOR’S EYE / MOVEMENT',
  question:'Did the camera turn—or travel?',
  hook:'Compare a pan from one spot with a sideways camera move.',
  takes:[
   {label:'A · PAN',cue:'Rotate from a fixed position',focus:'The camera direction changes, but its origin stays put',
    description:'A top-down diagram shows one camera in one location rotating its view from left to right.'},
   {label:'B · TRACK',cue:'Shift the camera to a new position',focus:'The viewpoint travels sideways in space',
    description:'A second top-down diagram shows the camera changing position while facing toward the same scene.'}
  ],
  discovery:'Both can reveal information. Only the tracking move changes the camera’s physical location.',
  reason:'Panning rotates camera direction; a tracking or dolly move changes camera position. Their parallax and perspective can differ, especially with nearby objects.',
  notice:['Follow the camera origin in both diagrams','See whether the direction arrow rotates or stays parallel','Spot the foreground object that makes parallax relevant'],
  takeaway:'A pan rotates; a tracking move travels.',
  prompt:'From one safe spot, pan toward a doorway. Then walk sideways slowly while aiming toward the same area. Compare.',
  lab:'frame',labLabel:'Explore framing choices',
  footnote:'Original top-down movement diagrams, not live motion footage or measured camera trajectories.'
 },
 lenses:{
  id:'lenses',index:'14',eyebrow:'THE LENS TECHNICIAN’S EYE / PERSPECTIVE',
  question:'Does zooming equal walking closer?',
  hook:'Distinguish framing from camera position.',
  takes:[
   {label:'A · CROP FROM HERE',cue:'Same camera position, tighter field of view',focus:'The near and far objects keep their size relationship',
    description:'From one position, a narrower field of view crops the image. Perspective relationships remain tied to the unchanged viewpoint.'},
   {label:'B · STEP CLOSER',cue:'Move camera position closer',focus:'The near object grows relative to the background',
    description:'Moving the camera closer changes its viewpoint. The near object grows in relative size and the background relationship shifts.'}
  ],
  discovery:'Matching the subject’s apparent size does not guarantee matching perspective.',
  reason:'Field of view depends on lens and sensor. Perspective relationships depend primarily on camera position. Cropping a picture from one spot is not the same as physically moving.',
  notice:['Compare the relative sizes of foreground and background circles','Notice the camera position marker','Ask what stayed fixed between the two choices'],
  takeaway:'Focal length frames; camera position changes perspective.',
  prompt:'At a safe distance, take one zoomed photo and another from a closer position. Compare how background objects relate.',
  lab:'frame',labLabel:'Compare framing in the Frame Lab',
  footnote:'Simplified educational size diagram: not a physically calibrated lens or depth-of-field simulator.'
 },
 music:{
  id:'music',index:'15',eyebrow:'THE COMPOSER’S EYE / SCORING',
  question:'Same picture. What might the score suggest?',
  hook:'Read two original, imagined music directions with the image locked.',
  takes:[
   {label:'A · QUIET PULSE',cue:'Imagined sparse, gentle tones',focus:'Long spaces between sounds leave room for observation',
    description:'Picture someone waiting by a window with imagined sparse, gentle notes and long silences.'},
   {label:'B · UNEASY PULSE',cue:'Imagined low, irregular rhythm',focus:'Irregular pulses may create different expectations',
    description:'The exact same image stays locked while a different imagined musical direction uses low, uneven pulses.'}
  ],
  discovery:'The picture did not move. Different scoring ideas invite different expectations.',
  reason:'Music can establish patterns, guide timing and suggest narrative possibilities, but no cue produces the same feeling in every viewer.',
  notice:['Confirm that the background image is identical','Read which music parameters changed','Imagine how long silences might leave space for a character'],
  takeaway:'Music can influence expectations without rewriting the image.',
  prompt:'Watch a short clip you made in silence, then imagine two different music cues. If you add real music, use original or licensed audio.',
  lab:'sound',labLabel:'Try original sound sketches in the Sound Lab',
  footnote:'These are written imaginary score directions, NOT playable music or a recording of sound.'
 },
 editing:{
  id:'editing',index:'16',eyebrow:'THE EDITOR’S EYE / REVEAL ORDER',
  question:'What happens when we reorder the shots?',
  hook:'Keep three illustrated shots. Change the order of information.',
  takes:[
   {label:'A · PLACE FIRST',cue:'Wide → Hand → Cup',focus:'The space is established before we inspect the action',
    description:'A three-panel storyboard shows the setting first, then the reaching hand, then the cup detail.'},
   {label:'B · DETAIL FIRST',cue:'Cup → Hand → Wide',focus:'The detail begins the question before the location is revealed',
    description:'The very same three storyboard drawings are reordered: first the cup, then the reaching hand, and finally the wider setting.'}
  ],
  discovery:'Nothing new was filmed. Reordering the same images changes when context becomes available.',
  reason:'An edit controls which information arrives first, how a viewer links shots and the relationship between action and reaction. It does not guarantee suspense.',
  notice:['Identify the identical three drawings','Compare which detail is revealed first','Ask which order suits your intended scene'],
  takeaway:'Editing is the order in which an audience receives information.',
  prompt:'Film three simple shots of an action. Build two sequences with exactly the same footage but a different order.',
  lab:'cut',labLabel:'Reorder shots in the Cut Lab',
  footnote:'Original illustrated edit plans, not actual video footage, film playback or an outcome prediction.'
 }
};
