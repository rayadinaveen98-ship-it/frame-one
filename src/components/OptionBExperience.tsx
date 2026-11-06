import {useCallback,useEffect,useRef,useState} from 'react';
import {OptionBReactScreens} from './OptionBReactScreens';
import type {LabName} from '../legacy/bridge';
import './option-b-experience.css';

/**
 * Frame One 2.0 design acceptance gate.
 *
 * Deliberately embeds the EXACT reviewed standalone HTML inside the existing
 * React application rather than recreating its pictures in a low-fidelity
 * approximation. This is a supervised design pilot, not the new course engine.
 * The old React/legacy application stays mounted behind the overlay so its
 * boot-owned elements, navigation listeners, backups and lessons survive exit.
 */
export function OptionBExperience({onExit,onOpenProductionLab,resumeChapter}:{
  onExit:()=>void;
  onOpenProductionLab:(lab:LabName,chapterIndex:number)=>void;
  resumeChapter:number|null;
}){
  const exitRef=useRef<HTMLButtonElement>(null);
  const frameRef=useRef<HTMLIFrameElement>(null);
  const [loaded,setLoaded]=useState(false);
  const [failed,setFailed]=useState(false);
  const [presentation,setPresentation]=useState<'approved'|'react'>(resumeChapter===null?'approved':'react');
  const openApproved=useCallback((screen:string,missionId?:string)=>{
    // Same-origin frame owns the already-reviewed interactive mission engine.
    // The React port now owns Home, Journey and the four-step mission.
    // Creative Lab and Progress continue in the approved reference.
    type ReviewedWindow=Window&{go?:(id:string)=>void;startMission?:(id:string)=>void};
    const target=frameRef.current?.contentWindow as ReviewedWindow|undefined;
    try{
      if(loaded&&missionId)target?.startMission?.(missionId);
      else if(loaded)target?.go?.(screen);
    }catch{/* A restricted origin simply returns to the approved Home. */}
    setPresentation('approved');
  },[loaded]);
  const syncReferenceProgress=useCallback(()=>{
    // The original reference loads its saved demo state once at startup.
    // Reinitialize only after a real React mission completion so the
    // Reference tab shows the updated mission count and points.
    try{frameRef.current?.contentWindow?.location.reload();}
    catch{/* The native React demo remains usable if WebView navigation is restricted. */}
  },[]);

  useEffect(()=>{
    const hidden=[...document.querySelectorAll<HTMLElement>('.app > .sidebar,.app > .main,.app > .mobile-nav')];
    const before=hidden.map(element=>({element,inert:element.inert,ariaHidden:element.getAttribute('aria-hidden')}));
    for(const element of hidden){element.inert=true;element.setAttribute('aria-hidden','true');}
    document.body.classList.add('frameone-option-b-open');
    exitRef.current?.focus({preventScroll:true});
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();onExit();}};
    window.addEventListener('keydown',onKey);
    const onBack=()=>onExit();
    window.addEventListener('frameone:option-b-close',onBack);
    return ()=>{
      window.removeEventListener('keydown',onKey);
      window.removeEventListener('frameone:option-b-close',onBack);
      for(const {element,inert,ariaHidden} of before){
        element.inert=inert;
        if(ariaHidden===null)element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden',ariaHidden);
      }
      document.body.classList.remove('frameone-option-b-open');
    };
  },[onExit]);

  useEffect(()=>{
    // Keyboard focus lives in the embedded browser document when lessons are
    // being played. Give desktop testers Escape as a path to the real app.
    if(!loaded)return;
    const child=frameRef.current?.contentWindow;
    const onEscape=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();onExit();}};
    try{child?.addEventListener('keydown',onEscape);}
    catch { /* A privacy-restricted WebView still has the outer Exit control. */ }
    return ()=>{try{child?.removeEventListener('keydown',onEscape);}catch{/* no-op */}};
  },[loaded,onExit]);

  return <section className="frameone-option-b-overlay" data-frameone-option-b
    aria-label="Frame One 2.0 interactive design pilot">
    <header className="frameone-option-b-header">
      <button ref={exitRef} type="button" className="frameone-option-b-exit"
        data-option-b-exit onClick={onExit}>
        <span aria-hidden="true">←</span> Back to Frame One
      </button>

      <div className="option-b-view-switch" role="group" aria-label="Compare the React port against the approved prototype">
        <button type="button" data-option-b-compare="approved"
          aria-pressed={presentation==='approved'} onClick={()=>setPresentation('approved')}>Reference</button>
        <button type="button" data-option-b-compare="react" disabled={!loaded}
          aria-pressed={presentation==='react'} onClick={()=>setPresentation('react')}>React preview</button>
      </div>
      <span className="frameone-option-b-version">OPTION B · DESIGN PILOT</span>
    </header>
    {!loaded&&!failed?<p className="frameone-option-b-loading" role="status">Opening your filmmaking journey…</p>:null}
    {failed?<div className="frameone-option-b-error" role="alert">
      <p>The interactive design preview could not open. Your original lessons and saved data are unchanged.</p>
      <button type="button" onClick={onExit}>Return to Frame One</button>
    </div>:null}
    <iframe ref={frameRef} title="Frame One 2.0: Home, Journey, Lesson, Creative Lab and Progress"
      className="frameone-option-b-frame" data-option-b-frame src="./option-b-v1.html"
      style={{display:presentation==='approved'?'block':'none'}} aria-hidden={presentation!=='approved'} tabIndex={presentation==='approved'?0:-1}
      onLoad={()=>{setLoaded(true);setFailed(false);}}
      onError={()=>{setFailed(true);setLoaded(false);}}
      referrerPolicy="no-referrer"/>
    <div className="frameone-option-b-native-wrap" data-option-b-native-wrap
      style={{display:presentation==='react'?'block':'none'}} aria-hidden={presentation!=='react'}>
      <OptionBReactScreens active={presentation==='react'} onOpenReference={openApproved} onNativeComplete={syncReferenceProgress}
        onOpenProductionLab={onOpenProductionLab} resumeChapter={resumeChapter}/>
    </div>
    <p className="frameone-option-b-disclaimer">Design pilot only. Demo missions use separate local progress; existing 33 lessons, seven Labs and backups are unchanged.</p>
  </section>;
}
