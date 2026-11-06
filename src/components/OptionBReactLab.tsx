import {useState} from 'react';
import {OptionBReactScene,cropFeedback} from './OptionBReactMission';

export type ToolKind='frame'|'light'|'sound';
export type LabChoiceState={
  tool:ToolKind;
  light:'warm'|'cool'|'contrast';
  sound:'quiet'|'traffic'|'birds';
  guides:boolean;
};
const TOOL_LABELS:Record<ToolKind,string>={frame:'Shot designer',light:'Light palette',sound:'Sound sketch'};
const TOOL_COPY:Record<ToolKind,string>={
  frame:'Change the crop and investigate what remains visible.',
  light:'Compare graphic looks as a starting point for lighting discussion.',
  sound:'Compare imagined sound environments; this is a visual exercise.'
};
const LAB_MODE_LABELS:Record<ToolKind,readonly string[]>={
  frame:['Wide','Medium','Close'],
  light:['Warm','Cool','Contrast'],
  sound:['Quiet','Traffic','Birds']
};

function ArrowIcon(){
  return <svg className="node-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-6-6 6 6-6 6"/>
  </svg>;
}

/**
 * The three ORIGINAL approved Option B studio controls, now true React UI:
 * Frame = image crop + thirds grid; Light = conceptual colour palette;
 * Sound = EXPLANATORY setting suggestions, no false audio playback.
 */
export function OptionBReactLab({zoom,onZoomChange,onSave}:{
  zoom:number;
  onZoomChange:(value:number)=>void;
  onSave:()=>void;
}){
  const [choice,setChoice]=useState<LabChoiceState>({
    tool:'frame',light:'warm',sound:'traffic',guides:false
  });
  const tool=choice.tool;
  const chosen=tool==='frame'?(zoom<1.23?0:zoom<1.62?1:2)
    :tool==='light'?(['warm','cool','contrast'].indexOf(choice.light))
      :['quiet','traffic','birds'].indexOf(choice.sound);
  const feedback=tool==='frame'?cropFeedback(zoom)
    :tool==='light'?'Colour treatment is a visual cue, not real relighting. Physical light direction needs filming or a real lighting model.'
      :choice.sound==='traffic'?'Distant traffic may suggest an offscreen road. Sound should serve story and setting.'
        :choice.sound==='birds'?'Birds may extend a world outside the frame. Context matters.'
          :'Room tone leaves space for small nearby sounds; the original image does not change.';
  const saveText=tool==='frame'?'Save this framing':tool==='light'?'Save this look':'Save this sound idea';
  const selectMode=(i:number)=>{
    if(tool==='frame')onZoomChange([1,1.35,1.85][i]);
    else if(tool==='light')setChoice(s=>({...s,light:(['warm','cool','contrast'] as const)[i]}));
    else setChoice(s=>({...s,sound:(['quiet','traffic','birds'] as const)[i]}));
  };
  return <div className="screen" data-v2-native-screen="lab">
    <div className="lab-head">
      <span className="eyebrow">THE CREATIVE PLAYGROUND</span>
      <h1>Director's Lab</h1>
      <p>Same original scene. Different decisions. Experiment with intention.</p>
    </div>
    <div className="tabbar" role="tablist" aria-label="Choose a filmmaking tool">
      {([['frame','Frame'],['light','Light'],['sound','Sound']] as const).map(([id,label])=>
        <button key={id} type="button" role="tab" aria-selected={tool===id}
          data-v2-native-lab={id} className={tool===id?'selected':''}
          onClick={()=>setChoice(s=>({...s,tool:id}))}>{label}</button>)}
    </div>
    <div className="lab-content">
      <OptionBReactScene lab mode={TOOL_LABELS[tool]}
        value={tool==='frame'?zoom:1.3}
        kind={tool==='light'?choice.light:'neutral'}
        guides={tool==='frame'&&choice.guides}/>
      <section className="control-panel">
        <span className="eyebrow">WORKING CONTROL · {tool.toUpperCase()}</span>
        <h2>{TOOL_LABELS[tool]}</h2>
        <p>{TOOL_COPY[tool]}</p>
        <div className="mode-pills" role="group" aria-label={'Select a '+tool+' mode'}>
          {LAB_MODE_LABELS[tool].map((name,i)=>
            <button key={name} type="button" className={chosen===i?'selected':''}
              data-v2-native-mode={i} aria-pressed={chosen===i}
              onClick={()=>selectMode(i)}>{name}</button>)}
        </div>
        {tool==='frame'?<>
          <div className="lab-line">
            <label htmlFor="nativeLabZoom">Crop strength</label>
            <b id="nativeLabZoomLabel">{zoom.toFixed(1)}×</b>
          </div>
          <input className="lab-range" data-v2-native-lab-zoom type="range"
            min="1" max="2.2" step=".1" id="nativeLabZoom" value={zoom}
            aria-label="Crop strength"
            onChange={e=>onZoomChange(Math.min(2.2,Math.max(1,Number(e.target.value)||1)))}/>
          <div className="lab-line">
            <span>Rule-of-thirds guides</span>
            <button type="button" data-v2-native-guides className={choice.guides?'active':''}
              aria-pressed={choice.guides}
              onClick={()=>setChoice(s=>({...s,guides:!s.guides}))}>{choice.guides?'On':'Off'}</button>
          </div>
        </>:null}
        <div className="lab-feedback" id="nativeLabInsight">
          <strong>DIRECTOR'S FEEDBACK</strong><div>{feedback}</div>
        </div>
      </section>
      <button type="button" className="btn btn-primary btn-wide save-lab"
        data-v2-native-save-shot onClick={onSave}>
        {saveText} <ArrowIcon/>
      </button>
      <div className="note-honest">
        Illustrated lab prototype. Saved experiments are local demo counts, not image files or recorded footage. The real Frame One labs remain unchanged.
      </div>
    </div>
  </div>;
}
