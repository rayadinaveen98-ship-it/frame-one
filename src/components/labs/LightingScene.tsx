/** Original Frame One v0.8B Lighting illustration, moved without redrawing it.
 * All interpolation inputs come from three fixed presets and bounded numeric
 * values controlled by React. This artwork is NOT a physical lighting simulator.
 */
import { useMemo } from 'react';
export type LightingMode = 'front' | 'side' | 'back';
export type LightingOption = {label:string;sub:string;description:string;question:string};
export const lightingOptions:Record<LightingMode,LightingOption> = {
      front:{label:'Front light',sub:'Light comes from near the camera side',description:'Light from the front can make more of the face visible. It may reduce strong side-to-side shadows, but the result also depends on the light’s size and strength.',question:'Need to show a small facial reaction clearly? Front lighting is one option to try.'},
      side:{label:'Side light',sub:'Light comes from one side',description:'Light from the side makes one side of the face brighter than the other in this example. The difference between light and shadow can help us notice shape.',question:'Want one side of the face brighter than the other? Side lighting can help you explore that.'},
      back:{label:'Back light',sub:'Light comes from behind the person',description:'Light from behind can outline the edges of a person. If little light reaches the front, facial details may be harder to see. Adding front light would change that.',question:'Want the subject to stand apart from a darker background? Back lighting can help create an edge of light.'}
    };
function renderOriginalLightingMarkup(mode:LightingMode, brightness:number, softness:number){
      const pos={front:[320,58],side:[82,100],back:[322,100]}[mode];
      const face=mode==='back'?'#302e39':mode==='side'?'url(#faceSide)':'url(#faceFront)';
      const rim=mode==='back'?'#ffe4ac':'#8f6153';
      const back=mode==='back';
      const side=mode==='side';const power=Math.max(20,Math.min(100,brightness));const edge=Math.max(0,Math.min(100,softness));const shadowOpacity=(.11+.55*(1-edge/100)*power/100).toFixed(2);const blur=(1+edge*.10).toFixed(1);
      const lampMark=`<circle cx="${pos[0]}" cy="${pos[1]}" r="${back?13:12}" fill="#ffdb9e" stroke="#fff1ca" stroke-width="3"/><circle cx="${pos[0]}" cy="${pos[1]}" r="33" fill="none" stroke="#ffddb0" stroke-opacity=".42" stroke-width="2"/><path d="M${pos[0]-24} ${pos[1]-24} L${pos[0]-37} ${pos[1]-37} M${pos[0]+24} ${pos[1]-24} L${pos[0]+37} ${pos[1]-37} M${pos[0]-24} ${pos[1]+24} L${pos[0]-37} ${pos[1]+37} M${pos[0]+24} ${pos[1]+24} L${pos[0]+37} ${pos[1]+37}" stroke="#ffdfb1" stroke-opacity=".7" stroke-width="2"/>`;
      return `<div class="lighting-stage cinematic-monitor" role="img" aria-label="Original illustration of a person with ${lightingOptions[mode].label.toLowerCase()}. The image is a simplified lighting study, not physical light simulation.">
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

          <rect width="640" height="360" fill="#070a15" opacity="${((100-power)/100*.54).toFixed(2)}" pointer-events="none"/><text x="30" y="332" fill="#fff2d7" font-size="12" font-family="system-ui">${mode.toUpperCase()} LIGHT · ILLUSTRATED</text>
        </svg><div class="lighting-badge">${back?'LIGHT BEHIND':side?'LIGHT TO THE LEFT':'LIGHT NEAR THE CAMERA SIDE'}</div></div>`;
    }

export function LightingScene({mode,brightness,softness}:{mode:LightingMode;brightness:number;softness:number}){
  const html = useMemo(()=>{
    const boundedBrightness = Number.isFinite(brightness)?Math.max(20,Math.min(100,brightness)):90;
    const boundedSoftness = Number.isFinite(softness)?Math.max(0,Math.min(100,softness)):35;
    // Distinct SVG IDs prevent collisions with other illustrations elsewhere.
    return renderOriginalLightingMarkup(mode,boundedBrightness,boundedSoftness)
      .replace(/\b(wall|faceFront|faceSide|lampGlow|backGlow|shadeBlur)\b/g,
        (_text,id:string)=>`f1-light-${id}`);
  },[mode,brightness,softness]);
  return <div className="react-light-scene" dangerouslySetInnerHTML={{__html:html}} />;
}
