import {useEffect,useRef,useState} from 'react';
import {OptionBReactScreens} from './OptionBReactScreens';
import type {LabName} from '../legacy/bridge';
import './option-b-experience.css';

/**
 * The learner-facing Frame One 2.0 experience.
 * The original app, 33-lesson data store and native backup engine remain
 * mounted behind this shell. The old Option B demo iframe is NOT mounted.
 * Every page below uses real chapter progress and original production labs.
 */
export function FrameOneV2Production({onClassic,onOpenLab,resumeChapter}:{
  onClassic:()=>void;
  onOpenLab:(lab:LabName,chapterIndex:number)=>void;
  resumeChapter:number|null;
}){
  const classicRef=useRef<HTMLButtonElement>(null);
  const [ready,setReady]=useState(()=>Boolean(window.frameOneLegacy));
  useEffect(()=>{
    // Legacy initialization is dynamic and may complete AFTER the first route
    // event. Never show working lesson controls before its backup/progress
    // bridge can accept them.
    const verify=()=>{if(window.frameOneLegacy)setReady(true)};
    verify();
    const interval=window.setInterval(verify,120);
    return ()=>window.clearInterval(interval);
  },[]);
  useEffect(()=>{
    const hidden=[...document.querySelectorAll<HTMLElement>('.app > .sidebar,.app > .main,.app > .mobile-nav')];
    const before=hidden.map(element=>({
      element,inert:element.inert,ariaHidden:element.getAttribute('aria-hidden')
    }));
    hidden.forEach(element=>{element.inert=true;element.setAttribute('aria-hidden','true')});
    document.body.classList.add('frameone-option-b-open');
    classicRef.current?.focus({preventScroll:true});
    return ()=>{
      for(const {element,inert,ariaHidden} of before){
        element.inert=inert;
        if(ariaHidden===null)element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden',ariaHidden);
      }
      document.body.classList.remove('frameone-option-b-open');
    };
  },[]);
  return <section className="frameone-option-b-overlay frameone-v2-production"
    data-frameone-v2-production data-v2-default-experience
    aria-label="Frame One real filmmaking course">
    <header className="frameone-option-b-header frameone-v2-production-header">
      <button ref={classicRef} type="button" className="frameone-option-b-exit"
        data-v2-open-classic onClick={onClassic}>← Classic library</button>
      <span className="frameone-v2-production-status">✦ 33 REAL LESSONS · 7 LABS</span>
    </header>
    {!ready?<div role="status" className="frameone-option-b-loading" data-v2-production-loading>
      Preparing your saved filmmaking journey…
      <button type="button" onClick={onClassic}>Open Classic library</button>
    </div>:<div className="frameone-option-b-native-wrap frameone-v2-production-wrap"
      data-v2-production-native-wrap>
      <OptionBReactScreens production active onOpenReference={()=>{}}
        onNativeComplete={()=>{}} onOpenProductionLab={onOpenLab}
        resumeChapter={resumeChapter}/>
    </div>}
  </section>;
}
