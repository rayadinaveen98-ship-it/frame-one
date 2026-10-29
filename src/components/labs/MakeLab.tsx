import { useEffect, useState, type MouseEvent } from 'react';
import type { LabName,StoryProjectsSnapshot } from '../../legacy/bridge';
import { StoryboardArt } from './StoryboardArt';
import {peekDirectorHandoff,clearDirectorHandoff,previewDirectorStoryboard} from '../../state/director-handoff';
import type {DirectorPlan} from '../../data/direct-the-moment';
import { safeStory, INITIAL_STORY, storyQuestions, storyPhases,
  type StoryPlan, type StoryQuestion, type StoryFraming } from './story-data';

const tabs:{id:LabName;label:string}[]=[
  {id:'frame',label:'▣ Frame'}, {id:'sound',label:'♫ Sound'},
  {id:'cut',label:'✂ Cut'}, {id:'light',label:'☼ Light'},
  {id:'story',label:'✎ Make'}, {id:'colour',label:'◐ Colour'},
  {id:'continuity',label:'↔ Match'}
];
function readSavedPlan():StoryPlan{
  // The original runtime remains the source of truth for v0.7 storage and
  // backup serialization, even though React owns this screen.
  return safeStory(window.frameOneLegacy?.getStoryboard() ?? INITIAL_STORY);
}
function readProjects():StoryProjectsSnapshot{
  return window.frameOneLegacy?.getStoryProjects()??{activeId:null,projects:[],error:'Storyboard engine not ready.'};
}
export function MakeLab(){
  const [plan,setPlan]=useState<StoryPlan>(readSavedPlan);
  const [step,setStep]=useState(0);
  const [status,setStatus]=useState('');
  const [library,setLibrary]=useState<StoryProjectsSnapshot>(readProjects);
  const [newName,setNewName]=useState('');
  const [renamingId,setRenamingId]=useState<string|null>(null);
  const [renameDraft,setRenameDraft]=useState('');
  const [deletingId,setDeletingId]=useState<string|null>(null);

  const [directorOffer,setDirectorOffer]=useState<DirectorPlan|null>(peekDirectorHandoff);
  const [savedAtOffer,setSavedAtOffer]=useState<StoryPlan|null>(()=>peekDirectorHandoff()?readSavedPlan():null);
  const directorPreview=directorOffer?previewDirectorStoryboard(directorOffer):null;
  const hasExistingWork=Boolean(savedAtOffer)&&JSON.stringify(savedAtOffer)!==JSON.stringify(INITIAL_STORY);

  const current=storyQuestions[plan.question];
  const framing=plan.shots[step];

  useEffect(()=>{
    const onRestore=()=>{clearDirectorHandoff();setDirectorOffer(null);setSavedAtOffer(null);setPlan(readSavedPlan());setLibrary(readProjects());setStep(0);setStatus('Restored storyboard and project library are ready.');};
    window.addEventListener('frameone:story-restored',onRestore);
    return ()=>{window.removeEventListener('frameone:story-restored',onRestore);clearDirectorHandoff();};
  },[]);

  function syncProjectView(message:string){
    setLibrary(readProjects());setPlan(readSavedPlan());setStep(0);setStatus(message);
    setRenamingId(null);setDeletingId(null);
  }
  function createProject(){
    const title=newName.trim();
    if(!title||title.length>60){setStatus('Enter a project title between 1 and 60 characters.');return;}
    const okay=window.frameOneLegacy?.createStoryProject(title)??false;
    if(okay){setNewName('');dismissDirectorOffer();syncProjectView('New project created. Your earlier storyboards remain saved.');}
    else setStatus('Unable to create the project. Check storage or the 20-project limit.');
  }
  function switchProject(id:string){
    if(id===library.activeId)return;
    const okay=window.frameOneLegacy?.switchStoryProject(id)??false;
    if(okay){dismissDirectorOffer();syncProjectView('Project opened. Edits now save to this storyboard.');}
    else setStatus('Project could not be opened; your existing storyboard was kept.');
  }
  function renameProject(id:string){
    if(!renameDraft.trim()||renameDraft.trim().length>60){setStatus('Enter a project title between 1 and 60 characters.');return;}
    if(window.frameOneLegacy?.renameStoryProject(id,renameDraft.trim())){
      syncProjectView('Project renamed.');
    }else setStatus('Project rename failed. Your original project name was kept.');
  }
  function removeProject(id:string){
    if(window.frameOneLegacy?.deleteStoryProject(id)){
      dismissDirectorOffer();syncProjectView('The selected project was deleted. Other projects are unchanged.');
    }else setStatus('Project could not be deleted. You must keep at least one storyboard.');
  }
  function saveDirectorAsNewProject(){
    if(!directorPreview)return;
    const name='The Wait · Director scene';
    if(window.frameOneLegacy?.createStoryProject(name,directorPreview)){
      clearDirectorHandoff();setDirectorOffer(null);setSavedAtOffer(null);
      syncProjectView('Directing choices saved as a new project. Your original storyboard is still available.');
    }else setStatus('Could not create a separate project. Nothing was replaced; check free space and project limit.');
  }
  function dismissDirectorOffer(){
    clearDirectorHandoff();setDirectorOffer(null);setSavedAtOffer(null);
    setStatus('Your existing storyboard was kept unchanged.');
  }
  function applyDirectorOffer(){
    if(!directorPreview||!savedAtOffer)return;
    // A backup restore or concurrent edit must never be silently overwritten.
    const latest=readSavedPlan();
    if(JSON.stringify(latest)!==JSON.stringify(savedAtOffer)){
      setSavedAtOffer(latest);
      setPlan(latest);
      setStatus('The existing storyboard changed. Review it before deciding to replace it.');
      return;
    }
    const didSave=window.frameOneLegacy?.saveStoryboard(directorPreview)??false;
    if(!didSave){setStatus('Could not save the imported storyboard. Your original board remains available; export your shot list before retrying.');return;}
    setPlan(directorPreview);setLibrary(readProjects());setStep(0);
    clearDirectorHandoff();setDirectorOffer(null);setSavedAtOffer(null);
    setStatus('Your directing choices were saved in the existing storyboard and are ready to edit or export.');
  }
  function exportExistingBeforeReplace(event:MouseEvent<HTMLButtonElement>){
    event.stopPropagation();
    try{window.frameOneLegacy?.exportShotList();setStatus('Current storyboard shot list prepared; confirm your download before replacing it.');}
    catch{setStatus('Could not export the existing storyboard. Use JSON backup first, or keep your current board.');}
  }
  function keep(event:MouseEvent<HTMLButtonElement>){event.stopPropagation();}
  function commit(next:StoryPlan,showStatus=false){
    const sanitized=safeStory(next);
    const okay=window.frameOneLegacy?.saveStoryboard(sanitized)??false;
    if(okay){setPlan(sanitized);setLibrary(readProjects());}
    else setPlan(readSavedPlan());
    if(showStatus)setStatus(okay?'Saved in this browser.':'Unable to save; you can still export the plan.');
    else if(!okay)setStatus('Browser storage unavailable. Export a shot list to keep your work.');
    else setStatus('');
    return okay;
  }
  function chooseQuestion(event:MouseEvent<HTMLButtonElement>,question:StoryQuestion){
    keep(event);commit({...plan,question});
  }
  function chooseShot(event:MouseEvent<HTMLButtonElement>,shot:StoryFraming){
    keep(event);
    const shots=[...plan.shots] as StoryPlan['shots'];shots[step]=shot;
    commit({...plan,shots});
  }
  function chooseStep(event:MouseEvent<HTMLButtonElement>,value:number){
    keep(event);setStep(Math.max(0,Math.min(2,value)));setStatus('');
  }
  function changeNote(text:string){
    const notes=[...plan.notes] as StoryPlan['notes'];
    notes[step]=text.slice(0,240);commit({...plan,notes});
  }
  function exportPlan(event:MouseEvent<HTMLButtonElement>){
    keep(event);
    commit(plan);
    try{
      if(!window.frameOneLegacy)throw new Error('Learning engine not ready');
      window.frameOneLegacy.exportShotList();
      setStatus('Shot-list export prepared.');
    }catch{setStatus('Export is unavailable here. Your text remains in the editor.');}
  }
  return <div className="page react-make-lab">
    <div className="page-intro cinematic-heading">
      <div className="eyebrow">DIRECTOR'S STUDIO / YOUR FIRST CREATION</div>
      <h1>Plan a tiny scene.</h1>
      <p>Pick a story question, plan three shots and describe the action. Make something you could try filming on a phone.</p>
    </div>
    <section className="make-project-library" data-story-project-library aria-labelledby="make-project-library-title">
      <div className="make-project-head">
        <div><span className="eyebrow">YOUR CREATIVE WORKSPACE</span>
          <h2 id="make-project-library-title">Your film projects.</h2>
          <p>Create up to 20 local three-shot storyboards. All are included in Frame One JSON backups.</p>
        </div>
        <span className="make-project-count">{library.projects.length} / 20</span>
      </div>
      {library.error?<p role="alert" className="make-project-error">{library.error} Do not clear app data.</p>:null}
      <div className="make-project-list" role="group" aria-label="Saved storyboard projects">
        {library.projects.map(project=><div className="make-project-row" key={project.id} data-story-project={project.id}
          data-story-project-active={project.id===library.activeId?'true':'false'}>
          <button type="button" className="make-project-open" data-project-switch={project.id}
            aria-current={project.id===library.activeId?'true':undefined}
            disabled={project.id===library.activeId||Boolean(library.error)}
            onClick={event=>{keep(event);switchProject(project.id);}}>
            <strong>{project.name}</strong><small>{project.id===library.activeId?'CURRENT PROJECT':'OPEN PROJECT'} · {project.scene.question.toUpperCase()}</small>
          </button>
          <div className="make-project-row-actions">
            <button type="button" data-project-rename={project.id}
              onClick={event=>{keep(event);setRenamingId(project.id);setRenameDraft(project.name);setDeletingId(null);}}>Rename</button>
            <button type="button" data-project-delete={project.id} disabled={library.projects.length===1}
              onClick={event=>{keep(event);setDeletingId(project.id);setRenamingId(null);}}>Delete</button>
          </div>
          {renamingId===project.id?<div className="make-project-inline">
            <label htmlFor={'rename-project-'+project.id}>Rename this project</label>
            <input id={'rename-project-'+project.id} maxLength={60} value={renameDraft}
              onChange={event=>setRenameDraft(event.currentTarget.value)} />
            <button type="button" data-project-rename-save={project.id}
              onClick={event=>{keep(event);renameProject(project.id);}}>Save name</button>
            <button type="button" onClick={()=>setRenamingId(null)}>Cancel</button>
          </div>:null}
          {deletingId===project.id?<div className="make-project-inline make-project-danger" role="group"
            aria-label={'Confirm deletion of '+project.name}>
            <p>Delete “{project.name}” from this device? This cannot be undone without a previously saved backup.</p>
            <button type="button" data-project-delete-confirm={project.id}
              onClick={event=>{keep(event);removeProject(project.id);}}>Delete this project permanently</button>
            <button type="button" data-project-delete-cancel={project.id}
              onClick={()=>setDeletingId(null)}>Keep project</button>
          </div>:null}
        </div>)}
      </div>
      <div className="make-project-create">
        <label htmlFor="new-project-name">New project name</label>
        <input id="new-project-name" value={newName} maxLength={60} placeholder="e.g. The empty chair"
          onChange={event=>setNewName(event.currentTarget.value)} />
        <button type="button" className="cta" data-project-create
          disabled={Boolean(library.error)||library.projects.length>=20}
          onClick={event=>{keep(event);createProject();}}>Create new storyboard</button>
      </div>
      <p className="make-project-storage-note">These projects stay on this device until you export a verified JSON backup. Older backups contain only one storyboard and restore as a single project.</p>
    </section>
    {directorPreview?<section className="make-director-handoff" data-director-handoff
      aria-labelledby="make-handoff-title">
      <span className="eyebrow">UNSAVED DIRECTOR'S SKETCH · REVIEW BEFORE SAVING</span>
      <h2 id="make-handoff-title">Bring this scene into your storyboard?</h2>
      <p>This is a preview only. Your existing storyboard has <strong>not</strong> been changed. Save this as a separate project to keep both ideas, or explicitly replace the active project.</p>
      <p className="make-handoff-detail">The original six-second scene has {directorOffer?.edit==='hold'?'one planned shot':'two planned shots'}. Remaining storyboard slots are clearly marked for ideas <em>after</em> those six seconds. Make Lab's bus-stop artwork illustrates framing only; the night-room setting, sound and light directions stay in the written shot notes.</p>
      <div className="make-handoff-preview" aria-label="Proposed storyboard shots">
        {directorPreview.notes.map((note,index)=><div key={index} data-director-proposed-shot={index}>
          <strong>{index===0?'FIRST SHOT':index===1?'SECOND BEAT':'FUTURE BEAT'} · {directorPreview.shots[index].toUpperCase()}</strong>
          <p>{note}</p>
        </div>)}
      </div>
      {hasExistingWork?<p className="make-handoff-warning" role="status">Your current storyboard is customised. You can save this director sketch as a separate project instead of replacing it.</p>:null}
      <div className="make-handoff-actions">
        <button type="button" data-director-keep className="btn-secondary"
          onClick={event=>{keep(event);dismissDirectorOffer();}}>Keep my existing storyboard</button>
        {hasExistingWork?<button type="button" className="btn-secondary" data-director-export-existing
          onClick={exportExistingBeforeReplace}>Export existing shot list</button>:null}
        <button type="button" data-director-save-new className="cta"
          onClick={event=>{keep(event);saveDirectorAsNewProject();}}>Save as new project</button>
        <button type="button" data-director-confirm className="cta"
          onClick={event=>{keep(event);applyDirectorOffer();}}>
          {hasExistingWork?'Replace existing storyboard — I understand':'Save this as my storyboard'}
        </button>
      </div>
    </section>:null}
    <div className="lab-tabs" role="group" aria-label="Choose a creative experiment">
      {tabs.map(tab=><button className="lab-tab" type="button" key={tab.id}
        data-lab={tab.id} aria-pressed={tab.id==='story'}>{tab.label}</button>)}
    </div>
    <div className="story-lead">
      <section className="story-workspace">
        <span className="eyebrow">FIRST FILM PROJECT · BUS STOP</span>
        <h2>What is the story about?</h2>
        <div className="scene-prompt-grid" role="group" aria-label="Select a story question">
          {(Object.entries(storyQuestions) as [StoryQuestion,typeof current][]).map(([id,choice])=>
            <button type="button" key={id} data-story-question={id}
              aria-pressed={plan.question===id} onClick={event=>chooseQuestion(event,id)}>
              {choice.label}
            </button>)}
        </div>
        <p>{current.question}</p>
        <div className="story-film-frame">
          <StoryboardArt shot={framing}/>
          <span className="story-frame-hud">STORYBOARD · SHOT 0{step+1} · {framing.toUpperCase()}</span>
        </div>
        <div className="story-caption"><span>Sketch for framing only, not footage</span><span>0{step+1} / 03</span></div>
        <div className="story-panel-steps" aria-label="Choose a story beat">
          {storyPhases.map((phase,index)=><button type="button" key={phase.name}
            data-story-step={index} aria-current={step===index?'step':undefined}
            onClick={event=>chooseStep(event,index)}>
            <span>SHOT 0{index+1}</span><strong>{phase.name}</strong>
            <small>{plan.notes[index]||'Add your action idea'}</small>
          </button>)}
        </div>
      </section>
      <section className="story-inspector">
        <span className="eyebrow">PLAN SHOT 0{step+1}</span>
        <h3>{storyPhases[step].name}</h3>
        <p>{storyPhases[step].prompt}</p>
        <div className="story-framing-choice">
          <p className="story-control-label">Choose the framing</p>
          <div className="story-shot-buttons" role="group" aria-label="Choose the current shot framing">
            {([['wide','Wide'],['medium','Medium'],['close','Close-up']] as const).map(([id,label])=>
              <button type="button" key={id} data-story-shot={id}
                aria-pressed={framing===id} onClick={event=>chooseShot(event,id)}>{label}</button>)}
          </div>
        </div>
        <label htmlFor="storyNote">What happens in this shot?</label>
        <textarea id="storyNote" maxLength={240} placeholder="Write a simple action you could film..."
          value={plan.notes[step]}
          onChange={event=>{event.stopPropagation();changeNote(event.currentTarget.value);}}
          onInput={event=>event.stopPropagation()}/>
        <p className="story-help">{current.hints[step]} Your drawing shows only framing; the written action is a plan for what you might film.</p>
        <div className="story-actions">
          <button className="cta" type="button" data-story-save onClick={event=>{keep(event);commit(plan,true);}}>Save scene</button>
          <button className="btn-secondary" type="button" data-story-export onClick={exportPlan}>Export shot list</button>
        </div>
        <span className="story-confirm" id="storyStatus" role="status" aria-live="polite">{status}</span>
        <div className="story-actions">
          <button className="btn-secondary" type="button" data-story-prev disabled={step===0}
            onClick={event=>chooseStep(event,step-1)}>← Previous</button>
          <button className="btn-secondary" type="button" data-story-next disabled={step===2}
            onClick={event=>chooseStep(event,step+1)}>Next shot →</button>
        </div>
      </section>
    </div>
    <div className="story-footnote"><strong>Beginner filmmaking tip:</strong> A storyboard is a visual plan, not a rulebook. You can later change the number of shots, the camera position or the order. These drawings reuse the same original scene to compare framing; they do not simulate lens physics or moving footage.</div>
    <div className="studio-next"><span>CONNECT THIS TO LEARNING</span>
      <button className="btn-secondary" type="button" data-lesson="making">Read: your first film →</button>
      <button className="btn-secondary" type="button" data-lab="cut">Try arranging filmed moments →</button>
    </div>
  </div>;
}
