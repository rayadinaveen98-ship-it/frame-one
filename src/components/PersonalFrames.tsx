import {useCallback,useEffect,useMemo,useRef,useState,type ChangeEvent,type KeyboardEvent,type TouchEvent} from 'react';
import {addFrame,deleteFrame,editFrame,listFrames,MAX_FRAMES,persistFrameOrder,prepareFrame,type Focus,type PersonalFrame} from '../state/personal-frames';
import './personal-frames.css';

type FramesProps={};
const transitions=['dissolve','push','drift','reveal'] as const;
function chooseTransition(previous:string){
  const options=transitions.filter(item=>item!==previous);
  return options[Math.floor(Math.random()*options.length)];
}
const focalPoints:{id:Focus;title:string}[]=[
  {id:'center',title:'Centre'},{id:'top',title:'Top'},{id:'bottom',title:'Bottom'},
  {id:'left',title:'Left'},{id:'right',title:'Right'}
];

/** A private, offline cinematic gallery. A selected photo is NEVER uploaded. */
export function PersonalFrames(_props:FramesProps){
  const [frames,setFrames]=useState<PersonalFrame[]>([]);
  const [ready,setReady]=useState(false);
  const [index,setIndex]=useState(0);
  const [previousId,setPreviousId]=useState<string|null>(null);
  const [effect,setEffect]=useState<string>('dissolve');
  const [sequence,setSequence]=useState(0);
  const [controlsVisible,setControlsVisible]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const [editing,setEditing]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const pickerRef=useRef<HTMLInputElement>(null);
  const touchStart=useRef<number|null>(null);
  const swiped=useRef(false);
  const media=useMemo(()=>frames.map(frame=>({id:frame.id,url:URL.createObjectURL(frame.image)})),[frames]);
  useEffect(()=>()=>{media.forEach(photo=>URL.revokeObjectURL(photo.url));},[media]);
  const urlFor=(id:string)=>media.find(photo=>photo.id===id)?.url;
  const current=frames[Math.min(index,Math.max(0,frames.length-1))];
  const earlier=frames.find(frame=>frame.id===previousId);

  useEffect(()=>{
    let live=true;
    listFrames().then(saved=>{if(live){setFrames(saved);setReady(true);}})
      .catch(err=>{if(live){setError(err instanceof Error?err.message:'Gallery storage unavailable.');setReady(true);}});
    return ()=>{live=false;};
  },[]);
  useEffect(()=>{
    const request=()=>pickerRef.current?.click();
    window.addEventListener('frameone:frames-add-request',request);
    return ()=>window.removeEventListener('frameone:frames-add-request',request);
  },[]);
  const next=useCallback((direction=1)=>{
    if(frames.length<2)return;
    const here=frames[Math.min(index,frames.length-1)];
    setPreviousId(here?.id??null);
    setIndex((index+direction+frames.length)%frames.length);
    setEffect(prev=>chooseTransition(prev));
    setSequence(value=>value+1);
  },[frames,index]);
  useEffect(()=>{
    if(frames.length<2||busy||menuOpen||controlsVisible||editing)return;
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
    const clock=window.setInterval(()=>{
      if(document.visibilityState!=='visible')return;
      next();
    },6900);
    return ()=>window.clearInterval(clock);
  },[frames.length,busy,menuOpen,controlsVisible,editing,next]);
  useEffect(()=>{
    if(!previousId)return;
    const clock=window.setTimeout(()=>setPreviousId(null),1350);
    return ()=>window.clearTimeout(clock);
  },[previousId,sequence]);
  useEffect(()=>{
    if(!controlsVisible||menuOpen||editing)return;
    const clock=window.setTimeout(()=>setControlsVisible(false),5200);
    return ()=>window.clearTimeout(clock);
  },[controlsVisible,menuOpen,editing,sequence]);

  async function addPhotos(event:ChangeEvent<HTMLInputElement>){
    const selected=Array.from(event.currentTarget.files??[]);
    event.currentTarget.value='';
    if(!selected.length)return;
    setBusy(true);setError('');setMenuOpen(false);
    try{
      const available=Math.max(0,MAX_FRAMES-frames.length);
      if(!available)throw new Error('Your gallery is full (24 frames). Remove a frame to add another.');
      if(selected.length>available)throw new Error('You can add only '+available+' more frame(s). Select fewer photos.');
      let order=frames.length;
      for(const file of selected){
        const optimized=await prepareFrame(file,order);
        await addFrame(optimized);
        order++;
      }
    }catch(err){
      setError(err instanceof Error?err.message:'Could not add the selected image.');
    }finally{
      try{
        const saved=await listFrames();
        setFrames(saved);setIndex(Math.max(0,saved.length-selected.length));setPreviousId(null);
      }catch(err){setError(err instanceof Error?err.message:'Could not reload your gallery.');}
      setBusy(false);
    }
  }
  async function removeCurrent(){
    if(!current||busy)return;
    setMenuOpen(false);setControlsVisible(false);
    if(!window.confirm('Remove this frame from Frame One? The original photo in your gallery stays untouched.'))return;
    setBusy(true);setError('');
    try{
      await deleteFrame(current.id);
      const saved=await listFrames();
      setFrames(saved);setIndex(value=>Math.min(value,Math.max(0,saved.length-1)));setPreviousId(null);
    }catch(err){setError(err instanceof Error?err.message:'Could not remove the frame.');}
    finally{setBusy(false);}
  }
  async function changeFocus(focus:Focus){
    if(!current||busy)return;
    const modified={...current,focus};
    setBusy(true);setError('');
    try{await editFrame(modified);setFrames(items=>items.map(item=>item.id===modified.id?modified:item));}
    catch(err){setError(err instanceof Error?err.message:'Could not edit this frame.');}
    finally{setBusy(false);}
  }
  async function moveFrame(delta:number){
    if(!current||busy||frames.length<2)return;
    const to=index+delta;
    if(to<0||to>=frames.length)return;
    const changed=[...frames];
    const item=changed.splice(index,1)[0];
    changed.splice(to,0,item);
    setBusy(true);setError('');
    try{await persistFrameOrder(changed);setFrames(changed.map((frame,i)=>({...frame,sortOrder:i})));setIndex(to);}
    catch(err){setError(err instanceof Error?err.message:'Could not reorder the photos.');}
    finally{setBusy(false);}
  }
  function activatePhoto(){
    if(swiped.current){swiped.current=false;return;}
    setControlsVisible(value=>!value);setMenuOpen(false);
  }
  function handleKeys(event:KeyboardEvent<HTMLButtonElement>){
    if(event.key==='ArrowRight'){event.preventDefault();next(1);}
    if(event.key==='ArrowLeft'){event.preventDefault();next(-1);}
  }
  function touchBegin(event:TouchEvent<HTMLButtonElement>){touchStart.current=event.changedTouches[0]?.clientX??null;swiped.current=false;}
  function touchFinish(event:TouchEvent<HTMLButtonElement>){
    const start=touchStart.current;
    touchStart.current=null;
    if(start===null)return;
    const amount=(event.changedTouches[0]?.clientX??start)-start;
    if(Math.abs(amount)>52){swiped.current=true;next(amount<0?1:-1);setControlsVisible(false);}
  }
  return <section className="personal-frames" aria-label="Your cinematic frames" data-gallery-ready={ready}>
    <input ref={pickerRef} type="file" className="sr-only" accept="image/*" multiple
      aria-label="Choose your favourite photos" onChange={event=>void addPhotos(event)}/>
    {!ready?<div className="frames-loading" aria-label="Loading your personal frames"/>:
      !frames.length?<button className="frames-empty" type="button" onClick={()=>pickerRef.current?.click()} disabled={busy}>
        <span className="frames-empty-symbol" aria-hidden="true">▣</span>
        <span>YOUR PERSONAL CINEMA WALL</span>
        <strong>Add the frames that inspire you.</strong>
        <small>Choose photos from your gallery. They'll stay private and available offline.</small>
        <span className="frames-empty-cta">+ Add frames</span>
      </button>:
      <div className="frames-stage" data-frame-count={frames.length}>
        {earlier&&urlFor(earlier.id)?<img className="frames-image frames-outgoing" alt="" aria-hidden="true"
          style={{objectPosition:earlier.focus}} src={urlFor(earlier.id)}/>:null}
        {current&&urlFor(current.id)?<img key={current.id+'-'+sequence}
          className={'frames-image frames-active frames-effect-'+effect}
          src={urlFor(current.id)} alt="" aria-hidden="true" style={{objectPosition:current.focus}}/>:null}
        <button className="frames-touch" type="button" aria-label="Reveal frame options; use arrow keys or swipe to change image"
          onClick={activatePhoto} onKeyDown={handleKeys} onTouchStart={touchBegin} onTouchEnd={touchFinish}/>
        {controlsVisible?<div className="frames-toolbar">
          <button type="button" className="frames-more" aria-label="Frame options" aria-expanded={menuOpen}
            onClick={()=>setMenuOpen(value=>!value)}>⋮</button>
          {menuOpen?<div className="frames-options">
            <button type="button" onClick={()=>{setControlsVisible(false);setMenuOpen(false);pickerRef.current?.click();}}>Add images</button>
            <button type="button" onClick={()=>{setEditing(true);setMenuOpen(false);}}>Edit image</button>
            <button type="button" onClick={()=>void removeCurrent()}>Remove image</button>
          </div>:null}
        </div>:null}
      </div>}
    {error?<p className="frames-error" role="alert">{error}</p>:null}
    {busy?<span className="sr-only" role="status">Updating your personal frames.</span>:null}
    {editing&&current?<div className="frames-editor-backdrop">
      <div className="frames-editor" role="dialog" aria-modal="true" aria-label="Edit selected frame">
        <div className="frames-editor-header">
          <h2>Edit this frame</h2>
          <button type="button" aria-label="Close photo editor" onClick={()=>{setEditing(false);setControlsVisible(false);}}>✕</button>
        </div>
        <div className="frames-editor-preview">
          <img alt="Preview of selected frame" src={urlFor(current.id)} style={{objectPosition:current.focus}}/>
        </div>
        <p>Choose which part stays in view. The original photo is not modified.</p>
        <div className="frames-focus-controls">
          {focalPoints.map(point=><button key={point.id} type="button" disabled={busy}
            aria-pressed={current.focus===point.id} onClick={()=>void changeFocus(point.id)}>{point.title}</button>)}
        </div>
        <div className="frames-reorder">
          <button type="button" disabled={busy||index===0} onClick={()=>void moveFrame(-1)}>← Move earlier</button>
          <button type="button" disabled={busy||index===frames.length-1} onClick={()=>void moveFrame(1)}>Move later →</button>
        </div>
        <button className="frames-done" type="button" disabled={busy}
          onClick={()=>{setEditing(false);setControlsVisible(false);}}>Done</button>
      </div>
    </div>:null}
  </section>;
}
