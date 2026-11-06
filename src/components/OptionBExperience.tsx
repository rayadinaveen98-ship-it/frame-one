import {useEffect,useRef,useState} from 'react';
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
export function OptionBExperience({onExit}:{onExit:()=>void}){
  const exitRef=useRef<HTMLButtonElement>(null);
  const frameRef=useRef<HTMLIFrameElement>(null);
  const [loaded,setLoaded]=useState(false);
  const [failed,setFailed]=useState(false);

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
      <span className="frameone-option-b-version">OPTION B · DESIGN PILOT</span>
    </header>
    {!loaded&&!failed?<p className="frameone-option-b-loading" role="status">Opening your filmmaking journey…</p>:null}
    {failed?<div className="frameone-option-b-error" role="alert">
      <p>The interactive design preview could not open. Your original lessons and saved data are unchanged.</p>
      <button type="button" onClick={onExit}>Return to Frame One</button>
    </div>:null}
    <iframe ref={frameRef} title="Frame One 2.0: Home, Journey, Lesson, Creative Lab and Progress"
      className="frameone-option-b-frame" data-option-b-frame src="./option-b-v1.html"
      onLoad={()=>{setLoaded(true);setFailed(false);}}
      onError={()=>{setFailed(true);setLoaded(false);}}
      referrerPolicy="no-referrer"/>
    <p className="frameone-option-b-disclaimer">Design pilot only. Demo missions use separate local progress; existing 33 lessons, seven Labs and backups are unchanged.</p>
  </section>;
}
