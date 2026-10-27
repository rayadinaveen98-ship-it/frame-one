/* Temporary compatibility bridge: exact v0.8B educational runtime.
 * The application shell has moved to React; learning engine remains isolated
 * to preserve all existing 33 lessons, seven labs and local storage keys.
 */

  (() => {
    'use strict';
    const STORAGE_KEY = 'frameone-progress-v01'; // Preserve existing v0.1/v0.2 progress
    const LANGUAGE_KEY = 'frameone-telugu-helper-v03';
    const lessons = [
      {id:'why',unit:'Foundations',num:'01',title:'Why do we watch films?',subtitle:'Films can entertain us, teach us, and help us see other lives.',minutes:3,thumb:'story',icon:'◎',sections:[
        ['Why people watch','People watch films for many reasons: to enjoy a story, laugh, feel suspense, learn about the world or see another person’s point of view. Not every film tells a fictional story; documentaries can show real people and events.'],
        ['How a film makes us feel','Imagine someone waiting for a friend who does not arrive. The story can be told in one sentence. A film might show an empty chair, a passing train and the person checking the time. Images, timing, acting and sound help us experience the wait.'],
        ['People may feel different things','Two people can watch the same scene and react differently. Their experiences and expectations can shape what they notice. Filmmakers can guide feelings, but cannot guarantee one reaction from everyone.']
      ],idea:'Films can show events and ideas while using images, sound and timing to shape our experience.',try:'Watch a short scene. What did you notice first: a person, an action, a sound or a feeling?',q:'Which choice best describes what cinema can do?',opts:['Only communicate facts','Shape how we experience a story','Make every viewer feel exactly the same'],answer:1,feedback:'Images, sound, acting and editing can influence how we feel. Different viewers may still react differently.'},
      {id:'history',unit:'Foundations',num:'02',title:'How did cinema begin?',subtitle:'Moving pictures developed through many inventions and storytellers.',minutes:4,thumb:'story',icon:'◉',sections:[
        ['Before the movie theatre','In the 1800s, inventors explored ways to capture and display movement. Early viewers sometimes watched short moving pictures through individual viewing machines rather than on a large screen.'],
        ['Pictures for an audience','On 28 December 1895, the Lumière family’s Cinématographe had a famous paid screening in Paris. This was a major moment, but not the very first moving-picture exhibition; other inventors showed moving images earlier.'],
        ['From invention to storytelling','Early films included everyday events, staged comedy and imaginative tricks. Film developed into many kinds of art and entertainment across countries. History is more than one invention or one country.']
      ],idea:'Cinema developed through the work of many people and changed as technology and storytelling changed.',try:'Imagine showing someone a moving picture for the first time. What real moment would you record?',q:'Which statement about early cinema is most accurate?',opts:['One person invented every part of cinema','Many people helped develop moving-picture technology and filmmaking','All the earliest films were feature-length fiction'],answer:1,feedback:'Moving images, cameras, projection and film storytelling developed through contributions from many inventors and artists.'},
      {id:'units',unit:'Foundations',num:'03',title:'Frame, shot, scene',subtitle:'Three common terms every beginner should know.',minutes:4,thumb:'shot',icon:'▣',sections:[
        ['Frame: one picture','Pause a video. The single image you see is a frame. What appears inside its edges—including people, objects and light—is part of its composition (how the picture is arranged).'],
        ['Shot: one continuous view','In a finished film, a shot is one uninterrupted view before the film changes to another shot. The camera can stay still or move during it. One shot contains many frames (individual pictures).'],
        ['Scene: one part of the action','A scene is a part of the story, often in one place and around one stretch of time. It may use one shot or several shots. A take is one attempt to record a shot; filmmakers may record several takes and choose one when editing.']
      ],idea:'Frame = one picture. Shot = one continuous view. Scene = one part of the story. Take = one recording attempt.',try:'Watch a short conversation. Count how often the image cuts to another shot. Is it still one scene?',q:'An argument is filmed in one unbroken take and shown without edits. How many shots do we see?',opts:['One shot','Always ten shots','One shot per line of dialogue'],answer:0,feedback:'One unbroken take shown without edits is one shot, even if it covers a whole scene.'},
      {id:'story',unit:'Storytelling',num:'04',title:'How stories create emotion',subtitle:'Expectation, surprise and character choices turn events into drama.',minutes:4,thumb:'story',icon:'✦',sections:[
        ['Give the character a reason','Imagine someone searching for a key. Now imagine that the key opens a box holding their mother’s last letter. The search matters more because we understand what the person could lose. This is what storytellers mean by the stakes.'],
        ['Make us wonder what happens next','When a character wants something, we start asking: will they get it? A problem or delay can make us more curious. Waiting for an important answer can create suspense.'],
        ['Show what someone decides','A character who is afraid to open a letter might put it away, then pick it up again. We can learn about the character from what they do, even without a speech.']
      ],idea:'We often care more when we know what a character wants, why it matters and what they choose to do.',try:'Write one sentence: ‘Someone wants ___, but ___ stands in the way.’',q:'Why does a simple problem become compelling drama?',opts:['Because it has more camera angles','Because it matters to someone and creates meaningful stakes','Because the scene uses loud music'],answer:1,feedback:'A problem can feel more important when we understand why it matters to a person.'},
      {id:'script',unit:'Storytelling',num:'05',title:'From idea to screenplay',subtitle:'Turn a simple idea into actions that can be filmed.',minutes:5,thumb:'story',icon:'✎',sections:[
        ['Begin with someone doing something','An idea could be: “A student finds a lost notebook.” Ask who the student is, what they want to do and what might make the choice difficult.'],
        ['Write what an audience can notice','A screenplay often describes visible actions, sounds, locations and dialogue. Instead of only saying “she feels nervous,” write something the audience could notice, such as “she hesitates before opening the notebook.”'],
        ['Keep a first scene small','Try one location, one or two characters and a clear situation. A screenplay is a plan that can change during rehearsal, filming or editing.']
      ],idea:'A screenplay gives the filmmaking team a practical way to turn story ideas into scenes.',try:'Write three sentences: who is here, what do they want, and what action shows their problem?',q:'Which line gives filmmakers a clear, filmable action?',opts:['The room has a mysterious feeling','She pauses, then hides the letter under a book','It should become an award-winning scene'],answer:1,feedback:'A visible action gives actors and filmmakers something concrete to interpret and film.'},
      {id:'acting',unit:'Storytelling',num:'06',title:'How performance tells a story',subtitle:'Small choices in action and voice can reveal a character.',minutes:4,thumb:'crew',icon:'♙',sections:[
        ['Acting is more than dialogue','An actor can communicate through looking, moving, pausing, breathing and speaking. None of these has one universal meaning; the situation matters.'],
        ['Give an action a purpose','A character may want to apologize but struggle to begin. A pause or a change in eye contact may help show that difficulty, if it fits the performance.'],
        ['A performance works with the frame','A close-up can make subtle facial details easier to notice. A wide shot can let us notice a person’s movement in a space. The camera and edit help shape what we see of the performance.']
      ],idea:'Performance communicates through choices in action, expression, movement and voice.',try:'Say “I am here” once as a happy greeting, once as a worried announcement. Notice what changes beyond the words.',q:'Which can help communicate a character’s feelings?',opts:['Only spoken words','Actions, voice, movement and expression','A camera angle without any other context'],answer:1,feedback:'Acting can communicate through many kinds of behavior, not only dialogue.'},
      {id:'shot',unit:'Visual Language',num:'07',title:'What makes a shot good?',subtitle:'A good shot helps the viewer see or feel what matters.',minutes:5,thumb:'shot',icon:'◩',sections:[
        ['Pretty is not the same as useful','A shot can look beautiful but still distract us from an important moment. Ask what the audience should notice in this part of the film.'],
        ['Know what you want to show','Do viewers need to see the whole place, two people together or one small facial reaction? Choose what goes inside the frame and how you show it to support that idea.'],
        ['One shot can mean different things','A wide shot shows more of the surroundings. It might suggest loneliness—or freedom. A close-up shows detail, such as a face. It might feel warm, funny or uncomfortable. The story and nearby shots help give each choice meaning.']
      ],idea:'A shot works well when it helps communicate what matters in that moment.',try:'Open the Creative Lab and compare the same character in three shot sizes. Choose a framing for a lonely character. Explain why you picked it.',q:'What is the best first question to ask when choosing a shot?',opts:['Which lens looks most expensive?','What does this scene need the audience to experience?','Can every shot be a close-up?'],answer:1,feedback:'First decide what viewers need to see or feel. Then choose how to frame and film it.'},
      {id:'camera',unit:'Visual Language',num:'08',title:'Where should the camera go?',subtitle:'Distance and angle subtly change your relationship to a character.',minutes:4,thumb:'tech',icon:'⌗',sections:[
        ['Where the camera sits matters','The camera’s position changes what fits in the picture and which details we notice. Moving closer or farther away can change how we see a person and their surroundings.'],
        ['High and low angles','Filming someone from below can make them seem large or important. Filming from above may make them seem small. But neither angle has one fixed meaning; the scene decides how we read it.'],
        ['Move the camera for a reason','A moving camera can follow a person or reveal something new. A still camera can let us study what happens. Both are useful; decide what viewers should notice.']
      ],idea:'Ask what you want the viewer to see before choosing a camera position or movement.',try:'Place your phone at eye level, knee height and above eye level. Take three photos of the same object. Compare the feelings.',q:'What gives a low camera angle meaning?',opts:['It always means heroism','The specific scene, subject and surrounding choices','It always makes a scene better'],answer:1,feedback:'The meaning of a camera angle depends on the subject, the framing and the scene.'},
      {id:'lighting',unit:'Visual Language',num:'09',title:'What does lighting do?',subtitle:'Light helps us see faces, shapes, spaces and details.',minutes:5,thumb:'tech',icon:'☼',sections:[
        ['Light makes things visible','Where a light comes from, its size and brightness affect the highlights and shadows we see. A big nearby light source can create softer-looking shadows than a small source, all else being equal.'],
        ['Look at the direction','A front light may reveal more of a face. A side light can show differences in brightness across it. A backlight can separate a subject from the background with an edge of light.'],
        ['No automatic emotion','Darkness is not always scary. Brightness is not always happy. Lighting works with story, acting, camera and design.']
      ],idea:'Lighting shapes visibility and contrast, giving filmmakers ways to direct attention.',try:'Use the Lighting Lab, then compare the effect using a safe desk lamp and a still object.',q:'What affects how lighting looks on a face?',opts:['Only the price of the camera','Light direction, size, distance and strength','One lighting arrangement always means one emotion'],answer:1,feedback:'Several properties of the light and the scene affect its appearance; no emotional effect is guaranteed.'},
      {id:'sound',unit:'Visual Language',num:'10',title:'Sound changes everything',subtitle:'Hear how a scene can mean something different without changing the image.',minutes:4,thumb:'sound',icon:'♫',sections:[
        ['Sound adds information','Footsteps, traffic or a ringing phone can tell us what is happening—even when we cannot see it. Background sounds also help us imagine where a scene takes place.'],
        ['Music can change a scene’s mood','Soft music might make someone waiting feel hopeful. Uneasy music might make the same wait feel frightening. These are possibilities, not guaranteed reactions.'],
        ['No music is also a choice','A scene without background music can make small sounds, such as breathing or footsteps, more noticeable. No music is not always the same as complete silence.']
      ],idea:'Sound can give information, suggest emotion and guide what we notice.',try:'Open the Sound Lab. Compare the same imagined scene with no music, gentle tones and uneasy tones. Note what story you start imagining.',q:'What can music do even if the visuals do not change?',opts:['Change the emotional expectation','Change the actor’s expression in the video','Guarantee every viewer feels the same'],answer:0,feedback:'Music can suggest a mood or raise an expectation, even when the picture stays the same.'},
      {id:'editing',unit:'Visual Language',num:'11',title:'Why do filmmakers cut?',subtitle:'An editor chooses what we see and for how long.',minutes:5,thumb:'shot',icon:'✂',sections:[
        ['What is a cut?','A cut is a direct change from one shot to the next. Cuts can guide our attention, connect actions, or reveal information. A film can also use a long shot without cutting.'],
        ['Order shapes information','Show a clock before a waiting person, and viewers may notice time first. Show the place first, and they learn where the person is. The order can influence understanding without guaranteeing a single reaction.'],
        ['Duration changes what we can notice','Holding a shot longer can give us more time to observe it. A quick change may draw attention to a new detail. The pacing that works depends on the action and the story.']
      ],idea:'Editing arranges shots in time, and both order and duration can affect what viewers notice.',try:'Use the Cut Lab. Rearrange three shots and change how long one shot stays visible.',q:'Which is a creative decision made during editing?',opts:['The order and duration of shots','Only the number of expensive lights','Making every scene exactly 20 seconds'],answer:0,feedback:'Editors often choose which shots appear, their order and their duration.'},
      {id:'crew',unit:'Film Roles',num:'12',title:'Who actually makes a film?',subtitle:'Understand the creative teamwork behind every scene.',minutes:4,thumb:'crew',icon:'♧',sections:[
        ['Films often need teamwork','Many films are made by teams. One person may write, another may perform, while others handle camera, lighting, sound, sets and editing. On a very small film, one person might do several jobs.'],
        ['One scene, many jobs','In a rainy-night scene, the design team might prepare the setting, the camera and lighting teams decide how it looks, and the sound team records or creates what we hear. The editor chooses which shots appear and for how long. The director works with these people on the overall scene.'],
        ['What are the “24 crafts”?','In the Telugu film industry, “24 crafts” commonly refers to 24 categories of film workers represented by industry groups. It does not mean every film worldwide has exactly 24 jobs. We will start by meeting nine familiar roles and teams.']
      ],idea:'Different film jobs support one another. Working together can make a scene clearer and more powerful.',try:'Think of a film scene you love. Identify three different crafts that must have contributed to it.',q:'Who can contribute to how a scene feels?',opts:['Only the director','Only the cinematographer','Multiple collaborating departments'],answer:2,feedback:'Many people can shape a scene. On a small project, one person may also do several jobs.'},
      {id:'making',unit:'Getting Started',num:'13',title:'From idea to first film',subtitle:'The simple journey from a thought to something people can watch.',minutes:5,thumb:'crew',icon:'▶',sections:[
        ['Plan a small story','Choose a simple idea. Who is in it? What do they want? Where does it happen? Write a short script (a plan for what people do and say), choose a place and list the shots you need.'],
        ['Record your shots','You can start with a phone and a quiet place. Film the actions you need from one or more useful angles. Try to keep small details—like where an object sits—the same between matching shots. Check that voices can be heard clearly.'],
        ['Put the film together','Choose your recorded shots and place them in order. Decide where to cut. Use sound or music you made yourself or have permission to use. Show the result to someone and ask what they understood.']
      ],idea:'Make one short, complete film. Watch it, learn one thing and try again.',try:'Make a 30-second film about someone discovering an unexpected message. Use five shots or fewer.',q:'What is a sensible first film project for a beginner?',opts:['A feature film with 30 locations','A short story you can finish with a few shots','A film that requires expensive cameras'],answer:1,feedback:'A small project is easier to finish, review and learn from.'}
    ];
    // Carefully scoped Telugu helper summaries; the English lesson remains the complete lesson.
    // Film terms are retained in English in brackets, so learners can recognize them elsewhere.

    // v0.8: ten additional researched, beginner-accessible lessons; previous IDs are unchanged.
    lessons.push(...[
  {
    "id": "genres",
    "unit": "Foundations",
    "num": "14",
    "title": "What kinds of films exist?",
    "subtitle": "Comedy, horror, documentary and many more—often mixed together.",
    "minutes": 4,
    "thumb": "story",
    "icon": "❖",
    "sections": [
      [
        "What is a genre?",
        "A genre is a way of grouping stories with shared features. Comedy often aims to amuse; horror often explores fear; a mystery invites us to ask questions. Genres are useful descriptions, not fixed rules."
      ],
      [
        "One film can fit several groups",
        "A film can be funny and scary at once. A romantic drama may also have musical numbers. The same film can be described differently by different viewers and distributors."
      ],
      [
        "Fiction and documentary",
        "Fictional films usually use invented or dramatized events. Documentaries explore actual people, events or issues, but still involve choices about filming and editing. A documentary is not automatically an unbiased record."
      ]
    ],
    "idea": "Genre labels help describe what a film offers; they do not limit what filmmakers may create.",
    "q": "Which statement about film genres is accurate?",
    "opts": [
      "Every film must belong to exactly one genre",
      "Genres can overlap within one film",
      "Only fictional movies have genres"
    ],
    "answer": 1,
    "feedback": "Genres are flexible descriptions. Films often combine elements from several genres.",
    "try": "Invent a story about somebody losing a phone. How could it become a comedy—or a mystery?"
  },
  {
    "id": "india",
    "unit": "Foundations",
    "num": "15",
    "title": "How did cinema grow in India?",
    "subtitle": "A short introduction to a long, multilingual filmmaking history.",
    "minutes": 5,
    "thumb": "story",
    "icon": "◉",
    "sections": [
      [
        "Early screenings and films",
        "Moving pictures were shown in Bombay (now Mumbai) in 1896. Indian filmmakers were soon experimenting with their own films. Early Indian cinema was silent: it did not have recorded dialogue synchronized to the image."
      ],
      [
        "Two important early milestones",
        "Shree Pundalik (1912) is part of discussions about early Indian feature films. Dadasaheb Phalke’s Raja Harishchandra (1913) is widely recognized as a foundational Indian feature. Calling one film the very first without explanation hides a real historical debate."
      ],
      [
        "Many languages and traditions",
        "Cinema developed across India in many languages and regions. Later, synchronized sound, music, colour, changing film technologies and digital tools opened more ways to tell stories. No single industry represents all Indian filmmaking."
      ]
    ],
    "idea": "Indian cinema has a shared history and many distinct regional filmmaking traditions.",
    "q": "What is a careful way to describe early Indian cinema?",
    "opts": [
      "It began with only one uncontested first film",
      "It developed through several filmmakers and includes debated early milestones",
      "Every Indian film has always used recorded dialogue"
    ],
    "answer": 1,
    "feedback": "Early Indian cinema has multiple contributors. Some first-film claims are debated by historians.",
    "try": "Ask someone in your family about a film they loved when they were young. What felt different from films today?"
  },
  {
    "id": "character",
    "unit": "Storytelling",
    "num": "16",
    "title": "Characters, wants and obstacles",
    "subtitle": "Understand what makes even a tiny story interesting.",
    "minutes": 5,
    "thumb": "story",
    "icon": "♙",
    "sections": [
      [
        "What does the character want?",
        "A character might want a train ticket, an apology, a moment of quiet or simply to get home. A want can give us a direction to follow. Not every film follows one main character."
      ],
      [
        "What gets in the way?",
        "An obstacle may be another person, a situation, a rule or the character’s own fear. Conflict in storytelling does not always mean shouting or fighting."
      ],
      [
        "Why does the choice matter?",
        "If the person misses the bus, will they lose a job interview—or just wait ten minutes? The consequences of a choice are sometimes called the stakes. Small stakes can still feel meaningful."
      ]
    ],
    "idea": "A simple way to begin a story is to ask what a character wants, what makes it difficult and what they choose.",
    "q": "In a story, an obstacle can be...",
    "opts": [
      "Only a villain",
      "Only a physical fight",
      "An external problem or an internal fear"
    ],
    "answer": 2,
    "feedback": "An obstacle can come from the world around a character or from within the character.",
    "try": "Write: “A person wants ____, but ____. They decide to ____.”"
  },
  {
    "id": "dialogue",
    "unit": "Storytelling",
    "num": "17",
    "title": "Dialogue: more than words",
    "subtitle": "What characters say—and what they avoid saying.",
    "minutes": 4,
    "thumb": "story",
    "icon": "❞",
    "sections": [
      [
        "Dialogue is spoken language",
        "Dialogue is what characters say. The meaning of a line can depend on voice, the relationship between speakers and what happens around them. A scene can also tell a story with little or no dialogue."
      ],
      [
        "Meaning beneath the words",
        "A character says, “You’re early,” but avoids eye contact. Perhaps the words are polite while the action suggests discomfort. This possible unstated meaning is often called subtext."
      ],
      [
        "Make words useful",
        "Words can reveal information, character or conflict. But do not make a character explain what viewers already understand from action unless that repetition serves a purpose."
      ]
    ],
    "idea": "Dialogue, action, silence and performance work together; the words alone are rarely the whole scene.",
    "q": "What is subtext?",
    "opts": [
      "A subtitle shown at the bottom of a film",
      "A possible meaning implied rather than said directly",
      "Every sentence in a screenplay"
    ],
    "answer": 1,
    "feedback": "Subtext is a possible underlying meaning suggested by context, performance or what remains unsaid.",
    "try": "Write two ways to say “I’m fine.” How could the actor show different meanings?"
  },
  {
    "id": "composition",
    "unit": "Visual Language",
    "num": "18",
    "title": "Arrange the frame",
    "subtitle": "Guide attention through placement, space and visual contrast.",
    "minutes": 5,
    "thumb": "shot",
    "icon": "▣",
    "sections": [
      [
        "What belongs in the image?",
        "Composition means arranging visual elements inside the frame. A person near the edge, an empty chair or a bright window can all draw attention. What matters depends on the story."
      ],
      [
        "Balance and empty space",
        "An image can look balanced without being perfectly symmetrical. Empty space—sometimes called negative space—may make a subject feel isolated, or simply show where the subject is looking."
      ],
      [
        "The rule of thirds is a tool",
        "A common guide divides the frame into three rows and three columns. Placing a subject near those lines is one option, not a rule that makes all shots better. Centered compositions can be just as effective."
      ]
    ],
    "idea": "Composition is about choosing what viewers notice and how visual elements relate to one another.",
    "q": "What is the rule of thirds?",
    "opts": [
      "A useful composition guide, not a requirement",
      "A rule every good film must follow",
      "A rule about filming exactly three people"
    ],
    "answer": 0,
    "feedback": "Thirds are optional guides. Centered and other compositions can work beautifully.",
    "try": "Take two photographs of the same object: centered, then toward one side. What changes?"
  },
  {
    "id": "movement",
    "unit": "Visual Language",
    "num": "19",
    "title": "When the camera moves",
    "subtitle": "Learn the basic difference between pan, tilt and moving position.",
    "minutes": 5,
    "thumb": "tech",
    "icon": "↗",
    "sections": [
      [
        "Pan and tilt",
        "A pan turns the camera side-to-side from its position. A tilt turns it up or down. These are rotations of camera direction, not necessarily moves to a new camera position."
      ],
      [
        "Moving through space",
        "A tracking or dolly movement changes the camera’s position. It can follow a character, reveal surroundings or change relationships between foreground and background. The equipment can vary."
      ],
      [
        "Move for a reason",
        "A stationary shot can be more useful than a moving one. Ask: what new information or feeling might the movement bring? A shaky image is not automatically realistic, and a smooth image is not automatically good."
      ]
    ],
    "idea": "Camera direction and camera position are different choices, and both can change what a viewer sees.",
    "q": "Which description is correct?",
    "opts": [
      "A pan always moves the camera to a different location",
      "A pan rotates the camera sideways; a tracking move changes camera position",
      "A zoom and a tracking move always look identical"
    ],
    "answer": 1,
    "feedback": "Pan refers to rotating the camera sideways; a tracking move changes its location.",
    "try": "Record a still view, then a slow side-to-side pan. Compare what viewers discover."
  },
  {
    "id": "lenses",
    "unit": "Visual Language",
    "num": "20",
    "title": "What do lenses change?",
    "subtitle": "Field of view, camera distance and the look of space.",
    "minutes": 5,
    "thumb": "tech",
    "icon": "◎",
    "sections": [
      [
        "How much fits in the picture",
        "On the same camera sensor, a shorter focal-length lens generally shows a wider field of view than a longer one. Other factors, including sensor size and camera position, also matter."
      ],
      [
        "Where the camera stands matters",
        "Perspective—how nearby and distant objects appear in relation to one another—depends mainly on the camera’s position. Merely cropping or zooming an image from the same position does not produce the same perspective shift as moving the camera."
      ],
      [
        "A practical first experiment",
        "Take one photo from your position, then step closer and take another. Compare the size relationship between the subject and background. Do not confuse changes caused by moving position with those caused by focal length alone."
      ]
    ],
    "idea": "Lens choice affects field of view; camera position is crucial to perspective. Both affect the image.",
    "q": "What most directly changes perspective relationships?",
    "opts": [
      "Changing the camera position",
      "Changing only the playback volume",
      "Adding a title at the end"
    ],
    "answer": 0,
    "feedback": "Camera position determines perspective relationships. Focal length changes field of view on a given sensor.",
    "try": "Stand in one place and use phone zoom, then move closer and take another picture. Compare the backgrounds."
  },
  {
    "id": "ambience",
    "unit": "Sound",
    "num": "21",
    "title": "Dialogue and the world of sound",
    "subtitle": "A scene can feel alive even without music.",
    "minutes": 5,
    "thumb": "sound",
    "icon": "♫",
    "sections": [
      [
        "Listen beyond the dialogue",
        "A film soundtrack may contain speech, effects, atmosphere and music. Footsteps, traffic and wind can help us imagine a space without the camera showing every source."
      ],
      [
        "What is ambience?",
        "Ambience is background sound that helps establish a place or atmosphere, such as distant traffic or insects. “Room tone” is typically a recording of the background sound of a filming space, useful in editing. The terms are related but not always interchangeable."
      ],
      [
        "Make words understandable",
        "During a beginner shoot, protect clear speech: avoid loud unwanted noise, bring the microphone closer when practical and check a short test recording. Sound recorded badly may be difficult to repair later."
      ]
    ],
    "idea": "Dialogue, environmental sound and silence are storytelling tools—not just decorations around music.",
    "q": "Which statement about a film soundtrack is true?",
    "opts": [
      "Soundtrack always means background songs only",
      "Dialogue, effects and ambience can be part of the soundtrack",
      "A scene with no music has no sound"
    ],
    "answer": 1,
    "feedback": "The soundtrack includes many audio elements; music is only one possible part.",
    "try": "Record 10 seconds in your room. Listen for sounds you had not consciously noticed."
  },
  {
    "id": "music",
    "unit": "Sound",
    "num": "22",
    "title": "How music changes a scene",
    "subtitle": "Learn how sound can guide expectations without controlling everyone.",
    "minutes": 4,
    "thumb": "sound",
    "icon": "♪",
    "sections": [
      [
        "Same image, different expectations",
        "A character walking home can seem peaceful with gentle music—or uneasy with dissonant tones. But viewers do not all respond in exactly the same way."
      ],
      [
        "Music inside or outside the scene",
        "Music from a radio that characters can hear is often called diegetic music. Music added for the audience that characters do not hear is often called non-diegetic score. Filmmakers can blur these boundaries creatively."
      ],
      [
        "Know when to stop",
        "Silence or ordinary environmental sounds may work better than music in some moments. Music needs permission to use unless it is your own or appropriately licensed."
      ]
    ],
    "idea": "Music can influence pacing, expectation and emotion, but the whole scene gives it meaning.",
    "q": "What is an example of diegetic music?",
    "opts": [
      "A radio playing in the fictional room, heard by the characters",
      "An orchestral score that only the audience hears",
      "The picture fading to black"
    ],
    "answer": 0,
    "feedback": "Diegetic music belongs to the story world, such as a radio heard by characters.",
    "try": "Watch your own short recording with no music, then with a licensed or original simple melody. What shifts?"
  },
  {
    "id": "shotlist",
    "unit": "Getting Started",
    "num": "23",
    "title": "Plan shots before you shoot",
    "subtitle": "A simple shot list can save time and missed details.",
    "minutes": 5,
    "thumb": "shot",
    "icon": "✎",
    "sections": [
      [
        "A shot list is a filming plan",
        "A shot list records the shots you intend to capture, often with shot size, action and any notes the crew needs. It is about what you plan to record—not necessarily the order the final film will use."
      ],
      [
        "A storyboard uses pictures",
        "A storyboard sketches possible images to help plan a scene. A shot list uses written details; the two tools can work together. Neither guarantees what the finished edit will look like."
      ],
      [
        "Keep your first plan short",
        "For a tiny scene, try a wider view of the location, an action and an important reaction. Record more or change the plan when the story requires it; there is no universal three-shot rule."
      ]
    ],
    "idea": "A shot list helps plan what to record; an editor later decides how recorded material becomes the final sequence.",
    "q": "What is the main purpose of a shot list?",
    "opts": [
      "To list shots you plan to film",
      "To set the final order of every film forever",
      "To replace all conversations between crew members"
    ],
    "answer": 0,
    "feedback": "A shot list helps the shoot. The final edit can use a different order or fewer/more shots.",
    "try": "Use Make Lab to plan three shots and export a shot list. Then try filming them on a phone."
  }
]);
    // v0.8B · reviewed beginner lesson additions, keeping legacy IDs and completion data intact.
    lessons.push(...[
  {
    "id": "showdonttell",
    "unit": "Storytelling",
    "num": "24",
    "title": "Show a feeling through action",
    "subtitle": "Help the audience notice an idea rather than only hearing an explanation.",
    "minutes": 4,
    "thumb": "story",
    "icon": "✦",
    "sections": [
      [
        "What can the audience actually see?",
        "A character says, “I miss my friend.” That tells us the feeling in words. Or the character may set out two cups, then put one away. The action gives viewers something to observe and interpret. Neither approach is automatically better."
      ],
      [
        "Show and tell can work together",
        "A film may use dialogue, action, performance, images and sound together. A character might say one thing while their actions suggest another. Good dialogue does not need to be removed just because an action could tell part of the story."
      ],
      [
        "Choose the clearest approach",
        "Ask: what should the audience know now, and what should they discover later? If a visual clue is too vague, a short line of dialogue may help. If the action already makes something clear, repeating it in words may be unnecessary."
      ]
    ],
    "idea": "Showing is one storytelling choice, not a ban on explanation or dialogue.",
    "try": "Write two versions of a tiny moment: one as dialogue, one as visible action. What does each reveal?",
    "q": "Which statement about “show, don’t tell” is best?",
    "opts": [
      "Every line of dialogue makes a film worse",
      "Visible action and dialogue can both communicate story information",
      "A character must never explain anything"
    ],
    "answer": 1,
    "feedback": "A filmmaker can choose action, dialogue, or both depending on the scene."
  },
  {
    "id": "colour",
    "unit": "Visual Language",
    "num": "25",
    "title": "How colour guides attention",
    "subtitle": "Explore how colour differences change what stands out inside an image.",
    "minutes": 5,
    "thumb": "shot",
    "icon": "◐",
    "sections": [
      [
        "Colour is part of the picture",
        "A film’s colours come from many decisions: costumes, sets, light, camera capture and adjustments during post-production. A bright object against a muted background may stand out and draw the viewer’s attention."
      ],
      [
        "Colour can suggest, not guarantee",
        "Warm-looking and cool-looking palettes may suggest different settings or moods. But blue never always means sadness and red never always means danger. Meaning depends on the story and on the viewer."
      ],
      [
        "Try changing one decision",
        "Keep the same simple scene and compare a neutral, warm and cool illustration. Notice what becomes more noticeable and what feels different. This teaching exercise is not a physically accurate colour-grading tool."
      ]
    ],
    "idea": "Colour can guide attention and support storytelling, but it has no fixed emotional dictionary.",
    "try": "Choose one coloured object for a scene and explain why it matters to the story.",
    "q": "Which statement about colour in films is accurate?",
    "opts": [
      "Every colour has one universal emotion",
      "Colour choices can support attention and meaning in context",
      "Colour is decided only after shooting"
    ],
    "answer": 1,
    "feedback": "Colour can come from the set, costume, lighting, photography and finishing choices."
  },
  {
    "id": "continuity",
    "unit": "Sound",
    "num": "26",
    "title": "Make separate shots feel connected",
    "subtitle": "Help viewers follow action and space when a scene cuts between images.",
    "minutes": 5,
    "thumb": "shot",
    "icon": "↔",
    "sections": [
      [
        "What is continuity?",
        "Imagine a character places a cup on the left side of a table. A moment later, the scene cuts to another view and the cup is suddenly on the right, although nobody moved it. The unexpected change may distract viewers."
      ],
      [
        "Keep the important details clear",
        "Filmmakers check positions, props, costume details, movement, eye-lines and sound across shots. Editing can also carry an action across a cut. Continuity is about helping viewers understand what happened, not making all images identical."
      ],
      [
        "Breaking continuity can be deliberate",
        "A sudden change may be purposeful in a dream, montage or unusual style. The question is whether the change helps the story or only confuses the viewer. Try the Continuity Lab and decide which change needs an explanation."
      ]
    ],
    "idea": "Continuity helps the audience understand connected action across different shots.",
    "try": "Film somebody picking up a pen twice from two framings. Try joining the action at the same point.",
    "q": "Why do filmmakers usually watch continuity?",
    "opts": [
      "To make sure nothing ever changes in the story",
      "To keep actions, positions and story information understandable across cuts",
      "To avoid using more than one camera position"
    ],
    "answer": 1,
    "feedback": "A continuity match helps separate recorded views feel connected."
  },
  {
    "id": "rhythm",
    "unit": "Sound",
    "num": "27",
    "title": "How editing creates rhythm",
    "subtitle": "Study the effect of how long each image stays on screen.",
    "minutes": 5,
    "thumb": "sound",
    "icon": "⌁",
    "sections": [
      [
        "Duration matters",
        "If a shot lasts one second, viewers have less time to look around than if it lasts five seconds. Editors choose durations in relation to action, information, performance, dialogue and other shots."
      ],
      [
        "Rhythm is not just fast cutting",
        "A scene may feel quick because the action moves rapidly, or slow because an important moment is held. Long shots can be tense; short shots can feel calm in some contexts. The surrounding film changes how each choice works."
      ],
      [
        "Transitions are choices, too",
        "A cut is an immediate switch between shots. A dissolve briefly blends one image into another. Neither is automatically more professional. Their purpose matters more than adding effects. Use the Cut Lab to adjust shot order and time."
      ]
    ],
    "idea": "Editing rhythm comes from relationships among duration, movement, sound and story information.",
    "try": "Make two versions of three photos: one with one-second holds, one with four-second holds.",
    "q": "What can change when an editor lengthens a shot?",
    "opts": [
      "Viewers may have more time to notice details",
      "The story must become sad",
      "The camera has to use a longer lens"
    ],
    "answer": 0,
    "feedback": "Duration affects viewing time, but the emotional effect depends on context."
  },
  {
    "id": "craft24",
    "unit": "Film Roles",
    "num": "28",
    "title": "What are the Indian 24 crafts?",
    "subtitle": "Understand the Telugu industry term without confusing it with a worldwide job list.",
    "minutes": 5,
    "thumb": "crew",
    "icon": "✥",
    "sections": [
      [
        "What the phrase means",
        "In the Telugu film industry, “24 crafts” commonly refers to 24 categories of film workers represented through industry associations and federation arrangements. It does not mean that every production has exactly 24 jobs, or that all countries use the same categories."
      ],
      [
        "Many kinds of workers make cinema",
        "A film may need people handling sets, camera work, lighting, costumes, makeup, sound, transport, editing and many other tasks. Some categories refer to workers or unions rather than a single creative title. The exact organization depends on the production and industry."
      ],
      [
        "Respect collaboration",
        "On a small independent shoot, one person may perform several jobs. Large productions can have many specialists. No craft is unimportant just because its workers work behind the camera. We are teaching the context here, not claiming a verified official list of all 24 association names."
      ]
    ],
    "idea": "The “24 crafts” label describes a Telugu film-industry worker/federation context, not a universal set of 24 fixed creative jobs.",
    "try": "Choose one behind-the-scenes task you had not thought about before. How could it affect a scene?",
    "q": "Which claim about the Telugu 24 crafts is correct?",
    "opts": [
      "Every film worldwide has exactly 24 jobs",
      "The term is associated with Telugu film-industry worker categories",
      "The crafts only refer to actors and directors"
    ],
    "answer": 1,
    "feedback": "This is an industry-specific worker grouping, and the number of people/roles varies by film."
  },
  {
    "id": "teams",
    "unit": "Film Roles",
    "num": "29",
    "title": "How departments plan one scene",
    "subtitle": "Watch writing, art, camera and sound decisions connect.",
    "minutes": 5,
    "thumb": "crew",
    "icon": "◎",
    "sections": [
      [
        "Start from the story",
        "Imagine a child returns home and finds an empty dinner table. The writer may describe this action. The director and team then decide how to stage and communicate the moment."
      ],
      [
        "Different crafts shape one image",
        "The production-design team may dress the table. Costume and makeup help create the people we see. Camera and lighting teams decide what is visible and how it is recorded. Actors bring their interpretation to the action."
      ],
      [
        "Images and sound meet in the edit",
        "The sound team records dialogue and other useful sounds. The editor selects and arranges recorded material with the director. Teams overlap in practice and work together rather than in one rigid chain."
      ]
    ],
    "idea": "Creative and technical departments collaborate; changes in one department can affect the others.",
    "try": "Pick an object from the dinner-table scene. What would writing, art, camera and sound each decide?",
    "q": "Who can influence the way a filmed dinner table appears?",
    "opts": [
      "Only the director",
      "Only the camera operator",
      "Several departments working together"
    ],
    "answer": 2,
    "feedback": "Writing, direction, performance, design, lighting and camera choices can all affect the result."
  },
  {
    "id": "pipeline",
    "unit": "Film Roles",
    "num": "30",
    "title": "From first idea to finished film",
    "subtitle": "See the basic stages of a production and what can change along the way.",
    "minutes": 5,
    "thumb": "crew",
    "icon": "▣",
    "sections": [
      [
        "Develop and prepare",
        "Development includes shaping a story, writing and finding support. Pre-production is the practical preparation: casting, locations, schedules, crew, equipment and deciding what to film."
      ],
      [
        "Film the material",
        "Production usually includes principal photography: recording performances, images and location sound. A crew may repeat takes, change plans or discover a better idea during filming. Safety and clear communication matter."
      ],
      [
        "Finish and share",
        "Post-production can include editing, sound editing, effects, music, colour finishing and final output. Distribution is how audiences get to see the film, such as festivals, cinemas or online services. These stages can overlap."
      ]
    ],
    "idea": "Film production often moves through development, preparation, shooting, finishing and distribution, with some overlap.",
    "try": "Draw five boxes for your own tiny film. Add one task to each box.",
    "q": "When are actors and scenes typically recorded on camera?",
    "opts": [
      "Usually during production/principal photography",
      "Only during distribution",
      "Only after the film is released"
    ],
    "answer": 0,
    "feedback": "Principal photography is generally part of production, before the final edit is complete."
  },
  {
    "id": "shootscene",
    "unit": "Making",
    "num": "31",
    "title": "Shoot a small scene with a phone",
    "subtitle": "Prepare one manageable moment and capture the images and sound.",
    "minutes": 6,
    "thumb": "tech",
    "icon": "◉",
    "sections": [
      [
        "Keep the idea possible",
        "Choose one place, one simple action and somebody willing to act. For example, a character finds a note and decides whether to open it. Make sure you have permission to film people and locations."
      ],
      [
        "Plan what the audience needs",
        "Sketch a wider view, a useful action detail and a reaction if the story calls for them. These are possible choices, not a requirement for exactly three shots. Check light and sound before recording, hold the phone steady when useful, and avoid unsafe filming."
      ],
      [
        "Record and check",
        "Record enough of the action to allow editing. Repeat a take if needed and check that speech is understandable. Watch or listen to the recordings before leaving the location so missing action or sound can be captured again."
      ]
    ],
    "idea": "A small clear idea, safe preparation and usable sound matter more than expensive equipment.",
    "try": "Use Make Lab to export a simple plan; then record one 10–30-second moment on your phone.",
    "q": "Which is a useful habit while shooting a first scene?",
    "opts": [
      "Record everything without checking sound",
      "Review important recordings before leaving",
      "Always use exactly three shots"
    ],
    "answer": 1,
    "feedback": "Checking image and sound on location can reveal problems while they can still be fixed."
  },
  {
    "id": "editminute",
    "unit": "Making",
    "num": "32",
    "title": "Edit a short story from your shots",
    "subtitle": "Turn recorded clips into a beginning, middle and ending.",
    "minutes": 6,
    "thumb": "sound",
    "icon": "✂",
    "sections": [
      [
        "Choose what helps the story",
        "First select usable recordings. Place them in an order the audience can follow. You can remove repetition and change the length of each part. An editor does not have to use every recorded take."
      ],
      [
        "Hear the joins",
        "Listen through each edit for abrupt changes in background sound or important dialogue. A clear consistent sound bed may help a sequence feel connected. Adding music is optional; avoid using music you do not have rights to share."
      ],
      [
        "Finish a simple version",
        "Make a first cut around 30–60 seconds. The story does not have to be exactly one minute. Watch it without stopping and ask whether the main action is understandable. Export it in a suitable format for the device or platform where it will be viewed."
      ]
    ],
    "idea": "Editing is choosing and arranging recorded material to communicate the story clearly.",
    "try": "Open Cut Lab and create two different three-shot timings, then try a similar edit in a real editor.",
    "q": "What should guide which takes an editor selects?",
    "opts": [
      "Whether they support the intended scene",
      "Whether they were recorded first",
      "Whether every take can be used"
    ],
    "answer": 0,
    "feedback": "An editor chooses material for performance, clarity, continuity and storytelling needs."
  },
  {
    "id": "review",
    "unit": "Making",
    "num": "33",
    "title": "Watch, learn and improve",
    "subtitle": "Learn from your first film without treating creativity as a pass/fail formula.",
    "minutes": 5,
    "thumb": "story",
    "icon": "✓",
    "sections": [
      [
        "Watch like a new viewer",
        "Show a rough cut to someone who does not know the story, if they agree. Ask what they understood and where they became confused. Do not explain the scene first; observe their reaction."
      ],
      [
        "Ask focused questions",
        "Could they understand the character’s action? Was speech audible? Could they tell where events happened? Was a visual clue hard to notice? These questions can identify problems you can actually improve."
      ],
      [
        "Make one useful revision",
        "Change one thing at a time: a cut, an audio level, a missing close view or a title. Different people may prefer different artistic choices. Learn from the feedback, but keep your reason for making the film in mind."
      ]
    ],
    "idea": "Useful critique asks what a film communicates and how its choices work, not simply whether someone likes it.",
    "try": "Write two questions you want a viewer to answer about your one-minute film.",
    "q": "Which feedback is most helpful for revising a beginner film?",
    "opts": [
      "“The film is bad.”",
      "“I could not hear the key line at 20 seconds.”",
      "“All films should use close-ups.”"
    ],
    "answer": 1,
    "feedback": "Specific observations help you decide what to improve, even if you keep a creative choice."
  }
]);
    const teluguNotes={
      why:'సినిమాలు మనకు వినోదం, సమాచారం, కొత్త అనుభవాలు ఇవ్వవచ్చు. డాక్యుమెంటరీలు నిజ జీవిత విషయాలను కూడా చూపిస్తాయి. ఒకే సన్నివేశాన్ని చూసిన ఇద్దరూ ఒకేలా స్పందించాల్సిన అవసరం లేదు.',
      units:'ఫ్రేమ్ (Frame) అంటే వీడియోలోని ఒక్క చిత్రం. షాట్ (Shot) అంటే పూర్తయిన సినిమాలో మధ్యలో కట్ లేకుండా కనిపించే ఒక దృశ్య భాగం. సీన్ (Scene) అంటే కథలోని ఒక భాగం; అందులో ఒకటి లేదా అనేక షాట్లు ఉండవచ్చు. టేక్ (Take) అంటే షాట్‌ను రికార్డ్ చేయడానికి చేసిన ఒక ప్రయత్నం.',
      shot:'షాట్ అందంగా కనిపించడం మాత్రమే ముఖ్యం కాదు. ఆ క్షణంలో ప్రేక్షకులు ఏం గమనించాలి లేదా అర్థం చేసుకోవాలి అనేది ఆలోచించాలి. వైడ్ షాట్ (Wide shot), క్లోజప్ (Close-up) లాంటి ఎంపికల అర్థం కథ సందర్భాన్ని బట్టి మారుతుంది.',
      story:'పాత్రకు ఏం కావాలి? అది ఎందుకు ముఖ్యం? దానికి అడ్డంకి ఏమిటి? ఇవి కథపై ఆసక్తిని పెంచగల ప్రశ్నలు. కానీ ప్రతి కథ ఒకే పద్ధతిలో ఉండాల్సిన అవసరం లేదు.',
      crew:'సినిమాలో రచన, దర్శకత్వం, నటన, కెమెరా, సౌండ్, ఎడిటింగ్ లాంటి పనులు కలిసి పనిచేస్తాయి. చిన్న సినిమాలో ఒకరే అనేక పనులు చేయవచ్చు. తెలుగు చిత్ర పరిశ్రమలో “24 క్రాఫ్ట్స్” అనేది కార్మికుల వృత్తి విభాగాలకు సంబంధించిన పదం; ప్రపంచమంతటికీ ఒకే జాబితా కాదు.',
      sound:'సౌండ్ (Sound) అంటే సంగీతం మాత్రమే కాదు. మాటలు, అడుగుల చప్పుడు, వాతావరణంలోని శబ్దాలు కూడా ఇందులో భాగమే. సంగీతం లేకున్నా ఇతర శబ్దాలు ఉండవచ్చు. ఏ శబ్దం ఎలాంటి భావనను కలిగిస్తుందో సన్నివేశంపై ఆధారపడుతుంది.',
      camera:'కెమెరాను ఎక్కడ ఉంచుతామో దానివల్ల ప్రేక్షకులు చూసే వివరాలు మారవచ్చు. కింద నుంచి తీసిన షాట్ ఎప్పుడూ శక్తిని చూపదు; పై నుంచి తీసిన షాట్ ఎప్పుడూ బలహీనతను చూపదు. కెమెరా కోణం (Angle) అర్థం సన్నివేశాన్ని బట్టి మారుతుంది.',
      history:'సినిమా ఒక్క రోజులో, ఒక్క వ్యక్తి వల్ల పుట్టలేదు. కెమెరా, కదిలే చిత్రాలు, ప్రొజెక్షన్ వంటి పద్ధతులను చాలామంది అభివృద్ధి చేశారు. 1895 పారిస్ ప్రదర్శన ముఖ్యమైన ఘట్టం, కానీ దానికంటే ముందే ఇతర ప్రదర్శనలు జరిగాయి.',
      script:'ఐడియాను చిత్రీకరించగల చర్యలుగా రాయడంలో స్క్రీన్‌ప్లే (Screenplay) సహాయపడుతుంది. పాత్ర ఏం చేస్తుంది, ఏమి చెబుతుంది, కథ ఎక్కడ జరుగుతుంది అనే విషయాలు ఇందులో ఉండవచ్చు.',
      acting:'నటులు మాటలతో పాటు చూపులు, కదలికలు, విరామాలు, స్వరం ద్వారా కూడా పాత్రను చూపిస్తారు. నటనకు అర్థం సన్నివేశాన్ని బట్టి మారుతుంది.',
      lighting:'లైటింగ్ (Lighting) వల్ల ముఖం, వస్తువులు, నీడలు ఎలా కనిపిస్తాయో మారుతుంది. కాంతి దిశ, పరిమాణం, దూరం, బలం ప్రభావం చూపవచ్చు. ఒక్క విధమైన లైట్‌కు ఒక్క భావమే ఉండదు.',
      editing:'ఎడిటింగ్ (Editing)లో షాట్లను ఎంచుకొని క్రమంలో పెడతారు. కట్ (Cut) అంటే ఒక షాట్ నుంచి మరో షాట్‌కు నేరుగా మారడం. ఏ షాట్‌ను ఎంతసేపు చూపిస్తామన్నదీ ముఖ్యం.',
      making:'చిన్న ఐడియాతో మొదలుపెట్టండి. పాత్ర ఎవరు? వాళ్లకు ఏం కావాలి? కథ ఎక్కడ జరుగుతుంది? ముందుగా ప్లాన్ చేసి, ఫోన్‌తో అవసరమైన షాట్లు తీయండి. మాటలు స్పష్టంగా వినిపిస్తున్నాయో చూసుకోండి. షాట్లను క్రమంలో పెట్టి చిన్న సినిమా పూర్తి చేయండి.'
    };
    // v0.8: short Telugu support, not a full professional translation.
    Object.assign(teluguNotes,{
  "genres": "జానర్ (Genre) అంటే కథల లక్షణాలను బట్టి ఇచ్చే పేరు. కామెడీ, హారర్, మిస్టరీ లాంటివి ఒకే సినిమాలో కలిసివుండవచ్చు. డాక్యుమెంటరీలు నిజమైన విషయాలపై ఉన్నా, వాటిని చిత్రీకరించి ఎడిట్ చేసే నిర్ణయాలు ఉంటాయి.",
  "india": "1896లో బొంబాయిలో కదిలే చిత్రాల ప్రదర్శనలు జరిగాయి. 1912 నాటి శ్రీ పుండలిక్, 1913 నాటి రాజా హరిశ్చంద్ర ప్రారంభ భారతీయ సినిమా చరిత్రలో ముఖ్యమైనవి. “మొదటి చిత్రం” అనే విషయంపై చరిత్రకారుల్లో చర్చ ఉంది. భారతదేశంలో ఎన్నో భాషల్లో సినిమాలు అభివృద్ధి చెందాయి.",
  "character": "కథలో పాత్రకు ఏం కావాలి, దానికి ఏది అడ్డుగా ఉంది, ఆ పాత్ర ఏం నిర్ణయం తీసుకుంటుంది అనే ప్రశ్నలు కథను ముందుకు నడిపించవచ్చు. ప్రతి అడ్డంకి గొడవే కావాల్సిన అవసరం లేదు.",
  "dialogue": "డైలాగ్ అంటే పాత్ర మాట్లాడే మాటలు. మాటలతో పాటు స్వరం, చూపు, నిశ్శబ్దం కూడా అర్థాన్ని మార్చవచ్చు. నేరుగా చెప్పకుండా సందర్భం ద్వారా అర్థమయ్యే భావాన్ని సబ్‌టెక్స్ట్ (Subtext) అంటారు.",
  "composition": "ఫ్రేమ్ లో వ్యక్తులు, వస్తువులు, ఖాళీ స్థలం ఎలా అమర్చారో అదే కంపోజిషన్. రూల్ ఆఫ్ థర్డ్స్ ఒక ఉపయోగకరమైన సూచన మాత్రమే; ప్రతి మంచి షాట్ దాన్నే పాటించాల్సిన అవసరం లేదు.",
  "movement": "పాన్ (Pan)లో కెమెరా ఒకే స్థానం నుంచి పక్కలకు తిరుగుతుంది. టిల్ట్ (Tilt)లో పైకి లేదా కిందికి తిరుగుతుంది. ట్రాకింగ్ షాట్‌లో కెమెరా ఉన్న స్థానం మారుతుంది. కదలికకు కథలో కారణం ఉండటం ఉపయోగకరం.",
  "lenses": "అదే సెన్సార్‌పై తక్కువ ఫోకల్ లెంగ్త్ ఉన్న లెన్స్ సాధారణంగా ఎక్కువ ప్రాంతాన్ని చూపిస్తుంది. దగ్గర, దూరం వస్తువులు ఎలా కనిపిస్తాయనే పర్స్పెక్టివ్‌కు కెమెరా ఉన్న స్థానం చాలా ముఖ్యం.",
  "ambience": "సినిమాలో మాటలు, అడుగుల శబ్దం, వాతావరణ శబ్దాలు, సంగీతం ఉంటాయి. ఆంబియెన్స్ (Ambience) స్థలానికి సంబంధించిన నేపథ్య శబ్దం. రూమ్ టోన్ (Room tone) ఎడిటింగ్‌కు ఉపయోగపడే ప్రదేశపు నేపథ్య శబ్ద రికార్డింగ్.",
  "music": "అదే సన్నివేశానికి సంగీతం మార్చితే ప్రేక్షకుల అంచనాలు మారవచ్చు. పాత్రకు కూడా వినిపించే రేడియో సంగీతాన్ని డైజెటిక్ (Diegetic) మ్యూజిక్ అనవచ్చు. సంగీతం లేకపోయినా సౌండ్ ఉండవచ్చు.",
  "shotlist": "షాట్ లిస్ట్ (Shot list) అంటే చిత్రీకరించాలని ప్లాన్ చేసిన షాట్ల జాబితా. స్టోరీబోర్డ్ (Storyboard) వాటిని చిత్రాలుగా చూపించే ప్లాన్. ఎడిటింగ్‌లో షాట్ల క్రమం మారవచ్చు."
});
    Object.assign(teluguNotes,{
  "showdonttell": "భావాన్ని పాత్ర చేసే పనితో కూడా చూపించవచ్చు. కానీ డైలాగ్ చెడ్డది కాదు. మాటలు, చూపులు, చర్యలు కలిసి కథ చెప్పగలవు. ఏది స్పష్టంగా ఉంటుందో దాన్ని ఎంచుకోండి.",
  "colour": "సినిమాలో రంగులు ప్రేక్షకుల దృష్టిని ఆకర్షించవచ్చు. సెట్లు, దుస్తులు, లైటింగ్, కెమెరా, కలర్ ఫినిషింగ్ అన్నీ ప్రభావం చూపుతాయి. ఒక్క రంగుకు ఎప్పుడూ ఒకే అర్థం ఉండదు.",
  "continuity": "ఒక షాట్‌లో కప్పు ఎడమ వైపు ఉంటే, తర్వాత షాట్‌లో కారణం లేకుండా కుడివైపు మారితే ప్రేక్షకులకు గందరగోళం రావచ్చు. చర్యలు, వస్తువులు, శబ్దాలు షాట్ల మధ్య అర్థమయ్యేలా ఉండడమే కంటిన్యుటీ.",
  "rhythm": "షాట్ ఎంతసేపు కనిపిస్తుందో ప్రేక్షకులు వివరాలు గమనించే సమయాన్ని మార్చవచ్చు. వేగంగా కట్ చేయడమే రిథమ్ కాదు. పాత్ర చర్యలు, శబ్దాలు, కథ సందర్భం కూడా ముఖ్యం.",
  "craft24": "తెలుగు సినీ పరిశ్రమలో “24 క్రాఫ్ట్స్” అనే మాట కార్మికుల వృత్తి విభాగాలు, సంఘాల సందర్భంలో వాడతారు. ప్రపంచంలోని అన్ని సినిమాల్లో కచ్చితంగా 24 ఉద్యోగాలుంటాయని అర్థం కాదు.",
  "teams": "ఒక చిన్న సన్నివేశం కోసం రచన, దర్శకత్వం, నటన, కళా విభాగం, కెమెరా, లైటింగ్, సౌండ్, ఎడిటింగ్ బృందాలు పరస్పరం కలిసి పని చేయవచ్చు.",
  "pipeline": "సినిమా నిర్మాణంలో కథ అభివృద్ధి, ముందస్తు ప్రణాళిక, షూటింగ్, ఎడిటింగ్ మరియు ఇతర పూర్తి చేసే పనులు, ప్రేక్షకులకు చేరవేయడం వంటి దశలు ఉంటాయి. కొన్ని పనులు ఒకేసారి జరగవచ్చు.",
  "shootscene": "మొదటి సన్నివేశానికి చిన్న ఐడియా, ఒక స్థలం, ఒక సులభమైన పని ఎంచుకోండి. షాట్ ప్లాన్ చేయండి. కెమెరా, సౌండ్ పరీక్షించండి. అవసరమైతే మళ్లీ టేక్ తీసి రికార్డింగ్ వెంటనే చూసుకోండి.",
  "editminute": "ఎడిటింగ్‌లో ఉపయోగపడే టేక్‌లను ఎంచుకొని క్రమంలో పెడతారు. అవసరం లేని భాగాలు తీసేయవచ్చు. మాటలు స్పష్టంగా ఉన్నాయో, కట్‌ల మధ్య సౌండ్ సహజంగా ఉందో చూసి చిన్న కథను పూర్తి చేయండి.",
  "review": "మీ చిన్న సినిమా చూసిన వ్యక్తిని కథ అర్థమైందా, ఎక్కడ సందేహం వచ్చింది, మాటలు వినిపించాయా అని అడగండి. ఉపయోగకరమైన సూచనను తీసుకుని ఒక మార్పు చేసి మళ్లీ చూడండి."
});
    const glossary=[
      {term:'Frame',te:'ఫ్రేమ్',meaning:'One image in a video. Pause a video to see one frame.'},
      {term:'Shot',te:'షాట్',meaning:'An uninterrupted view in the finished film, before a cut.'},
      {term:'Scene',te:'సీన్',meaning:'A part of the story, usually focused on one event or situation. It may contain several shots.'},
      {term:'Take',te:'టేక్',meaning:'One recorded attempt at filming a shot or performance.'},
      {term:'Cut',te:'కట్',meaning:'A direct change from one shot to another in the edit.'},
      {term:'Wide shot',te:'వైడ్ షాట్',meaning:'A shot that shows the subject and a larger part of the surroundings.'},
      {term:'Close-up',te:'క్లోజప్',meaning:'A shot that shows a person or object in greater detail.'},
      {term:'Composition',te:'కంపోజిషన్',meaning:'How people, objects and other visual elements are arranged inside the frame.'},
      {term:'Screenplay',te:'స్క్రీన్‌ప్లే',meaning:'A written plan for a film, including scene action and usually dialogue.'},
      {term:'Cinematography',te:'సినిమాటోగ్రఫీ',meaning:'The craft of creating a film’s camera images, including framing and lighting choices.'},
      {term:'Editing',te:'ఎడిటింగ్',meaning:'Selecting and arranging shots, and choosing when we move between them.'},
      {term:'Sound design',te:'సౌండ్ డిజైన్',meaning:'Creating and shaping the sound world of a film, including effects and atmosphere.'},
      {term:'Lighting',te:'లైటింగ్',meaning:'Controlling and using light to shape how subjects and spaces appear on camera.'},
      {term:'Screen direction',te:'స్క్రీన్ డైరెక్షన్',meaning:'The direction a subject moves or faces within the image.'},
      {term:'Continuity',te:'కంటిన్యుటీ',meaning:'Maintaining understandable connections between shots, such as action, positions and time.'},
      {term:'Key light',te:'కీ లైట్',meaning:'A principal light used to illuminate a subject in a lighting setup.'},
      {term:'Backlight',te:'బ్యాక్‌లైట్',meaning:'Light coming from behind a subject relative to the camera, often helping to outline its edges.'},
      {term:'Stakes',te:'స్టేక్స్',meaning:'What a character could gain, lose or experience because of a choice or event.'},
      {term:'Sound effect',te:'సౌండ్ ఎఫెక్ట్',meaning:'A sound used to represent or suggest an event, object or action.'},
      {term:'Pacing',te:'పేసింగ్',meaning:'How fast or slowly events and shots seem to move through a story.'}
    ];
    glossary.push(...[
  {
    "term": "Genre",
    "te": "జానర్",
    "meaning": "A flexible category describing shared film features or audience expectations."
  },
  {
    "term": "Documentary",
    "te": "డాక్యుమెంటరీ",
    "meaning": "A film exploring real people, events or subjects, shaped through choices in filming and editing."
  },
  {
    "term": "Conflict",
    "te": "కాన్‌ఫ్లిక్ట్",
    "meaning": "An obstacle or tension that makes a character’s goal difficult."
  },
  {
    "term": "Subtext",
    "te": "సబ్‌టెక్స్ట్",
    "meaning": "A meaning suggested by actions or context rather than stated directly."
  },
  {
    "term": "Negative space",
    "te": "నెగెటివ్ స్పేస్",
    "meaning": "Open or relatively empty area around the main subject in an image."
  },
  {
    "term": "Pan",
    "te": "పాన్",
    "meaning": "Rotating the camera horizontally from its position."
  },
  {
    "term": "Tilt",
    "te": "టిల్ట్",
    "meaning": "Rotating the camera up or down from its position."
  },
  {
    "term": "Tracking shot",
    "te": "ట్రాకింగ్ షాట్",
    "meaning": "A shot in which the camera changes position through space."
  },
  {
    "term": "Focal length",
    "te": "ఫోకల్ లెంగ్త్",
    "meaning": "A lens property that helps determine its field of view on a given sensor."
  },
  {
    "term": "Perspective",
    "te": "పర్స్పెక్టివ్",
    "meaning": "The visual relationship of near and far objects as viewed from a camera position."
  },
  {
    "term": "Ambience",
    "te": "ఆంబియెన్స్",
    "meaning": "Background sound that helps establish a place or atmosphere."
  },
  {
    "term": "Room tone",
    "te": "రూమ్ టోన్",
    "meaning": "Background sound recorded at a location, often useful for sound editing."
  },
  {
    "term": "Diegetic sound",
    "te": "డైజెటిక్ సౌండ్",
    "meaning": "Sound that belongs to the world of the story."
  },
  {
    "term": "Shot list",
    "te": "షాట్ లిస్ట్",
    "meaning": "A written plan of shots the crew intends to record."
  },
  {
    "term": "Storyboard",
    "te": "స్టోరీబోర్డ్",
    "meaning": "Drawings that plan possible images in a scene."
  }
]);
    glossary.push(...[
  {
    "term": "Colour palette",
    "te": "కలర్ పాలెట్",
    "meaning": "A selection of colours used together in the look of a film."
  },
  {
    "term": "Saturation",
    "te": "సాచురేషన్",
    "meaning": "How strong or muted a colour appears."
  },
  {
    "term": "Continuity editing",
    "te": "కంటిన్యుటీ ఎడిటింగ్",
    "meaning": "Editing choices intended to make action and space easy to follow across shots."
  },
  {
    "term": "Match on action",
    "te": "మ్యాచ్ ఆన్ యాక్షన్",
    "meaning": "Cutting between views while one action appears to continue."
  },
  {
    "term": "Dissolve",
    "te": "డిజాల్వ్",
    "meaning": "A transition where one image gradually blends into another."
  },
  {
    "term": "Pre-production",
    "te": "ప్రీ-ప్రొడక్షన్",
    "meaning": "Planning and preparing a film before principal photography."
  },
  {
    "term": "Production",
    "te": "ప్రొడక్షన్",
    "meaning": "The stage that commonly includes recording the main performances and scenes."
  },
  {
    "term": "Post-production",
    "te": "పోస్ట్-ప్రొడక్షన్",
    "meaning": "Work after or alongside filming that helps finish a film, including editing and sound."
  },
  {
    "term": "Principal photography",
    "te": "ప్రిన్సిపల్ ఫోటోగ్రఫీ",
    "meaning": "The main period of shooting a film’s scenes."
  },
  {
    "term": "Rough cut",
    "te": "రఫ్ కట్",
    "meaning": "An early version of an edit that can be reviewed and revised."
  },
  {
    "term": "Prop",
    "te": "ప్రాప్",
    "meaning": "An object used by a performer or in the action of a scene."
  },
  {
    "term": "Set dressing",
    "te": "సెట్ డ్రెస్సింగ్",
    "meaning": "Objects and details arranged to make a filmed space look right for the story."
  }
]);
    const crafts=[
      {id:'writing',symbol:'✍',title:'Screenwriting',desc:'Write the story and what happens in each scene.',detail:'Screenwriters plan characters, events and dialogue (what people say). Their screenplay describes what happens in the film. It is a guide for making the film, not the finished film.',link:'The director works with writers, actors and other teams to turn the script into a film.'},
      {id:'direction',symbol:'◉',title:'Directing',desc:'Guide how the story is shown and performed.',detail:'The director guides how the story is told on screen. They work with actors and other teams to make choices about performance, camera work, sound and editing.',link:'Directing works closely with writing, acting, camera, editing and sound.'},
      {id:'camera',symbol:'▣',title:'Cinematography',desc:'Plan how the film looks through the camera.',detail:'The cinematographer, also called the director of photography, plans much of the camera work and lighting with the director. They help decide how shots are framed, lit and recorded.',link:'Cinematography works closely with directing, lighting and production design.'},
      {id:'acting',symbol:'♙',title:'Acting',desc:'Show what a character thinks, feels and does.',detail:'Actors play characters through actions, facial expressions, movement and voice. They can show us what someone feels, even without speaking.',link:'Acting connects the script and the director’s ideas to what the audience sees and hears.'},
      {id:'design',symbol:'▥',title:'Production Design',desc:'Plan how the film’s places and sets look.',detail:'The production designer leads the overall look of sets and locations on screen. They work with the art department and other teams on things like furniture, colours and the world around the characters.',link:'Production design works with the director, camera and other visual teams.'},
      {id:'sound',symbol:'♫',title:'Sound',desc:'Record and shape what the audience hears.',detail:'Sound workers record voices and noises during filming. Later, sound editors and designers may clean up speech, add effects and shape the background sounds we hear.',link:'Sound works closely with directing, editing and music.'},
      {id:'editing',symbol:'⌁',title:'Editing',desc:'Choose shots and decide when they change.',detail:'The editor chooses recorded shots and arranges them in an order that makes sense. How long we see each shot, and when the film cuts, can change how a moment feels.',link:'Editing works closely with the director, sound and music teams.'},
      {id:'music',symbol:'♪',title:'Film Music',desc:'Use music to support or contrast with a scene.',detail:'Composers can write original music for a film. Filmmakers may also choose existing songs if they have permission to use them. Music may suggest a feeling—or the film may work better without it.',link:'Film music works with the director, editor and sound team.'},
      {id:'producing',symbol:'◇',title:'Producing',desc:'Help organize the people, money and plan.',detail:'Producers help make a film happen. Their work can include finding money, hiring people, planning the schedule and helping the project reach an audience. Different producers handle different parts of this work.',link:'Producing helps the creative teams get the resources and support they need.'}
    ];
    // Unit metadata correction only; original lessons, IDs, and completion remain intact.
    for(const l of lessons){if(['sound','editing'].includes(l.id))l.unit='Sound'}
    const chapters=[
      {name:'01 · Discover cinema',strap:'Why films exist and how they began',ids:['why','history','units','genres','india'],later:[]},
      {name:'02 · Tell a human story',strap:'Ideas, writing and performance',ids:['story','script','acting','character','dialogue','showdonttell'],later:[]},
      {name:'03 · Learn visual language',strap:'Choices inside the frame',ids:['shot','camera','lighting','composition','movement','lenses','colour'],later:[]},
      {name:'04 · Sound and editing',strap:'Make images work together in time',ids:['sound','editing','ambience','music','continuity','rhythm'],later:[]},
      {name:'05 · People behind a film',strap:'Meet the collaborating crafts',ids:['crew','craft24','teams','pipeline'],later:[]},
      {name:'06 · Make your first film',strap:'Plan, shoot, finish and reflect',ids:['making','shotlist','shootscene','editminute','review'],later:[]}
    ];
    // Display lesson numbers in journey order without changing stable saved identifiers.
    const lessonIndex=new Map(chapters.flatMap(c=>c.ids).map((id,i)=>[id,i]));
    lessons.sort((a,b)=>lessonIndex.get(a.id)-lessonIndex.get(b.id));
    lessons.forEach((l,i)=>l.num=String(i+1).padStart(2,'0'));
    // Guided choices do not have absolute right answers. Each option reveals a plausible outcome.
    const choices={
      why:{prompt:'A person waits at an empty bus stop. What could start your film?',opts:[['The empty bench','The location and empty space become important first.'],['The waiting face','The viewer may start by studying the character’s response.']]},
      history:{prompt:'You can record a short moment from daily life. What will you show?',opts:[['People leaving work','An everyday event can become an interesting moving image.'],['A staged surprise','Even a short staged action can tell a miniature story.']]},
      units:{prompt:'You film the same short action three times. What do you have?',opts:[['Three takes','Yes. Each recording attempt can be called a take.'],['Three scenes','Not necessarily. Repeating one action does not automatically create three scenes.']]},
      story:{prompt:'Your character needs a key. What makes the search matter?',opts:[['We know what it unlocks','Understanding the importance of the key can give the action stakes.'],['Show only close-ups','Framing can focus attention, but by itself does not explain why the key matters.']]},
      script:{prompt:'You need to show nervousness in a script. Which line can be filmed directly?',opts:[['She avoids the letter','That describes an action actors can perform; what it means depends on context.'],['Her soul feels anxious','This may describe an intention, but the team still needs choices that viewers can see or hear.']]},
      acting:{prompt:'Your character hears surprising news. How might an actor respond?',opts:[['Pause before speaking','A pause can show that the character is taking in the news.'],['Speak immediately','An instant response might suggest urgency or certainty. Either can work in context.']]},
      shot:{prompt:'A character is alone in a large station. What do you show first?',opts:[['The whole station','A wide view can establish the space and the character within it.'],['Their face','A closer view can focus attention on the character before revealing the setting.']]},
      camera:{prompt:'You want to reveal what is behind a character. What could you try?',opts:[['Move the camera','Camera movement can gradually reveal what was hidden.'],['Cut to another view','Editing to a new shot can also reveal the information.']]},
      lighting:{prompt:'You want viewers to notice the side of a face. What might help?',opts:[['A side light','Side lighting can create visible differences between lit and shadowed areas.'],['A front light','Front lighting may reveal more facial detail with less side-to-side contrast.']]},
      sound:{prompt:'A hallway looks empty. Which audio choice do you test?',opts:[['Footsteps out of view','That sound can suggest somebody is nearby without showing them.'],['No background music','Without music, other sounds or quiet can become more noticeable.']]},
      editing:{prompt:'You have a clock and a waiting person. Which comes first?',opts:[['The clock','That may make time feel relevant before we meet the character.'],['The person','That may direct attention to the person before revealing the clock.']]},
      crew:{prompt:'A night scene is difficult to read. Who could help?',opts:[['Camera and lighting teams','They can adjust how the scene is lit and photographed.'],['Art and costume teams','They can also improve how characters and the setting are visually distinguished.']]},
      making:{prompt:'Your first short needs ten locations. What is worth trying?',opts:[['Simplify to one place','A smaller scope often makes a first project more achievable.'],['Keep all ten places','It could work with enough planning and resources, but increases complexity.']]}
    };

    Object.assign(choices,{
  "genres": {
    "prompt": "What is the genre of a story about a funny ghost?",
    "opts": [
      [
        "A comedy with a ghost",
        "The ghost might be used to create humour."
      ],
      [
        "A horror-comedy",
        "The same idea could mix funny and frightening moments."
      ]
    ]
  },
  "india": {
    "prompt": "You are introducing Indian cinema. What should come first?",
    "opts": [
      [
        "One famous filmmaker",
        "A strong example can help, but may not represent all regional histories."
      ],
      [
        "Many filmmaking traditions",
        "A multilingual introduction helps show how broad Indian cinema is."
      ]
    ]
  },
  "character": {
    "prompt": "A character misses the last bus. What makes it a story?",
    "opts": [
      [
        "They had an important appointment",
        "The consequences may make the delay matter."
      ],
      [
        "The character is afraid of going home",
        "The internal obstacle may be more important than the bus itself."
      ]
    ]
  },
  "dialogue": {
    "prompt": "A character says “Welcome back.” How could it mean different things?",
    "opts": [
      [
        "Smile and move closer",
        "The line might suggest warmth."
      ],
      [
        "Avoid eye contact",
        "The same words might suggest distance or discomfort."
      ]
    ]
  },
  "composition": {
    "prompt": "A person stands alone on a platform. How do you frame them?",
    "opts": [
      [
        "Place them in the center",
        "The viewer may focus on the person immediately."
      ],
      [
        "Leave room around them",
        "The empty space may become important alongside the character."
      ]
    ]
  },
  "movement": {
    "prompt": "You want to follow someone turning a corner. What might you try?",
    "opts": [
      [
        "Pan from a fixed spot",
        "A rotation may follow them as long as they remain in view."
      ],
      [
        "Move alongside them",
        "Moving the camera position can change the view of the surroundings."
      ]
    ]
  },
  "lenses": {
    "prompt": "You want more of a room in the image. What could you try?",
    "opts": [
      [
        "Use a shorter focal length",
        "On the same sensor, this generally gives a wider field of view."
      ],
      [
        "Move the camera backward",
        "Changing camera position includes more space and can change perspective."
      ]
    ]
  },
  "ambience": {
    "prompt": "A scene takes place near a road. Which sound is worth trying?",
    "opts": [
      [
        "Distant traffic",
        "Ambience can help suggest the location even off-screen."
      ],
      [
        "Only the spoken lines",
        "This focuses attention on the voices; the scene may feel different."
      ]
    ]
  },
  "music": {
    "prompt": "The scene is about waiting. What should be tested?",
    "opts": [
      [
        "Music from the character’s phone",
        "If the character hears it, it may belong to the story world."
      ],
      [
        "No added music",
        "Existing dialogue and ambience may become easier to notice."
      ]
    ]
  },
  "shotlist": {
    "prompt": "Before filming, what do you choose to prepare?",
    "opts": [
      [
        "A small shot list",
        "It may help you remember the actions and views needed."
      ],
      [
        "Just start recording",
        "Improvising can work, but you may discover missing shots later."
      ]
    ]
  }
});

    // v0.7: private, local storyboard and lesson practice notes; no account or network transmission.
    const STORY_KEY='frameone-scene-v07',NOTES_KEY='frameone-practice-v07';
    const sceneQuestions={
      mystery:{label:'Mystery',question:'Why is this person waiting?',hints:['Introduce the person and place.','Add a clue without solving everything.','Show a response that raises another question.']},
      reunion:{label:'Reunion',question:'Who might the person meet?',hints:['Show the anticipation.','Introduce a sign that somebody could arrive.','Show how the waiting person reacts.']},
      decision:{label:'Decision',question:'Will the person stay or leave?',hints:['Show what makes the choice matter.','Introduce new information.','Show a decision through an action.']}
    };
    const scenePhases=[{name:'Beginning',prompt:'Where are we, and who is here?'},{name:'Middle',prompt:'What new information do we learn?'},{name:'Ending',prompt:'What does the person do next?'}];
    Object.assign(choices,{
  "showdonttell": {
    "prompt": "A character misses someone. What could introduce that idea?",
    "opts": [
      [
        "They speak about it",
        "Dialogue can explain feelings directly and reveal how the person speaks."
      ],
      [
        "They put away an unused cup",
        "An observable action may invite viewers to infer absence."
      ]
    ]
  },
  "colour": {
    "prompt": "You want viewers to notice one letter. What might help?",
    "opts": [
      [
        "Contrast its colour against the desk",
        "A noticeable difference can draw attention without defining an emotion."
      ],
      [
        "Use similar colours throughout",
        "A subtle palette may be useful, but the letter could be harder to notice."
      ]
    ]
  },
  "continuity": {
    "prompt": "A cup is on the left of a table. The next shot shows it on the right. What do you do?",
    "opts": [
      [
        "Check whether someone moved it",
        "If the story did not show a move, the sudden change might distract viewers."
      ],
      [
        "Keep the mismatch deliberately",
        "A deliberate discontinuity can be meaningful if it serves the scene."
      ]
    ]
  },
  "rhythm": {
    "prompt": "A person reads a difficult letter. How long would you hold their reaction?",
    "opts": [
      [
        "A brief glimpse",
        "A short duration offers less time to study the face."
      ],
      [
        "A longer look",
        "A longer duration may encourage viewers to examine the reaction."
      ]
    ]
  },
  "craft24": {
    "prompt": "A beginner asks: “Must my first film have 24 crew members?”",
    "opts": [
      [
        "No; the phrase is about worker categories",
        "Small productions often combine roles. The federation term is not a crew-size rule."
      ],
      [
        "Yes; it is a worldwide production rule",
        "That is incorrect. Crew size and departments vary by film."
      ]
    ]
  },
  "teams": {
    "prompt": "A table scene looks too empty. Who might help?",
    "opts": [
      [
        "Art/set dressing and camera teams",
        "Props, space and framing can change how the table appears."
      ],
      [
        "Only the screenwriter",
        "A script can describe the table, but a visual scene involves many collaborators."
      ]
    ]
  },
  "pipeline": {
    "prompt": "You are finding a location before a shoot. What stage is this normally?",
    "opts": [
      [
        "Pre-production",
        "Location planning is commonly part of preparation."
      ],
      [
        "Distribution",
        "Distribution is how the finished film reaches audiences."
      ]
    ]
  },
  "shootscene": {
    "prompt": "You recorded a scene but cannot understand its speech. Next step?",
    "opts": [
      [
        "Check and record it again while possible",
        "Catching sound problems on location can save a project."
      ],
      [
        "Assume editing will fix every sound problem",
        "Some unclear or clipped recordings cannot be repaired convincingly."
      ]
    ]
  },
  "editminute": {
    "prompt": "Your first rough cut has a repeating action. What could you try?",
    "opts": [
      [
        "Remove an unnecessary repetition",
        "Cutting redundant material may make the action clearer."
      ],
      [
        "Keep every recorded take",
        "A finished scene does not need every take."
      ]
    ]
  },
  "review": {
    "prompt": "A viewer says “I did not understand what the note said.” How should you respond?",
    "opts": [
      [
        "Find out where clarity was lost",
        "You can consider a better angle, edit or sound cue to explain what matters."
      ],
      [
        "Tell them they watched it incorrectly",
        "Different viewers bring valuable observations; you can still choose what to change."
      ]
    ]
  }
});
    const sceneMini={
      units:{title:'A storyboard is not a recorded shot',items:[['place','Sketch the place','A frame is one still image. This is a storyboard illustration of a possible shot, not actual recorded footage.'],['detail','Sketch a detail','A shot in a finished film is a continuous stretch of images between cuts. A take is an attempt to record that shot.'],['person','Sketch the character','Several planned shots could be filmed and assembled into a scene.']]},
      story:{title:'One situation. Three possible story beats.',items:[['place','Introduce the situation','A person waits at a bus stop. The viewer sees where the action takes place.'],['detail','Suggest a question','A closer image of a clock could make waiting or an appointment feel relevant.'],['person','Focus on a response','A closer planned shot could invite us to notice the person’s next choice or expression.']]},
      shot:{title:'How the image directs attention',items:[['place','Begin wide','A wider view places the person in their surroundings.'],['person','Move closer','A closer view makes the person more prominent.'],['detail','Show an object','A detail shot can direct attention to an object, such as the clock.']]},
      editing:{title:'Choose what the audience learns first',items:[['place','Place first','The location becomes the viewer’s first information.'],['detail','Detail first','The clock may raise a question about time before we know the location.'],['person','Person first','The person becomes our first point of attention.']]},
      making:{title:'Start with a filmable idea',items:[['place','One location','A single familiar location can be enough for a first exercise.'],['detail','One useful detail','A small object can give an action meaning within the story.'],['person','One decision','Even a brief action can create a beginning, middle and end.']]}
    };
    Object.assign(sceneMini,{
  "genres": {
    "title": "One image could begin many genres",
    "items": [
      [
        "place",
        "Ordinary moment",
        "A person waiting at a bus stop might be part of a drama, comedy or mystery. The image alone does not decide the genre."
      ],
      [
        "detail",
        "Possible clue",
        "An illustrated clock could suggest an urgent appointment or could be a harmless detail."
      ],
      [
        "person",
        "Possible reaction",
        "A response can help viewers interpret the scene—but context still matters."
      ]
    ]
  },
  "character": {
    "title": "Want → obstacle → choice",
    "items": [
      [
        "place",
        "What does the person want?",
        "Perhaps they want to catch a bus. This is a possible story setup, not a full screenplay."
      ],
      [
        "detail",
        "What changes?",
        "A clock may suggest limited time if the wider story establishes an appointment."
      ],
      [
        "person",
        "What will they do?",
        "Their decision, once performed, might reveal what matters to them."
      ]
    ]
  },
  "dialogue": {
    "title": "Words need a situation",
    "items": [
      [
        "place",
        "Establish context",
        "Two strangers at a bus stop could speak politely or uncomfortably."
      ],
      [
        "person",
        "Focus on behavior",
        "A character’s expression or movement can change the possible meaning of simple words."
      ],
      [
        "detail",
        "Direct attention",
        "An object can give the dialogue another layer of meaning if the scene establishes why it matters."
      ]
    ]
  },
  "composition": {
    "title": "Where do you guide attention?",
    "items": [
      [
        "place",
        "Space and subject",
        "A wide illustration provides information about the location and the person."
      ],
      [
        "person",
        "Emphasize the character",
        "A closer view gives the person more visual prominence."
      ],
      [
        "detail",
        "Choose a detail",
        "A detail illustration can call attention to a particular object."
      ]
    ]
  },
  "shotlist": {
    "title": "Plan pictures before recording",
    "items": [
      [
        "place",
        "Shot plan 1 · Location",
        "A wide view could establish where the scene happens."
      ],
      [
        "detail",
        "Shot plan 2 · Important detail",
        "You might plan to film a specific object if the story needs it."
      ],
      [
        "person",
        "Shot plan 3 · Reaction",
        "You might also plan a view of the character. The final edit may use these in any order."
      ]
    ]
  }
});
    const crewPhases={
      idea:{name:'Shape the idea',description:'A story begins with choices about characters, events and what the project can realistically achieve.',roles:['writing','direction','producing']},
      plan:{name:'Prepare the shoot',description:'People plan locations, visual style, performers, equipment, budgets and schedules together. A small team may share many jobs.',roles:['producing','direction','camera','design','sound']},
      shoot:{name:'Capture the scenes',description:'Direction, performance, camera, production design and sound work together while the action is recorded.',roles:['direction','acting','camera','sound','design']},
      finish:{name:'Finish the film',description:'Recorded images and sounds are shaped into a finished film. Editing, sound and music decisions often influence each other.',roles:['editing','sound','music','direction']}
    };
    function safeGet(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
    function initialStory(){return {question:'mystery',shots:['wide','medium','close'],notes:['A person waits at a bus stop.','Something makes the wait important.','The person makes a choice.']}}
    function loadStory(){const raw=safeGet(STORY_KEY,null);const def=initialStory();if(!raw||typeof raw!=='object')return def;return {question:Object.hasOwn(sceneQuestions,raw.question)?raw.question:def.question,shots:[0,1,2].map(i=>['wide','medium','close'].includes(raw.shots?.[i])?raw.shots[i]:def.shots[i]),notes:[0,1,2].map(i=>typeof raw.notes?.[i]==='string'?raw.notes[i].slice(0,240):def.notes[i])}}
    function saveStory(){try{localStorage.setItem(STORY_KEY,JSON.stringify(state.story));return true}catch{return false}}
    function loadNotes(){const data=safeGet(NOTES_KEY,{});return data&&typeof data==='object'&&!Array.isArray(data)?data:{}}
    function saveNotes(){try{localStorage.setItem(NOTES_KEY,JSON.stringify(state.notes));return true}catch{return false}}
    function storyPlanText(){const q=sceneQuestions[state.story.question];return ['FRAME ONE · FIRST SCENE SHOT PLAN','Story question: '+q.question,'Setting: A fictional bus stop.','',...scenePhases.flatMap((p,i)=>['SHOT '+(i+1)+' · '+p.name+' · '+state.story.shots[i].toUpperCase(), 'Action idea: '+(state.story.notes[i].trim()||'(not written yet)'), 'Purpose: '+q.hints[i],'']), 'A shot plan is an idea for filming, not a finished film.','Created locally in Frame One.'].join('\n')}
    const state={page:'home',story:loadStory(),storyStep:0,notes:loadNotes(),crewPhase:'idea',miniStep:0,lesson:null,craft:null,lab:'frame',frame:'wide',sound:'silence',light:'front',filter:'All',query:'',quiz:null,quizAnswered:false,audio:null,cutOpening:'place',cutStep:0,cutOrder:['place','detail','person'],cutDuration:[2,2,2],cutPlaying:false,cutTimer:null,activity:null,frameGuide:true,compare:false,frameZoom:1,lightPower:90,lightSoft:35,ambience:true,soundPlaying:false,soundTimer:null,colourMode:'neutral',colourStrength:65,continuityMode:'match',telugu:loadTelugu()};
    let finished=loadProgress();
    function loadTelugu(){try{return localStorage.getItem(LANGUAGE_KEY)==='yes'}catch{return false}}
    function saveTelugu(){try{localStorage.setItem(LANGUAGE_KEY,state.telugu?'yes':'no')}catch{}}
    function loadProgress(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return new Set(Array.isArray(x)?x.filter(s=>lessons.some(l=>l.id===s)):[])}catch{return new Set()}}
    function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify([...finished]))}catch{}}
    function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
    function icon(kind){const icons={story:'<circle cx="38" cy="33" r="22"/><path d="M15 69c15-11 31-11 46 0M38 12v42M20 34h36"/>',shot:'<rect x="9" y="12" width="58" height="45" rx="3"/><path d="M28 12v45m19-45v45M9 28h58M9 43h58"/>',crew:'<circle cx="38" cy="22" r="11"/><path d="M15 68V51c0-13 9-19 23-19s23 6 23 19v17M4 70h68"/>',sound:'<path d="M15 34v10m8-20v30m9-42v54m9-43v32m9-45v57m9-42v30"/>',tech:'<circle cx="38" cy="37" r="25"/><circle cx="38" cy="37" r="11"/><path d="M38 2v10m0 50v10M3 37h10m50 0h10"/>'};return `<svg viewBox="0 0 76 76" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[kind]||icons.story}</svg>`}
    function updateProgress(){let count=finished.size;let p=Math.round(count/lessons.length*100);document.getElementById('progressCircle').style.setProperty('--angle',p+'%');document.getElementById('progressLabel').textContent=`${count}/${lessons.length} lessons`}
    function lessonCard(l){return `<button class="lesson-card" data-lesson="${l.id}"><span class="card-thumb thumb-${l.thumb}">${icon(l.thumb)}</span><span class="card-meta">LESSON ${l.num} <span class="dot"></span> ${l.minutes} MIN</span><h3>${l.title}</h3><p>${l.subtitle}</p><span class="card-footer"><span class="${finished.has(l.id)?'complete':''}">${finished.has(l.id)?'✓ Completed':'Explore lesson'}</span><span aria-hidden="true">↗</span></span></button>`}
    function home(){const next=lessons.find(l=>!finished.has(l.id))||lessons[0];return `<div class="page"><section class="hero"><div class="hero-text"><div class="eyebrow">WELCOME TO THE WORLD OF CINEMA</div><h1>Learn to <em>see</em><br>the story.</h1><p>Why do movies move us? How do filmmakers build a scene? Discover the art of film, one simple idea at a time.</p><button class="cta" data-lesson="${next.id}">${finished.size?'Continue learning':'Start your first lesson'} <span aria-hidden="true">→</span></button></div><div class="hero-art"><div class="hero-grain"></div><div class="hero-figure"></div></div><div class="hero-caption">YOUR FIRST CINEMA JOURNEY / 001</div></section><div class="section-head"><div><span class="eyebrow-secondary">CHAPTERS · CURATED FOR BEGINNERS</span><h2>Your first discoveries</h2></div><button class="text-link" data-page="learn">All lessons →</button></div><div class="card-grid">${lessons.slice(0,3).map(lessonCard).join('')}</div><div class="chapter-quick"><span class="eyebrow-secondary">YOUR FILM SCHOOL · SIX CHAPTER PATHS · 33 AVAILABLE</span><strong>${finished.size} / ${lessons.length} lessons completed</strong><button class="btn-secondary" data-page="learn">Explore the chapter roadmap →</button></div><div class="section-head"><div><span class="eyebrow-secondary">TRY IT, DON'T JUST READ IT</span><h2>Make a creative choice</h2></div></div><div class="mid-grid"><div class="feature-panel"><span class="eyebrow">INTERACTIVE LAB</span><h3>Take the director’s chair.<br>Change the story.</h3><p>Experiment with visual framing, listen to audio sketches, arrange shots, and explore light. Every choice is yours.</p><button class="cta" data-page="lab">Try the Frame Lab →</button><button class="text-link secondary-lab" data-open-story="1">New: make your first three-shot scene →</button></div><div class="fact-panel"><span class="eyebrow-secondary">A LITTLE FILM THOUGHT</span><h3>There's no single “best” shot.</h3><p>The most useful question is not “Does this look cinematic?” but “What is this shot helping the audience feel or understand?”</p><div class="fact-line"><span aria-hidden="true">✦</span><span>Curiosity is your first filmmaking tool.</span></div></div></div></div>`}
    function learn(){
      const choicesFilter=['All','Foundations','Visual Language','Storytelling','Sound','Film Roles','Getting Started'];
      const matches=lessons.filter(l=>(state.filter==='All'||l.unit===state.filter)&&`${l.title} ${l.subtitle} ${l.unit}`.toLowerCase().includes(state.query.toLowerCase()));
      const searched=state.query.trim()!==''||state.filter!=='All';
      return `<div class="page"><div class="page-intro"><div class="eyebrow">YOUR LEARNING JOURNEY</div><h1>Every great film starts with curiosity.</h1><p>${lessons.length} complete beginner lessons across six connected chapters. Explore at your own pace; all six chapters in this beginner pathway now have lessons.</p></div><div class="journey-summary"><div><small>YOUR LEARNING PROGRESS</small><strong>${finished.size} <span>/ ${lessons.length} lessons</span></strong></div><div class="journey-meter"><div style="width:${Math.round(finished.size/lessons.length*100)}%"></div></div><button class="cta" data-lesson="${(lessons.find(l=>!finished.has(l.id))||lessons[0]).id}">Continue →</button></div><div class="search-row"><label class="sr-only" for="lessonSearch">Search lessons</label><input class="learn-search" id="lessonSearch" type="search" placeholder="Search: scenes, sound, dialogue..." value="${escapeHtml(state.query)}"><small>${lessons.length} live lessons</small></div><div class="filter-row">${choicesFilter.map(c=>`<button class="filter-chip" data-filter="${escapeHtml(c)}" aria-pressed="${state.filter===c}">${c}</button>`).join('')}</div>${searched?`<div class="list-grid" id="lessonList">${matches.map(l=>lessonRow(l)).join('')||'<div class="empty">No matching lessons. Try another search.</div>'}</div>`:`<div id="lessonList"><div class="chapter-list">${chapters.map((c,i)=>`<section class="chapter-panel"><div class="chapter-head"><div class="chapter-number">${String(i+1).padStart(2,'0')}</div><div><span class="eyebrow-secondary">CHAPTER ${i+1} · ${c.ids.filter(id=>finished.has(id)).length}/${c.ids.length} COMPLETED</span><h2>${c.name.slice(5)}</h2><p>${c.strap}</p></div><div class="chapter-meter"><div style="width:${Math.round(c.ids.filter(id=>finished.has(id)).length/c.ids.length*100)}%"></div></div></div><div class="chapter-lessons">${c.ids.map(id=>{const l=lessons.find(l=>l.id===id);return lessonRow(l)}).join('')}</div>${c.later.length?`<details class="coming-chapters"><summary>Future lessons planned · ${c.later.length} topics</summary><div>${c.later.map(t=>`<span>${t}</span>`).join('')}</div></details>`:'<div class="chapter-finished">✓ All planned lessons in this chapter are available</div>'}</section>`).join('')}</div></div>`}<details class="backup-panel"><summary>Keep a copy of your learning <span>Save / restore locally</span></summary><p>Downloads of this app may open under a different browser address. Your saved lessons and storyboard do not automatically move with the file. Export a backup before changing browsers or replacing the app.</p><div class="backup-actions"><button class="btn-secondary" data-backup-export>Download my learning backup</button><label class="btn-secondary backup-import-label" for="backupImport">Restore from backup JSON<input id="backupImport" type="file" accept=".json,application/json" aria-label="Choose Frame One backup JSON"></label></div><p class="backup-status" id="backupStatus" role="status"></p><small>Backup contains your notes and storyboard. Keep it private; importing replaces the current saved work in this browser.</small></details><details class="glossary-block"><summary>Film words, explained simply <span>${glossary.length} words · English + తెలుగు</span></summary><div class="glossary-grid">${glossary.map(g=>`<div class="glossary-entry"><div><strong>${g.term}</strong><span lang="te">${g.te}</span></div><p>${g.meaning}</p></div>`).join('')}</div></details></div>`;
    }
    function lessonRow(l){return `<button class="list-card" data-lesson="${l.id}"><span class="list-icon">${icon(l.thumb)}</span><span class="list-info"><span class="eyebrow-secondary">${finished.has(l.id)?'✓ COMPLETE · ':''}LESSON ${l.num} · ${l.minutes} MIN</span><h3>${l.title}</h3><p>${l.subtitle}</p></span><span class="tail" aria-hidden="true">↗</span></button>`}
    function decisionActivity(l){
      const c=choices[l.id];if(!c)return '';
      const chosen=state.activity?.lesson===l.id?state.activity.index:null;
      return `<section class="decision-activity" aria-label="Interactive filmmaking decision"><div class="activity-heading"><span class="eyebrow">✦ YOUR FIRST DIRECTOR'S CHOICE</span><span class="activity-count">ONE QUESTION · TWO POSSIBILITIES</span></div><div class="activity-stage"><span class="activity-projector" aria-hidden="true">◉</span><h3>${c.prompt}</h3><p>There isn't always one correct artistic answer. Pick a choice and explore its effect.</p></div><div class="activity-options">${c.opts.map((o,i)=>`<button class="activity-option" data-activity="${i}" aria-pressed="${chosen===i}"><span class="activity-letter">${String.fromCharCode(65+i)}</span><strong>${o[0]}</strong><span aria-hidden="true">↗</span></button>`).join('')}</div>${chosen!==null?`<div class="activity-feedback" role="status"><span>YOUR CHOICE · ${c.opts[chosen][0].toUpperCase()}</span><p>${c.opts[chosen][1]}</p><small>Now try the other choice. There can be more than one useful approach.</small></div>`:''}</section>`;
    }

    function miniScene(l){const d=sceneMini[l.id];if(!d)return '';const i=Math.max(0,Math.min(2,state.miniStep)),item=d.items[i];return `<section class="scene-beats" aria-label="Interactive illustrated scene study"><span class="eyebrow">WATCH THE IDEA DEVELOP · THREE STORYBOARD SKETCHES</span><h3>${d.title}</h3><div class="scene-beat-buttons">${d.items.map((s,j)=>`<button data-mini-step="${j}" aria-pressed="${i===j}">${String(j+1).padStart(2,'0')} · ${s[1]}</button>`).join('')}</div><div class="scene-beat-stage">${cutIllustration(item[0])}<p role="status"><strong>${item[1]}.</strong> ${item[2]}</p></div><small>Original static storyboard drawings. Select a frame to study it; these are not filmed shots.</small></section>`}
    function notesWidget(l){const note=typeof state.notes[l.id]==='string'?state.notes[l.id]:'';return `<div class="practice-notes"><label for="lessonPractice">My own filmmaking idea · optional</label><textarea maxlength="240" id="lessonPractice" placeholder="Write one simple example from your life or a film you imagine...">${escapeHtml(note)}</textarea><button class="btn-secondary" data-save-practice>Save idea on this device</button><span class="note-status" role="status"></span><p class="story-help">Private in this browser's local storage. No login or cloud backup. Completion does not require writing.</p></div>`}
    const lessonLabLinks={"composition": {"attribute": "data-open-frame", "label": "Compare different crops \u2192"}, "movement": {"attribute": "data-open-frame", "label": "Explore framing (not movement simulation) \u2192"}, "lenses": {"attribute": "data-open-frame", "label": "Try cropping a frame (not lens physics) \u2192"}, "ambience": {"attribute": "data-open-sound", "label": "Listen to ambience \u2192"}, "music": {"attribute": "data-open-sound", "label": "Compare original sound sketches \u2192"}, "shotlist": {"attribute": "data-open-story", "label": "Build your shot list \u2192"}, "character": {"attribute": "data-open-story", "label": "Plan a character\u2019s decision \u2192"}, "genres": {"attribute": "data-open-story", "label": "Try a story prompt \u2192"}};
    Object.assign(lessonLabLinks,{"showdonttell": {"attribute": "data-open-story", "label": "Create a three-shot action \u2192"}, "colour": {"attribute": "data-open-colour", "label": "Experiment with colour \u2192"}, "continuity": {"attribute": "data-open-continuity", "label": "Find a continuity change \u2192"}, "rhythm": {"attribute": "data-open-cut", "label": "Compare editing timing \u2192"}, "craft24": {"attribute": "data-open-crafts", "label": "Meet the film roles \u2192"}, "teams": {"attribute": "data-open-crafts", "label": "Explore the film crew map \u2192"}, "pipeline": {"attribute": "data-open-crafts", "label": "Explore production stages \u2192"}, "shootscene": {"attribute": "data-open-story", "label": "Plan a small shoot \u2192"}, "editminute": {"attribute": "data-open-cut", "label": "Try a three-shot edit \u2192"}, "review": {"attribute": "data-open-story", "label": "Review your planned scene \u2192"}});
    function extraLabLink(l){const x=lessonLabLinks[l.id];return x?`<button class="btn-secondary lab-deep-link" ${x.attribute}> ${x.label}</button>`:''}
    function lessonPage(){const l=lessons.find(x=>x.id===state.lesson)||lessons[0];const answered=state.quizAnswered;return `<div class="page lesson-view"><div class="lesson-navline"><button class="back-btn" data-page="learn">← All lessons</button><span>Lesson ${l.num} / ${lessons.length}</span></div><div class="lesson-top"><div class="eyebrow">LESSON ${l.num} · ${l.unit.toUpperCase()} · ${l.minutes} MIN READ</div><h1>${l.title}</h1><p>${l.subtitle}</p></div><article class="lesson-body">${decisionActivity(l)}<div class="reading-note">EXPLORE · COMPARE · PRACTISE · CHECK YOUR LEARNING</div><button class="language-toggle" type="button" data-telugu aria-pressed="${state.telugu}">${state.telugu?'Hide Telugu explanation':'తెలుగులో సులభంగా చెప్పు'} <span aria-hidden="true">⇄</span></button>${state.telugu?`<aside class="telugu-note" lang="te"><strong>చిన్న వివరణ · Telugu quick explanation</strong><p>${teluguNotes[l.id]}</p><small>ఇది సంక్షిప్త సారాంశం మాత్రమే. పూర్తి పాఠం కింద ఇంగ్లీష్‌లో ఉంది.</small></aside>`:''}${l.sections.map(s=>`<section class="lesson-section"><h3>${s[0]}</h3><p>${s[1]}</p></section>`).join('')}${miniScene(l)}<aside class="key-idea"><strong>THE BIG IDEA</strong><p>${l.idea}</p></aside><aside class="exercise"><strong>✦ TRY THIS YOURSELF</strong><p>${l.try}</p>${l.id==='units'?'<button class="btn-secondary lab-deep-link" data-open-cut="1">See how three shots make one scene →</button>':l.id==='shot'?'<button class="btn-secondary lab-deep-link" data-open-frame="1">Try three shot sizes →</button>':l.id==='sound'?'<button class="btn-secondary lab-deep-link" data-open-sound="1">Experiment with sound →</button>':['camera','lighting'].includes(l.id)?'<button class="btn-secondary lab-deep-link" data-open-light="1">Experiment with lighting →</button>':l.id==='editing'?'<button class="btn-secondary lab-deep-link" data-open-cut="1">Edit the three-shot scene →</button>':['story','script','making'].includes(l.id)?'<button class="btn-secondary lab-deep-link" data-open-story="1">Plan your own three-shot scene →</button>':''}${extraLabLink(l)}</aside>${notesWidget(l)}<section class="quiz"><span class="eyebrow-secondary">A QUICK CHECK-IN</span><h3>${l.q}</h3><div class="quiz-options">${l.opts.map((o,i)=>`<button class="quiz-option ${answered&&state.quiz===i?(i===l.answer?'right':'wrong'):''} ${answered&&i===l.answer?'right':''}" data-answer="${i}" ${answered?'disabled':''}>${String.fromCharCode(65+i)}. ${o}</button>`).join('')}</div><div class="quiz-feedback ${answered&&state.quiz!==l.answer?'error':''}" role="status">${answered?(state.quiz===l.answer?'✓ Exactly. ': 'Not quite. ')+l.feedback:''}</div><div class="lesson-actions">${answered&&state.quiz!==l.answer?'<button class="btn-secondary" data-retry>Try again</button>':''}<button class="cta" data-complete ${!answered||state.quiz!==l.answer?'disabled':''}>${finished.has(l.id)?'✓ Lesson complete':'Mark lesson complete'} →</button></div></section><nav class="lesson-pagination" aria-label="Lesson navigation"><button class="btn-secondary" data-lesson="${(lessons[lessons.indexOf(l)-1]||lessons[0]).id}" ${lessons.indexOf(l)===0?'disabled':''}>← Previous lesson</button><button class="btn-secondary" data-lesson="${(nextLesson(l.id)||l).id}" ${!nextLesson(l.id)?'disabled':''}>Next lesson →</button></nav></article></div>`}
    const frameOpts={wide:{label:'Wide shot',sub:'See more of the surroundings',description:'The person looks smaller and we see more of the place around them. Depending on the story, this might suggest loneliness, freedom or the size of the location.',scale:.55},medium:{label:'Medium shot',sub:'Notice gestures and some surroundings',description:'The person takes up more of the picture. We can notice gestures while still seeing some of the space around them. Medium shots are common in conversations.',scale:1},close:{label:'Close-up',sub:'Notice the face and small reactions',description:'The face takes up more of the picture, so small expressions become easier to notice. A close-up can feel warm, funny or tense depending on the scene.',scale:1.8}};
    const soundOpts={silence:{label:'No music',sub:'Only the optional background ambience',description:'No musical notes play here. With ambience enabled, you can still hear soft generated background sound. A real film without music may still contain dialogue, footsteps and other sounds.'},warm:{label:'Gentle tones',sub:'Soft, higher musical notes',description:'These simple notes might make the imagined wait feel calm or hopeful. This is just a sound sketch, not a full piece of music.'},tension:{label:'Uneasy tones',sub:'Low notes that shift slightly',description:'These low notes might make the imagined wait feel uncertain or tense. The picture we are imagining has not changed.'}};
    function scene(){
      const zoom=Math.max(1,Math.min(3,Number(state.frameZoom)||1));const w=640/zoom,h=360/zoom;const views={custom:`${(320-w/2).toFixed(2)} ${(180-h/2).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`};
      const cfg=frameOpts[state.frame];
      return `<div class="scene-stage scene-stage-art cinematic-monitor ${state.frameGuide?'with-guides':'without-guides'}" role="img" aria-label="Original storyboard image showing the same person at a bus stop as a ${cfg.label.toLowerCase()}">
        <svg viewBox="${views.custom}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs><linearGradient id="fSky" x2="0" y2="1"><stop stop-color="#1c344a"/><stop offset=".75" stop-color="#82656a"/><stop offset="1" stop-color="#c18b68"/></linearGradient><radialGradient id="fSun"><stop stop-color="#ffd9a2" stop-opacity=".8"/><stop offset="1" stop-color="#ec9e75" stop-opacity="0"/></radialGradient><linearGradient id="fCoat"><stop stop-color="#504750"/><stop offset="1" stop-color="#1d273a"/></linearGradient></defs>
          <rect width="640" height="360" fill="url(#fSky)"/><circle cx="483" cy="90" r="126" fill="url(#fSun)"/><circle cx="490" cy="93" r="31" fill="#ffd3a0" opacity=".77"/>
          <path d="M0 249 Q66 222 130 241 T260 229 T420 237 T640 230 V360 H0" fill="#41444b" opacity=".85"/><rect y="295" width="640" height="65" fill="#303745"/>
          <path d="M0 300 H640" stroke="#e1b18b" stroke-opacity=".5" stroke-width="3"/><path d="M0 333 H640" stroke="#0b1622" stroke-opacity=".5" stroke-width="2"/>
          <rect x="79" y="98" width="9" height="203" rx="3" fill="#1a2732"/><rect x="77" y="96" width="152" height="12" rx="4" fill="#27313b"/><rect x="97" y="111" width="113" height="34" rx="3" fill="#d9bda3"/><text x="153" y="133" text-anchor="middle" fill="#39414b" font-family="system-ui" font-size="18" font-weight="700">BUS STOP</text>
          <path d="M88 174 H227 M88 188 H227" stroke="#c2a59b" stroke-width="3" opacity=".65"/><path d="M114 240 H207" stroke="#e1c3aa" opacity=".6" stroke-width="4"/><path d="M118 244 V294 M206 244 V294" stroke="#29313a" stroke-width="6"/>
          <g class="breathing-figure"><ellipse cx="326" cy="320" rx="52" ry="10" fill="#0c1b27" opacity=".5"/>
          <path d="M302 264 L301 318 L315 318 L329 267 L342 318 L356 318 L347 254" fill="#202834" stroke="#161f2a" stroke-width="4" stroke-linejoin="round"/>
          <path d="M292 224 Q286 212 299 206 L314 204 L338 204 Q356 205 360 228 L353 281 Q333 290 293 281 Z" fill="url(#fCoat)"/><path d="M295 226 L280 260 L290 268 L311 239 M350 226 L365 251 L358 263 L340 239" fill="#3c3747" stroke="#2c2d38" stroke-width="4" stroke-linejoin="round"/>
          <path d="M318 195 L319 212 Q323 220 332 212 L332 195" fill="#ab7058"/>
          <ellipse cx="325" cy="170" rx="31" ry="37" fill="#d49b78"/>
          <path d="M293 169 Q288 134 319 131 Q350 125 356 166 L347 163 Q346 150 335 148 Q324 159 294 160 Z" fill="#262532"/>
          <path d="M304 170 Q310 166 316 170 M332 170 Q338 167 343 171" stroke="#433039" stroke-width="2" stroke-linecap="round"/><path d="M324 175 L322 187 L327 188" stroke="#9e664f" stroke-width="2" fill="none"/><path d="M316 196 Q324 198 332 195" stroke="#784a45" stroke-width="1.8" fill="none"/>
          <path d="M299 215 Q325 232 353 214" stroke="#71626c" stroke-width="2" fill="none" opacity=".65"/></g>
        </svg><div class="art-vignette"></div><div class="film-haze" aria-hidden="true"></div><div class="scene-grain" aria-hidden="true"></div><div class="camera-guides" aria-hidden="true"><span></span><span></span><span></span><span></span></div><div class="monitor-hud" aria-hidden="true"><span class="hud-record">● STORYBOARD</span><span>16:9 · FRAME STUDY</span></div><div class="frame-corner">ORIGINAL ILLUSTRATION</div><div class="scene-label">${cfg.label.toUpperCase()} · CROP DEMO</div></div>`;
    }
    function frameCompare(){const prior=state.frame,oldZoom=state.frameZoom;const left=scene();state.frame='close';state.frameZoom=3;const right=scene();state.frame=prior;state.frameZoom=oldZoom;return `<div class="frame-comparison"><div><span class="compare-tag">YOUR CROP · ${Math.round(state.frameZoom*100)/100}×</span>${left}</div><div><span class="compare-tag">REFERENCE · TIGHT CROP</span>${right}</div></div>`}
    function soundScene(){
      const savedZoom=state.frameZoom,savedFrame=state.frame;state.frameZoom=1;state.frame='wide';
      const image=scene();state.frameZoom=savedZoom;state.frame=savedFrame;
      return `<div class="sound-cinema ${state.soundPlaying?'is-playing':''}" data-sound-stage><div class="audio-picture">${image}<div class="audio-picture-label"><span class="on-air-dot"></span> ONE SCENE · THREE SOUND CHOICES</div><div class="sound-ripple" aria-hidden="true"><span></span><span></span><span></span></div></div><div class="sound-wave" aria-hidden="true">${Array.from({length:31},(_,i)=>`<span style="--i:${i};--h:${12+Math.round(40*Math.abs(Math.sin(i*.89)+Math.cos(i*.36))/2)}px"></span>`).join('')}</div><div class="sound-progress" aria-hidden="true"><span></span></div></div>`;
    }
    const lightOpts={
      front:{label:'Front light',sub:'Light comes from near the camera side',description:'Light from the front can make more of the face visible. It may reduce strong side-to-side shadows, but the result also depends on the light’s size and strength.',question:'Need to show a small facial reaction clearly? Front lighting is one option to try.'},
      side:{label:'Side light',sub:'Light comes from one side',description:'Light from the side makes one side of the face brighter than the other in this example. The difference between light and shadow can help us notice shape.',question:'Want one side of the face brighter than the other? Side lighting can help you explore that.'},
      back:{label:'Back light',sub:'Light comes from behind the person',description:'Light from behind can outline the edges of a person. If little light reaches the front, facial details may be harder to see. Adding front light would change that.',question:'Want the subject to stand apart from a darker background? Back lighting can help create an edge of light.'}
    };
    function lightScene(){
      const pos={front:[320,58],side:[82,100],back:[322,100]}[state.light];
      const face=state.light==='back'?'#302e39':state.light==='side'?'url(#faceSide)':'url(#faceFront)';
      const rim=state.light==='back'?'#ffe4ac':'#8f6153';
      const back=state.light==='back';
      const side=state.light==='side';const power=Math.max(20,Math.min(100,state.lightPower));const edge=Math.max(0,Math.min(100,state.lightSoft));const shadowOpacity=(.11+.55*(1-edge/100)*power/100).toFixed(2);const blur=(1+edge*.10).toFixed(1);
      const lampMark=`<circle cx="${pos[0]}" cy="${pos[1]}" r="${back?13:12}" fill="#ffdb9e" stroke="#fff1ca" stroke-width="3"/><circle cx="${pos[0]}" cy="${pos[1]}" r="33" fill="none" stroke="#ffddb0" stroke-opacity=".42" stroke-width="2"/><path d="M${pos[0]-24} ${pos[1]-24} L${pos[0]-37} ${pos[1]-37} M${pos[0]+24} ${pos[1]-24} L${pos[0]+37} ${pos[1]-37} M${pos[0]-24} ${pos[1]+24} L${pos[0]-37} ${pos[1]+37} M${pos[0]+24} ${pos[1]+24} L${pos[0]+37} ${pos[1]+37}" stroke="#ffdfb1" stroke-opacity=".7" stroke-width="2"/>`;
      return `<div class="lighting-stage cinematic-monitor" role="img" aria-label="Original illustration of a person with ${lightOpts[state.light].label.toLowerCase()}. The image is a simplified lighting study, not physical light simulation.">
        <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#182a38"/><stop offset="1" stop-color="#101620"/></linearGradient>
            <linearGradient id="faceFront" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#eab38b"/><stop offset="1" stop-color="#b8745f"/></linearGradient>
            <linearGradient id="faceSide" x1="0" x2="1"><stop stop-color="#efb98c"/><stop offset=".43" stop-color="#dc9975"/><stop offset=".55" stop-color="#76505a"/><stop offset="1" stop-color="#282733"/></linearGradient>
            <radialGradient id="lampGlow"><stop stop-color="#ffe2b0" stop-opacity=".85"/><stop offset="1" stop-color="#e7a377" stop-opacity="0"/></radialGradient>
            <radialGradient id="backGlow"><stop stop-color="#ffce8d" stop-opacity=".7"/><stop offset="1" stop-color="#ffbe84" stop-opacity="0"/></radialGradient><filter id="shadeBlur"><feGaussianBlur stdDeviation="${blur}"/></filter>
          </defs>
          <rect width="640" height="360" fill="url(#wall)"/><path d="M0 305 H640" stroke="#69737b" stroke-opacity=".24" stroke-width="3"/><path d="M80 55 V310 M560 55 V310" stroke="#667480" stroke-width="2" opacity=".18"/>
          ${back?'<ellipse cx="320" cy="195" rx="162" ry="170" fill="url(#backGlow)"/>':`<path d="M${pos[0]} ${pos[1]} L225 210 L407 215 Z" fill="#f5d5a5" opacity="${side?'.08':'.045'}"/>`}
          ${back?'<circle cx="320" cy="93" r="54" fill="url(#lampGlow)" opacity=".8"/>':''}
          ${back?lampMark:''}
          <path d="M241 360 Q244 267 286 244 Q303 236 337 238 Q390 243 409 360" fill="#2b3c48" stroke="${rim}" stroke-opacity="${back?'.65':'.18'}" stroke-width="${back?7:3}"/>
          <path d="M302 232 L305 255 Q322 271 337 254 L340 230" fill="${back?'#292e37':'#aa7460'}"/>
          <ellipse cx="320" cy="183" rx="69" ry="80" fill="${face}" stroke="${rim}" stroke-width="${back?6:2}" stroke-opacity="${back?'.9':'.2'}"/>
          <path d="M251 182 Q239 107 292 96 Q366 78 391 135 Q397 153 389 190 L378 156 Q349 126 313 128 Q295 156 257 155 Z" fill="#1c2531" stroke="${back?'#e8bf94':'#20212b'}" stroke-opacity="${back?'.7':'1'}" stroke-width="${back?4:1}"/>
          <path d="M281 179 Q296 173 308 181 M336 181 Q351 174 364 182" stroke="${back?'#34303b':'#533a3d'}" stroke-width="3" stroke-linecap="round" fill="none" opacity="${back?'.36':'.95'}"/>
          <path d="M322 183 L315 207 L329 209" fill="none" stroke="${back?'#40313a':'#9f6855'}" stroke-width="3" opacity="${back?'.3':'1'}"/>
          <path d="M301 224 Q320 230 340 224" fill="none" stroke="${back?'#40313a':'#734747'}" stroke-width="2.5" opacity="${back?'.28':'1'}"/>
          ${side?`<path d="M320 128 Q371 143 385 179 Q383 237 343 261 L320 260 Z" fill="#111a2b" opacity="${shadowOpacity}" filter="url(#shadeBlur)"/>`:''}
          ${back?'':lampMark}

          <rect width="640" height="360" fill="#070a15" opacity="${((100-power)/100*.54).toFixed(2)}" pointer-events="none"/><text x="30" y="332" fill="#fff2d7" font-size="12" font-family="system-ui">${state.light.toUpperCase()} LIGHT · ILLUSTRATED</text>
        </svg><div class="lighting-badge">${back?'LIGHT BEHIND':side?'LIGHT TO THE LEFT':'LIGHT NEAR THE CAMERA SIDE'}</div></div>`;
    }
    function lightLab(){const selected=lightOpts[state.light];return `<div class="page"><div class="page-intro cinematic-heading"><div class="eyebrow">DIRECTOR'S STUDIO / EXPERIMENT 04</div><h1>Shape the light.</h1><p>Move a simplified key light and change its strength and shadow edge. The expression stays the same.</p></div>${labTabs()}<div class="lab-shell cinematic-lab-shell"><div class="lab-preview"><div id="lightVisual">${lightScene()}</div><div class="lab-hint">Original vector illustration · The sliders illustrate principles, not real-world light physics. Shadow softness is clearest with side light.</div></div><div class="lab-panel film-controls"><div class="eyebrow">LIGHTING DESK · 04</div><h3>Direct the viewer's eye.</h3><p>Select the light direction, then experiment with its level and the hardness of a drawn shadow edge.</p><div class="lab-choices">${Object.entries(lightOpts).map(([id,o])=>`<button class="lab-choice" data-light="${id}" aria-pressed="${state.light===id}"><strong>${o.label}</strong><span>${o.sub}</span></button>`).join('')}</div><div class="studio-slider"><label for="lightPower">Illustrated brightness <output id="lightPowerValue">${state.lightPower}%</output></label><input id="lightPower" type="range" min="20" max="100" step="5" value="${state.lightPower}" aria-label="Illustrated light brightness"><div class="slider-ends"><span>Dimmer</span><span>Brighter</span></div></div><div class="studio-slider"><label for="lightSoft">Shadow edge (side light) <output id="lightSoftValue">${state.lightSoft}% soft</output></label><input id="lightSoft" type="range" min="0" max="100" step="5" value="${state.lightSoft}" aria-label="Illustrated shadow edge softness"><div class="slider-ends"><span>Sharper</span><span>Softer</span></div></div><div class="result-box" role="status"><strong>NOTICE THIS</strong><p>${selected.description}</p></div><div class="light-question"><strong>DIRECTOR'S QUESTION</strong><p>${selected.question}</p></div></div></div><div class="light-practice"><strong>TRY IT IN THE REAL WORLD</strong><p>Photograph a still object with a safely positioned household lamp in front, beside and behind it. Keep the camera and object in place. Note how shadows and visible details change. Avoid overheating lights and never look directly at bright bulbs.</p><button class="btn-secondary" data-lesson="lighting">Read the lighting lesson →</button></div></div>`;}

    function storyboardArt(shot){const box={wide:'0 0 640 360',medium:'225 75 240 180',close:'253 113 140 95'}[shot]||'0 0 640 360';return `<svg viewBox="${box}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Original illustration of a person at a bus stop, ${shot} storyboard crop" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sceneSkyV07" x2="0" y2="1"><stop stop-color="#1a384c"/><stop offset="1" stop-color="#e4a075"/></linearGradient></defs><rect width="640" height="360" fill="url(#sceneSkyV07)"/><circle cx="497" cy="92" r="41" fill="#ffdaae" opacity=".8"/><path d="M0 250Q120 210 280 255T640 243V360H0" fill="#59636b"/><rect y="296" width="640" height="64" fill="#303a46"/><path d="M82 291V99H228M79 99H239" fill="none" stroke="#223544" stroke-width="9"/><rect x="100" y="116" width="118" height="35" rx="4" fill="#edd3b6"/><text x="159" y="140" font-family="sans-serif" text-anchor="middle" font-size="17" fill="#3b3b44">BUS STOP</text><rect x="129" y="248" width="102" height="7" rx="3" fill="#ecb58a"/><path d="M144 255v35m76-35v35" stroke="#2b3743" stroke-width="6"/><ellipse cx="318" cy="319" rx="47" ry="8" fill="#1b2834" opacity=".5"/><path d="M302 272L299 319h18l13-43 12 43h17l-10-53" fill="#222b38"/><path d="M297 207L348 207Q365 232 353 279L294 279Q285 245 297 207Z" fill="#393d4d"/><path d="M296 216l-17 44m73-43 13 42" stroke="#4d4452" stroke-width="15" stroke-linecap="round"/><rect x="318" y="191" width="13" height="23" fill="#b7775b"/><ellipse cx="324" cy="168" rx="31" ry="36" fill="#d49b78"/><path d="M293 169Q287 130 319 129Q351 125 355 166Q348 159 344 147Q325 160 293 159Z" fill="#222938"/><path d="M304 171h11m19 0h9" stroke="#493540" stroke-width="2.4" stroke-linecap="round"/><path d="M320 193q7 3 12 0" fill="none" stroke="#8a5148" stroke-width="2"/><rect x="510" y="130" width="74" height="74" rx="5" fill="#cdbfb0" stroke="#3d4c55" stroke-width="4"/><circle cx="547" cy="168" r="27" fill="#e9dcc7" stroke="#45515b" stroke-width="3"/><path d="M547 149v19l15 11" stroke="#45515b" stroke-width="3" fill="none" stroke-linecap="round"/><rect width="640" height="360" fill="#0a111c" opacity=".07"/></svg>`}
    function storyLab(){const step=state.storyStep,scene=sceneQuestions[state.story.question],shot=state.story.shots[step];return `<div class="page"><div class="page-intro cinematic-heading"><div class="eyebrow">DIRECTOR'S STUDIO / YOUR FIRST CREATION</div><h1>Plan a tiny scene.</h1><p>Pick a story question, plan three shots and describe the action. Make something you could try filming on a phone.</p></div>${labTabs()}<div class="story-lead"><section class="story-workspace"><span class="eyebrow">FIRST FILM PROJECT · BUS STOP</span><h2>What is the story about?</h2><div class="scene-prompt-grid">${Object.entries(sceneQuestions).map(([id,v])=>`<button data-story-question="${id}" aria-pressed="${id===state.story.question}">${v.label}</button>`).join('')}</div><p>${scene.question}</p><div class="story-film-frame">${storyboardArt(shot)}<span class="story-frame-hud">STORYBOARD · SHOT 0${step+1} · ${shot.toUpperCase()}</span></div><div class="story-caption"><span>Sketch for framing only, not footage</span><span>0${step+1} / 03</span></div><div class="story-panel-steps" aria-label="Choose a story beat">${scenePhases.map((s,i)=>`<button data-story-step="${i}" aria-current="${step===i?'step':'false'}"><span>SHOT 0${i+1}</span><strong>${s.name}</strong><small>${escapeHtml(state.story.notes[i]||'Add your action idea')}</small></button>`).join('')}</div></section><section class="story-inspector"><span class="eyebrow">PLAN SHOT 0${step+1}</span><h3>${scenePhases[step].name}</h3><p>${scenePhases[step].prompt}</p><label>Choose the framing</label><div class="story-shot-buttons">${[['wide','Wide'],['medium','Medium'],['close','Close-up']].map(([id,v])=>`<button data-story-shot="${id}" aria-pressed="${id===shot}">${v}</button>`).join('')}</div><label for="storyNote">What happens in this shot?</label><textarea id="storyNote" maxlength="240" placeholder="Write a simple action you could film...">${escapeHtml(state.story.notes[step])}</textarea><p class="story-help">${scene.hints[step]} Your drawing shows only framing; the written action is a plan for what you might film.</p><div class="story-actions"><button class="cta" data-story-save>Save scene</button><button class="btn-secondary" data-story-export>Export shot list</button></div><span class="story-confirm" id="storyStatus" role="status"></span><div class="story-actions"><button class="btn-secondary" data-story-prev ${step===0?'disabled':''}>← Previous</button><button class="btn-secondary" data-story-next ${step===2?'disabled':''}>Next shot →</button></div></section></div><div class="story-footnote"><strong>Beginner filmmaking tip:</strong> A storyboard is a visual plan, not a rulebook. You can later change the number of shots, the camera position or the order. These drawings reuse the same original scene to compare framing; they do not simulate lens physics or moving footage.</div><div class="studio-next"><span>CONNECT THIS TO LEARNING</span><button class="btn-secondary" data-lesson="making">Read: your first film →</button><button class="btn-secondary" data-lab="cut">Try arranging filmed moments →</button></div></div>`}
    function crewMap(){const step=crewPhases[state.crewPhase]||crewPhases.idea;return `<section class="crew-map"><span class="eyebrow">EXPLORE HOW A TEAM WORKS</span><h2>One film. Many helping hands.</h2><p>Select a stage of production. See some of the roles that often contribute. Every film organizes work differently.</p><div class="crew-phases" role="group" aria-label="Select stage of film production">${Object.entries(crewPhases).map(([id,p],i)=>`<button data-crew-phase="${id}" aria-pressed="${state.crewPhase===id}">${i+1} · ${p.name}</button>`).join('')}</div><div class="crew-map-stage"><h3>${step.name}</h3><p>${step.description}</p><div class="crew-map-roles">${step.roles.map(id=>{const c=crafts.find(x=>x.id===id);return `<button data-craft="${id}">${c.symbol} ${c.title} ↗</button>`}).join('')}</div><small>These are examples of commonly involved roles, not an exhaustive list or fixed order. Other crew members contribute too.</small></div></section>`}

    function colourLab(){
      const modes={neutral:{label:'Neutral illustration',swatch:'#a8a7ad',desc:'This is the original drawing without a coloured overlay. Watch the colours and the bright background.'},warm:{label:'Warm overlay',swatch:'#d98d4c',desc:'A warm orange overlay changes the colour balance of this original illustration. That could help suggest a warm environment, but it does not automatically make the scene happy.'},cool:{label:'Cool overlay',swatch:'#4386bb',desc:'A blue overlay changes the colours you notice. Some viewers may read it differently, but blue is not a universal signal for sadness.'}};
      const c=modes[state.colourMode],opacity=Math.round(state.colourStrength)/100;
      return `<div class="page"><div class="page-intro"><div class="eyebrow">CREATIVE LAB · 06 · COLOUR STUDY</div><h1>One picture. Three colour looks.</h1><p>Change the coloured overlay on an original drawing. Notice how it can change attention and atmosphere without changing the story.</p></div>${labTabs()}<div class="colour-shell"><div class="colour-compare"><div><span class="eyebrow">ORIGINAL PICTURE</span>${scene()}</div><div><span class="eyebrow">YOUR VERSION · ${c.label.toUpperCase()}</span><div class="colour-picture">${scene()}<div class="colour-grade" aria-hidden="true" style="background:${c.swatch};opacity:${state.colourMode==='neutral'?0:opacity*.42}"></div></div></div></div><div class="colour-panel"><h3>Choose a colour look</h3><div class="colour-choices">${Object.entries(modes).map(([id,x])=>`<button class="lab-choice" data-colour="${id}" aria-pressed="${id===state.colourMode}"><span class="colour-dot" style="background:${x.swatch}"></span><strong>${x.label}</strong></button>`).join('')}</div><label for="colourStrength">Overlay strength <output id="colourStrengthValue">${state.colourStrength}%</output></label><input id="colourStrength" type="range" min="0" max="100" step="5" value="${state.colourStrength}" aria-label="Illustration colour overlay strength"/><div class="result-box"><strong>WHAT CHANGED?</strong><p>${c.desc}</p></div><p class="studio-fact">Teaching illustration only: a coloured overlay is not colour grading, a camera colour transform, or a colour-accurate reference. Screen settings and perception also affect what people see.</p><button class="btn-secondary" data-lesson="colour">Read the colour lesson →</button></div></div></div>`;
    }
    function continuityLab(){
      const changed=state.continuityMode==='changed';
      const desk=(label,mismatch)=>`<div class="continuity-shot"><span class="eyebrow">${label}</span><div class="continuity-desk" role="img" aria-label="Top-view illustrated desk with a letter in the middle and a cup on the ${mismatch?'right':'left'}"><div class="continuity-letter"><span></span><span></span><span></span></div><div class="continuity-cup ${mismatch?'moved':''}"><span></span></div><div class="continuity-pencil"></div></div></div>`;
      return `<div class="page"><div class="page-intro"><div class="eyebrow">CREATIVE LAB · 07 · CONTINUITY</div><h1>Something moved between shots.</h1><p>Compare two simplified views of the same fictional desk. Imagine no one touches the objects between the two shots.</p></div>${labTabs()}<div class="continuity-shell"><div class="continuity-grid">${desk('SHOT A · BEFORE THE CUT',false)}${desk('SHOT B · AFTER THE CUT',changed)}</div><div class="continuity-controls"><h3>Test the prop positions</h3><div class="lab-choices"><button class="lab-choice" data-continuity="match" aria-pressed="${!changed}"><strong>Keep cup on the left</strong><span>Same position in both images</span></button><button class="lab-choice" data-continuity="changed" aria-pressed="${changed}"><strong>Move cup to the right</strong><span>The object shifts without a shown reason</span></button></div><div class="result-box"><strong>WHAT DO YOU NOTICE?</strong><p>${changed?'The cup suddenly changes sides even though we did not see it move. If the story means to show continuous time, this may be a continuity mismatch.':'The cup stays in the same place in these two illustrations. That makes the location easier to follow. Real continuity also involves movement, sound, direction and time.'}</p></div><p class="studio-fact">This teaching example holds the viewpoint fixed. Different camera angles can change left/right positions in the image even when a real prop has not moved. A deliberate jump may also be a storytelling choice.</p><button class="btn-secondary" data-lesson="continuity">Read the continuity lesson →</button></div></div></div>`;
    }
    function labTabs(){return `<div class="lab-tabs" role="group" aria-label="Choose a creative experiment"><button class="lab-tab" data-lab="frame" aria-pressed="${state.lab==='frame'}">▣ Frame</button><button class="lab-tab" data-lab="sound" aria-pressed="${state.lab==='sound'}">♫ Sound</button><button class="lab-tab" data-lab="cut" aria-pressed="${state.lab==='cut'}">✂ Cut</button><button class="lab-tab" data-lab="light" aria-pressed="${state.lab==='light'}">☼ Light</button><button class="lab-tab" data-lab="story" aria-pressed="${state.lab==='story'}">✎ Make</button><button class="lab-tab" data-lab="colour" aria-pressed="${state.lab==='colour'}">◐ Colour</button><button class="lab-tab" data-lab="continuity" aria-pressed="${state.lab==='continuity'}">↔ Match</button></div>`;}
    function lab(){if(state.lab==='colour')return colourLab();if(state.lab==='continuity')return continuityLab();if(state.lab==='story')return storyLab();if(state.lab==='cut')return cutLab();if(state.lab==='light')return lightLab();const isFrame=state.lab==='frame';const opts=isFrame?frameOpts:soundOpts;const selected=isFrame?state.frame:state.sound;return `<div class="page"><div class="page-intro cinematic-heading"><div class="eyebrow">DIRECTOR'S STUDIO / ${isFrame?'EXPERIMENT 01':'EXPERIMENT 02'}</div><h1>${isFrame?'One moment. Many frames.':'Hear the invisible.'}</h1><p>${isFrame?'Explore one original drawing with different crops. Watch what becomes prominent and what disappears.':'The image is unchanged. Play different original sounds and notice how you interpret the same moment.'}</p></div>${labTabs()}<div class="lab-shell cinematic-lab-shell"><div class="lab-preview cinematic-preview">${isFrame?(state.compare?frameCompare():scene()):soundScene()}<div class="lab-hint">${isFrame?'Animated original storyboard · On-screen cropping, not lens simulation':'Original illustrated scene · Generated audio plays only when you press Play'}</div></div><div class="lab-panel film-controls"><div class="eyebrow">${isFrame?'FRAMING DESK · 01':'SOUND DESK · 02'}</div><h3>${isFrame?'How close should we look?':'How does it sound? '}</h3><p>${isFrame?'The person waits at a bus stop. Choose a preset or gradually crop tighter. Which part of the scene grabs your attention?':'Listen at a comfortable volume. Sound can suggest emotion, but viewers may respond differently.'}</p><div class="lab-choices">${Object.entries(opts).map(([id,o])=>`<button class="lab-choice" data-${isFrame?'frame':'sound'}="${id}" aria-pressed="${selected===id}"><strong>${o.label}</strong><span>${o.sub}</span></button>`).join('')}</div>${isFrame?`<div class="studio-slider"><label for="frameZoom">Interactive crop <output id="frameZoomValue">${state.frameZoom.toFixed(1)}×</output></label><input id="frameZoom" type="range" min="1" max="3" step="0.05" value="${state.frameZoom}" aria-label="Crop the existing illustration tighter"><div class="slider-ends"><span>See more surroundings</span><span>See less surroundings</span></div></div><div class="lab-tool-row"><button class="btn-secondary" data-guides aria-pressed="${state.frameGuide}">${state.frameGuide?'✓ Framing guides':'Show framing guides'}</button><button class="btn-secondary" data-compare aria-pressed="${state.compare}">${state.compare?'Hide comparison':'Compare crops'}</button></div>`:`<div class="sound-toggle"><label for="ambience"><input type="checkbox" id="ambience" ${state.ambience?'checked':''}><span><strong>Add quiet ambience</strong><small>Generated soft background noise, not a recorded location</small></span></label></div><div class="sound-action-row"><button class="cta" data-audio="${state.soundPlaying?'stop':'play'}">${state.soundPlaying?'■ Stop playback':'▶ Play the same moment'}</button><span class="sound-status" aria-live="polite">${state.soundPlaying?'Audio playing · approximately five seconds':'Press Play to compare'}</span></div>`}<div class="result-box"><strong>ONE POSSIBLE INTERPRETATION</strong><p>${opts[selected].description}</p></div><p class="studio-fact">${isFrame?'This changes the crop of an existing picture. A camera move or a different lens could produce different perspective and background effects.':'“No music” does not necessarily mean silence. Dialogue and environmental sounds can still be present. These are illustrative synthesized sounds, not real film scores.'}</p></div></div><div class="studio-next"><span>KEEP EXPLORING</span><button class="btn-secondary" data-lab="${isFrame?'sound':'cut'}">${isFrame?'02 · Try changing the sound':'03 · Build an edit'} →</button><button class="btn-secondary" data-lesson="${isFrame?'shot':'sound'}">Read the connected lesson →</button></div></div>`}

    const cutShots={
      place:{title:'Wide shot · The place',why:'We see the waiting person and the bus stop together.',label:'SHOW THE SETTING',prompt:'Where is this happening?',css:'place'},
      detail:{title:'Close-up · The clock',why:'We notice the clock. Its time reading might make us wonder how long the person has waited.',label:'SHOW A DETAIL',prompt:'What might the person be waiting for?',css:'detail'},
      person:{title:'Closer shot · The person',why:'The person becomes more prominent. In a filmed performance, a closer view could also help us notice expressions.',label:'SHOW THE PERSON',prompt:'What might you want to see in a real performance?',css:'person'}
    };
    function cutSequence(){return state.cutOrder}
    function cutIllustration(which){
      return `<div class="cut-illustration ${which}" role="img" aria-label="Simple original drawing for ${cutShots[which].title}"><div class="cut-sun"></div><div class="cut-stop"><span>BUS</span></div><div class="cut-platform"></div><div class="cut-person"><div class="cut-head"></div><div class="cut-body"></div></div><div class="cut-watch"><div class="cut-hand"></div></div><div class="cut-frame-label">${cutShots[which].label}</div></div>`;
    }
    function cutLab(){
      const order=cutSequence(),key=order[state.cutStep],shot=cutShots[key];
      const descriptions={place:'Beginning with the place can establish where the action happens.',detail:'Beginning with the clock can raise a question about time.',person:'Beginning with the person can make us wonder about their situation.'};
      return `<div class="page"><div class="page-intro"><div class="eyebrow">THE CREATIVE LAB · EDITOR'S DESK</div><h1>You're editing the scene.</h1><p>Three illustrated shots, one simple moment. Rearrange the timeline and set each shot’s duration. Then play your version.</p></div>${labTabs()}<div class="cut-shell"><div class="cut-preview"><div class="cinema-window"><div class="cinema-window-head"><span class="on-air-dot"></span> SCENE 01 · YOUR CUT <span>${state.cutDuration.reduce((a,b)=>a+b,0)}s TOTAL</span></div>${cutIllustration(key)}</div><div class="cut-controls"><button class="btn-secondary" data-cut-prev ${state.cutStep===0?'disabled':''}>← Previous</button><span aria-live="polite">Shot ${state.cutStep+1} of 3 ${state.cutPlaying?' · Playing...':''}</span><button class="btn-secondary" data-cut-next ${state.cutStep===2?'disabled':''}>Next →</button></div><div class="editor-timeline" aria-label="Editable storyboard timeline">${order.map((id,i)=>`<div class="timeline-clip ${state.cutPlaying&&i===state.cutStep?'clip-playing':''}" style="--weight:${state.cutDuration[i]};--clip-time:${state.cutDuration[i]}s" aria-current="${i===state.cutStep?'true':'false'}"><button class="clip-select" data-cut-step="${i}"><span>SHOT 0${i+1} · ${state.cutDuration[i]}s</span><strong>${cutShots[id].title.split(' · ')[1]}</strong></button><span class="clip-playhead" aria-hidden="true"></span><div class="clip-actions"><button data-move="${i}:left" ${i===0?'disabled':''} aria-label="Move shot ${i+1} earlier">←</button><button data-move="${i}:right" ${i===2?'disabled':''} aria-label="Move shot ${i+1} later">→</button></div></div>`).join('')}</div><div class="editor-control-bar"><button class="cta" data-cut-play="${state.cutPlaying?'stop':'play'}">${state.cutPlaying?'■ Stop preview':'▶ Play this edit'}</button><button class="btn-secondary" data-cut-reset>↺ Reset edit</button><span>No video footage · Timed storyboard preview</span></div></div><div class="cut-explain"><span class="eyebrow">YOUR EDITING DECISIONS</span><h3>${shot.title}</h3><p>${shot.why}</p><div class="result-box"><strong>WHAT THE FIRST SHOT MAY DO</strong><p>${descriptions[order[0]]}</p></div><div class="duration-control"><label for="shotDuration">Hold selected shot: <strong>${state.cutDuration[state.cutStep]} seconds</strong></label><input type="range" min="1" max="5" step="1" value="${state.cutDuration[state.cutStep]}" id="shotDuration" aria-label="Selected shot duration"><div class="duration-ruler"><span>1s · Quick glimpse</span><span>5s · Longer look</span></div></div><div class="editor-help"><strong>Try this:</strong> Move the clock to the first position. Then increase its duration. Compare the two versions. How much time does the viewer have to notice it?</div></div></div><div class="cut-learning"><strong>What you just explored</strong><p>A cut changes between shots. Shot <b>order</b> changes when viewers receive information. Shot <b>duration</b> changes how long they can look. Neither guarantees a particular emotion.</p><button class="btn-secondary" data-lesson="editing">Read: Why do filmmakers cut? →</button></div><p class="demo-disclaimer">Original storyboard drawings; this is a teaching model of shot order and timing, not a fully featured video editor.</p></div>`;
    }
    function craftsPage(){let c=crafts.find(x=>x.id===state.craft);return `<div class="page"><div class="page-intro"><div class="eyebrow">THE PEOPLE BEHIND THE MAGIC</div><h1>Meet the film roles.</h1><p>Many films are made by teams working together. Choose a role to learn what that person or team does.</p></div><div class="info-banner"><strong>About the “24 crafts”:</strong> In the Telugu film industry, “24 crafts” commonly refers to 24 categories of film workers. It is not one worldwide list of exactly 24 film jobs. These nine cards are an introduction, not the full federation list.</div>${crewMap()}${c?`<div class="craft-detail" id="craftDetail"><button class="back-btn" data-craft="">← All roles</button><h3>${c.symbol} ${c.title}</h3><p>${c.detail}</p><div class="craft-connection"><strong>How it connects:</strong> ${c.link}</div></div>`:''}<div class="crafts-grid">${crafts.map(c=>`<button class="craft-card" data-craft="${c.id}"><span class="craft-icon">${c.symbol}</span><h3>${c.title}</h3><p>${c.desc}</p></button>`).join('')}</div></div>`}
    function navigate(page,sub=null,fromHistory=false){stopAudio();stopCut();state.activity=null;if(page==='lesson'){state.page='lesson';state.lesson=sub;state.quiz=null;state.quizAnswered=false;state.miniStep=0}else{state.page=page;state.lesson=null}if(page!=='crafts')state.craft=null;render();window.scrollTo({top:0,behavior:'instant'});try{(fromHistory?history.replaceState:history.pushState).call(history,null,'','#'+(page==='lesson'?'lesson/'+sub:page))}catch{}}
    function render(){const root=document.getElementById('content');const focused=document.activeElement;const focusData=focused?.dataset?Object.entries(focused.dataset).find(([k])=>['lab','frame','light','sound','cutStep','cutOpening'].includes(k)):null;root.innerHTML=state.page==='lab'&&['continuity','colour','frame','light','cut','story','sound'].includes(state.lab)?'':state.page==='home'?home():state.page==='learn'?'':state.page==='lesson'?'':state.page==='lab'?lab():craftsPage();document.querySelectorAll('[data-page]').forEach(el=>{if(el.closest('.sidebar')||el.closest('.mobile-nav')){if(el.dataset.page===state.page||(state.page==='lesson'&&el.dataset.page==='learn'))el.setAttribute('aria-current','page');else el.removeAttribute('aria-current')}});updateProgress();window.dispatchEvent(new CustomEvent('frameone:route',{detail:{page:state.page,lesson:state.lesson,lab:state.page==='lab'?state.lab:undefined}}));if(focusData){const [k,v]=focusData;for(const b of root.querySelectorAll('button')){if(b.dataset[k]===v){b.focus({preventScroll:true});break}}}}
    function nextLesson(id){const i=lessons.findIndex(l=>l.id===id);return lessons[i+1]||null}
    function answerQuiz(n){if(state.page!=='lesson'||state.quizAnswered)return;state.quiz=n;state.quizAnswered=true;render();document.querySelector('.quiz')?.scrollIntoView({block:'nearest'})}
    function markComplete(){const l=lessons.find(x=>x.id===state.lesson);if(!l||!state.quizAnswered||state.quiz!==l.answer)return;finished.add(l.id);persist();updateProgress();const next=nextLesson(l.id);if(next)navigate('lesson',next.id);else navigate('learn')}
    function stopCut(){if(state.cutTimer!==null){clearTimeout(state.cutTimer);state.cutTimer=null}state.cutPlaying=false}
    function setCutStep(step){stopCut();state.cutStep=Math.max(0,Math.min(2,step));render()}
    function playCut(){stopCut();state.cutPlaying=true;state.cutStep=0;render();function showNext(){if(!state.cutPlaying)return;const current=state.cutStep;state.cutTimer=setTimeout(()=>{if(!state.cutPlaying)return;if(current>=2){stopCut();render();return}state.cutStep=current+1;render();showNext()},state.cutDuration[current]*1000)}showNext()}
    function moveCut(which,direction){stopCut();const to=which+(direction==='left'?-1:1);if(to<0||to>=3)return;[state.cutOrder[which],state.cutOrder[to]]=[state.cutOrder[to],state.cutOrder[which]];[state.cutDuration[which],state.cutDuration[to]]=[state.cutDuration[to],state.cutDuration[which]];state.cutStep=to;render()}
    function stopAudio(){if(state.soundTimer!==null){clearTimeout(state.soundTimer);state.soundTimer=null}state.soundPlaying=false;if(state.audio){try{state.audio.stop()}catch{}state.audio=null}}
    function playAudio(){
      stopAudio();const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx){return}
      let ctx;try{ctx=new AudioCtx()}catch{return}
      const sources=[];const start=ctx.currentTime+.08,seconds=5;
      const master=ctx.createGain();master.gain.value=.75;master.connect(ctx.destination);
      if(state.ambience){const buffer=ctx.createBuffer(1,Math.round(ctx.sampleRate*2),ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.3;const noise=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),ambGain=ctx.createGain();noise.buffer=buffer;noise.loop=true;filter.type='lowpass';filter.frequency.value=420;ambGain.gain.value=.11;noise.connect(filter);filter.connect(ambGain);ambGain.connect(master);noise.start(start);noise.stop(start+seconds);sources.push(noise)}
      if(state.sound!=='silence'){
        const warm=state.sound==='warm',freqs=warm?[261.63,329.63,392,440,392,329.63]:[110,116.54,110,103.83,116.54,103.83,110];
        for(let i=0;i<freqs.length;i++){
          const t=start+.13+i*(warm?.62:.53),o=ctx.createOscillator(),gain=ctx.createGain();o.type=warm?'sine':'triangle';o.frequency.setValueAtTime(freqs[i],t);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(warm?.12:.075,t+.08);gain.gain.exponentialRampToValueAtTime(.0001,Math.min(start+seconds,t+.55));o.connect(gain);gain.connect(master);o.start(t);o.stop(Math.min(start+seconds,t+.56));sources.push(o)
        }
      }
      state.audio={stop:()=>{sources.forEach(source=>{try{source.stop()}catch{}});ctx.close().catch(()=>{})}};
      state.soundPlaying=true;render();ctx.resume().catch(()=>{});
      state.soundTimer=setTimeout(()=>{stopAudio();if(state.page==='lab'&&state.lab==='sound')render()},seconds*1000);
    }

    // v0.8 portable backup. Every imported field is validated; user-created notes are escaped when rendered.
    function makeBackup(){return {format:'frameone-learning-backup',version:1,exportedAt:new Date().toISOString(),completed:[...finished],notes:{...state.notes},scene:state.story}}
    function restoreBackup(payload){
      if(!payload||payload.format!=='frameone-learning-backup'||payload.version!==1)throw new Error('Not a Frame One backup.');
      if(!Array.isArray(payload.completed)||payload.completed.length>500||!payload.notes||typeof payload.notes!=='object'||Array.isArray(payload.notes))throw new Error('Backup fields are incomplete.');
      const allowed=new Set(lessons.map(l=>l.id));
      const restoredIds=payload.completed.filter(id=>typeof id==='string'&&allowed.has(id));
      const incomingNotes={};for(const [key,val] of Object.entries(payload.notes)){if(allowed.has(key)&&typeof val==='string')incomingNotes[key]=val.slice(0,240)}
      const savedScene=payload.scene;if(!savedScene||typeof savedScene!=='object'||!Object.hasOwn(sceneQuestions,savedScene.question)||!Array.isArray(savedScene.shots)||!Array.isArray(savedScene.notes))throw new Error('Scene in backup is invalid.');
      const safeScene={question:savedScene.question,shots:[0,1,2].map(i=>['wide','medium','close'].includes(savedScene.shots[i])?savedScene.shots[i]:'wide'),notes:[0,1,2].map(i=>typeof savedScene.notes[i]==='string'?savedScene.notes[i].slice(0,240):'')};
      // Validate everything BEFORE replacing any in-memory or persisted values.
      // localStorage lacks transactions: snapshot existing values, and try to
      // roll them back if quota/private-mode errors interrupt a multi-key save.
      // Do not mutate live UI state until all three writes have succeeded.
      const nextProgress=[...new Set(restoredIds)];
      const restoreKeys=[STORAGE_KEY,NOTES_KEY,STORY_KEY];
      const previous=restoreKeys.map(key=>localStorage.getItem(key));
      try {
        localStorage.setItem(STORAGE_KEY,JSON.stringify(nextProgress));
        localStorage.setItem(NOTES_KEY,JSON.stringify(incomingNotes));
        localStorage.setItem(STORY_KEY,JSON.stringify(safeScene));
      } catch {
        for(let i=0;i<restoreKeys.length;i++){
          try {
            if(previous[i]===null)localStorage.removeItem(restoreKeys[i]);
            else localStorage.setItem(restoreKeys[i],previous[i]);
          } catch {} // Storage may remain unavailable; never claim a guaranteed rollback.
        }
        throw new Error('The backup could not be saved. Check device storage and retry; existing data was restored where possible.');
      }
      finished.clear();nextProgress.forEach(x=>finished.add(x));state.notes=incomingNotes;state.story=safeScene;state.storyStep=0;
    }
    function downloadBackup(){
      const blob=new Blob([JSON.stringify(makeBackup(),null,2)],{type:'application/json;charset=utf-8'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='frame-one-learning-backup.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    document.addEventListener('click',e=>{const target=e.target.closest('button, a');if(!target)return;if(target.id==='brand'){e.preventDefault();navigate('home')}else if('lesson'in target.dataset)navigate('lesson',target.dataset.lesson);else if('page'in target.dataset)navigate(target.dataset.page);else if('storyQuestion'in target.dataset){state.story.question=target.dataset.storyQuestion;saveStory();render()}else if('storyStep'in target.dataset){state.storyStep=Math.min(2,Math.max(0,Number(target.dataset.storyStep)));render()}else if('storyShot'in target.dataset){state.story.shots[state.storyStep]=target.dataset.storyShot;saveStory();render()}else if('storyNext'in target.dataset){state.storyStep=Math.min(2,state.storyStep+1);render()}else if('storyPrev'in target.dataset){state.storyStep=Math.max(0,state.storyStep-1);render()}else if('storySave'in target.dataset){const note=document.getElementById('storyNote');if(note)state.story.notes[state.storyStep]=note.value.slice(0,240);const okay=saveStory();const status=document.getElementById('storyStatus');if(status)status.textContent=okay?'Saved in this browser.':'Unable to save; you can still export the plan.';const small=document.querySelector(`.story-panel-steps [data-story-step="${state.storyStep}"] small`);if(small)small.textContent=state.story.notes[state.storyStep]||'Add your action idea'}else if('storyExport'in target.dataset){const field=document.getElementById('storyNote');if(field)state.story.notes[state.storyStep]=field.value.slice(0,240);saveStory();const blob=new Blob([storyPlanText()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='frame-one-my-first-scene.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);const s=document.getElementById('storyStatus');if(s)s.textContent='Shot-list export prepared.'}else if('backupExport'in target.dataset){try{downloadBackup();const s=document.getElementById('backupStatus');if(s)s.textContent='Backup download prepared.'}catch{const s=document.getElementById('backupStatus');if(s)s.textContent='Backup download is unavailable in this browser.'}}else if('savePractice'in target.dataset){const f=document.getElementById('lessonPractice');if(f&&state.lesson){state.notes[state.lesson]=f.value.slice(0,240);const okay=saveNotes(),status=document.querySelector('.note-status');if(status)status.textContent=okay?'Saved on this device.':'Unable to save on this device.'}}else if('miniStep'in target.dataset){state.miniStep=Number(target.dataset.miniStep);render()}else if('crewPhase'in target.dataset){state.crewPhase=target.dataset.crewPhase;render()}else if('openColour'in target.dataset){state.lab='colour';navigate('lab')}else if('openContinuity'in target.dataset){state.lab='continuity';navigate('lab')}else if('openCrafts'in target.dataset){navigate('crafts')}else if('colour'in target.dataset){state.colourMode=target.dataset.colour;render()}else if('continuity'in target.dataset){state.continuityMode=target.dataset.continuity;render()}else if('openStory'in target.dataset){state.lab='story';state.storyStep=0;navigate('lab')}else if('filter'in target.dataset){state.filter=target.dataset.filter;render()}else if('answer'in target.dataset)answerQuiz(Number(target.dataset.answer));else if('activity'in target.dataset){state.activity={lesson:state.lesson,index:Number(target.dataset.activity)};render()}else if('compare'in target.dataset){state.compare=!state.compare;render()}else if('guides'in target.dataset){state.frameGuide=!state.frameGuide;render()}else if('cutPlay'in target.dataset){if(target.dataset.cutPlay==='play')playCut();else{stopCut();render()}}else if('cutReset'in target.dataset){stopCut();state.cutOrder=['place','detail','person'];state.cutDuration=[2,2,2];state.cutStep=0;render()}else if('move'in target.dataset){const [i,dir]=target.dataset.move.split(':');moveCut(Number(i),dir)}else if('retry'in target.dataset){state.quiz=null;state.quizAnswered=false;render()}else if('complete'in target.dataset)markComplete();else if('telugu'in target.dataset){state.telugu=!state.telugu;saveTelugu();render()}else if('openCut'in target.dataset){state.lab='cut';state.cutStep=0;navigate('lab')}else if('openFrame'in target.dataset){state.lab='frame';navigate('lab')}else if('openSound'in target.dataset){state.lab='sound';navigate('lab')}else if('openLight'in target.dataset){state.lab='light';navigate('lab')}else if('cutOpening'in target.dataset){stopCut();state.cutOrder=target.dataset.cutOpening==='place'?['place','detail','person']:['detail','person','place'];state.cutStep=0;render()}else if('cutStep'in target.dataset){setCutStep(Number(target.dataset.cutStep))}else if('cutNext'in target.dataset){setCutStep(state.cutStep+1)}else if('cutPrev'in target.dataset){setCutStep(state.cutStep-1)}else if('lab'in target.dataset){stopCut();state.lab=target.dataset.lab;stopAudio();render()}else if('frame'in target.dataset){state.frame=target.dataset.frame;state.frameZoom={wide:1,medium:2,close:3}[state.frame];render()}else if('light'in target.dataset){state.light=target.dataset.light;render()}else if('sound'in target.dataset){state.sound=target.dataset.sound;stopAudio();render()}else if('audio'in target.dataset){if(target.dataset.audio==='play')playAudio();else{stopAudio();render()}}else if('craft'in target.dataset){state.craft=target.dataset.craft||null;render();if(state.craft)document.getElementById('craftDetail')?.scrollIntoView({block:'nearest',behavior:'smooth'})}else if(target.id==='resetProgress'){if(confirm('Reset your completed lessons? This cannot be undone.')){finished.clear();persist();render()}}});
    document.addEventListener('input',e=>{if(e.target.closest?.('.react-colour-lab,.react-continuity-lab,.react-frame-lab,.react-lighting-lab,.react-cut-lab,.react-make-lab,.react-sound-lab'))return;if(e.target.id==='storyNote'){state.story.notes[state.storyStep]=e.target.value.slice(0,240);saveStory();return}if(e.target.id==='lessonPractice'){return}if(e.target.id==='colourStrength'){state.colourStrength=Math.max(0,Math.min(100,Number(e.target.value)||0));const grade=document.querySelector('.colour-grade');if(grade)grade.style.opacity=state.colourMode==='neutral'?0:state.colourStrength/100*.42;const out=document.getElementById('colourStrengthValue');if(out)out.textContent=state.colourStrength+'%';return}if(e.target.id==='frameZoom'){state.frameZoom=Math.max(1,Math.min(3,Number(e.target.value)||1));state.frame=state.frameZoom<1.5?'wide':state.frameZoom<2.5?'medium':'close';const label=document.getElementById('frameZoomValue');if(label)label.textContent=state.frameZoom.toFixed(1)+'×';document.querySelectorAll('.frame-comparison>div:first-child .scene-stage-art svg,.lab-preview>.scene-stage-art svg').forEach(svg=>{const z=state.frameZoom,w=640/z,h=360/z;svg.setAttribute('viewBox',`${(320-w/2).toFixed(2)} ${(180-h/2).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`)});document.querySelectorAll('.lab-choice[data-frame]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.frame===state.frame)));const note=document.querySelector('.film-controls .result-box p');if(note)note.textContent=frameOpts[state.frame].description;return}if(e.target.id==='lightPower'||e.target.id==='lightSoft'){const v=Number(e.target.value);if(e.target.id==='lightPower'){state.lightPower=v;document.getElementById('lightPowerValue').textContent=v+'%'}else{state.lightSoft=v;document.getElementById('lightSoftValue').textContent=v+'% soft'}const stage=document.getElementById('lightVisual');if(stage)stage.innerHTML=lightScene();return}if(e.target.id==='shotDuration'){const n=Math.max(1,Math.min(5,Number(e.target.value)||2));state.cutDuration[state.cutStep]=n;const label=document.querySelector('.duration-control label strong');if(label)label.textContent=n+' seconds';const total=document.querySelector('.cinema-window-head span:last-child');if(total)total.textContent=state.cutDuration.reduce((a,b)=>a+b,0)+'s TOTAL';return}if(e.target.id==='lessonSearch'){state.query=e.target.value;const matches=lessons.filter(l=>(state.filter==='All'||l.unit===state.filter)&&`${l.title} ${l.subtitle} ${l.unit}`.toLowerCase().includes(state.query.toLowerCase()));const list=document.getElementById('lessonList');if(list)list.innerHTML=matches.map(l=>`${lessonRow(l)}`).join('')||'<div class="empty">No matching lessons. Try another search.</div>'}});
    document.addEventListener('change',async e=>{if(e.target.id==='backupImport'){
      const status=document.getElementById('backupStatus');try{
        const file=e.target.files?.[0];if(!file)return;if(file.size>2_000_000)throw new Error('Backup is larger than 2 MB.');
        const json=JSON.parse(await file.text());restoreBackup(json);render();document.querySelector('.backup-panel')?.setAttribute?.('open','');const newStatus=document.getElementById('backupStatus');if(newStatus)newStatus.textContent='Backup restored. Your learning progress and scene are available here.';
      }catch(err){if(status)status.textContent='Could not restore: '+(err instanceof Error?err.message:'Invalid backup.')}finally{e.target.value=''};return
    }if(e.target.id==='shotDuration'){stopCut();render()}else if(e.target.id==='ambience'){state.ambience=e.target.checked;stopAudio();render()}});
    window.addEventListener('pagehide',()=>{stopAudio();stopCut()});
    // React shell manages offline registration; avoid duplicate registrations.
    function routeHash(){const hash=decodeURIComponent(location.hash.replace(/^#/,''));if(hash.startsWith('lesson/')&&lessons.some(l=>l.id===hash.split('/')[1]))navigate('lesson',hash.split('/')[1],true);else if(['home','learn','lab','crafts'].includes(hash))navigate(hash,null,true);else navigate('home',null,true)}
    // The React lesson reader uses this deliberately small, typed bridge.
    // Seven cinematic labs, chapter navigation and backup tools remain legacy-owned.
    window.frameOneLegacy={
      navigate:(page,lesson)=>navigate(page,lesson||null),
      openLab:(lab)=>{if(['frame','sound','light','cut','story','colour','continuity'].includes(lab)){state.lab=lab;navigate('lab')}},
      completeLesson:(id)=>{if(state.page!=='lesson'||state.lesson!==id)return;finished.add(id);persist();const next=nextLesson(id);navigate(next?'lesson':'learn',next?.id||null)},
      savePractice:(id,note)=>{if(!lessons.some(l=>l.id===id)||typeof note!=='string')return false;state.notes[id]=note.slice(0,240);return saveNotes()},
      setTelugu:(enabled)=>{state.telugu=Boolean(enabled);saveTelugu()},
      exportBackup:()=>downloadBackup(),
      importBackup:(payload)=>{restoreBackup(payload);window.dispatchEvent(new Event('frameone:story-restored'));render()},
      getStoryboard:()=>JSON.parse(JSON.stringify(state.story)),
      saveStoryboard:(plan)=>{
        if(!plan||typeof plan!=='object'||!Object.hasOwn(sceneQuestions,plan.question)||!Array.isArray(plan.shots)||!Array.isArray(plan.notes)||plan.shots.length!==3||plan.notes.length!==3)return false;
        state.story={question:plan.question,
          shots:[0,1,2].map(i=>['wide','medium','close'].includes(plan.shots[i])?plan.shots[i]:'wide'),
          notes:[0,1,2].map(i=>typeof plan.notes[i]==='string'?plan.notes[i].slice(0,240):'')};
        return saveStory();
      },
      exportShotList:()=>{
        const blob=new Blob([storyPlanText()],{type:'text/plain;charset=utf-8'});
        const url=URL.createObjectURL(blob),a=document.createElement('a');
        a.href=url;a.download='frame-one-my-first-scene.txt';
        document.body.appendChild(a);a.click();a.remove();
        setTimeout(()=>URL.revokeObjectURL(url),1000);
      },
      illustration:(shape)=>['place','person','detail'].includes(shape)?cutIllustration(shape):''
    };
    window.addEventListener('popstate',routeHash);routeHash();
  })();

export {};
