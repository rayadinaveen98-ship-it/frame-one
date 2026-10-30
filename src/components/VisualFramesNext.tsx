/** Three original, fully offline 16:9 storyboard illustrations.
 * A/B switches genuinely change visible information, not merely a caption.
 */
type Take=0|1;
function FilmMarkers(){
 return <g fill="none" stroke="#eccaa5" strokeWidth="2" strokeOpacity=".72">
  <path d="M21 38V18H43M597 18H618V40M21 309V331H44M597 331H618V309"/>
 </g>;
}
function Room({warm=false}:{warm?:boolean}){
 return <g>
  <rect width="640" height="350" fill={warm?'#2e333f':'#263341'}/>
  <rect x="0" y="0" width="640" height="350" fill="#0b131a" fillOpacity=".19"/>
  <rect x="44" y="38" width="197" height="158" rx="3" fill="#475c69" stroke="#91a2a9" strokeWidth="6"/>
  <path d="M143 38V196M45 120H240" stroke="#bac4c0" strokeOpacity=".62" strokeWidth="5"/>
  <path d="M50 183L84 119L136 173L195 114L235 171V194H50Z" fill="#243f4a"/>
  <path d="M0 277H640" stroke="#bda48e" strokeOpacity=".45" strokeWidth="3"/>
  <path d="M0 297H640V350H0Z" fill="#1d252f"/>
  <rect x="311" y="212" width="248" height="19" rx="4" fill="#a28b7e"/>
  <path d="M338 232V299M529 232V299" stroke="#8d776b" strokeWidth="12"/>
 </g>;
}
/** The wide vs close comparison changes visible content, not lens physics. */
export function ShotSizeFrames({take}:{take:Take}){
 const close=take===1;
 return <svg viewBox="0 0 640 350" className="vl-illustration" data-vl-frame="shot"
   aria-hidden="true" focusable="false">
   {close?<g>
     <rect width="640" height="350" fill="#2a343c"/>
     <rect y="277" width="640" height="73" fill="#232c32"/>
     <rect x="55" y="245" width="532" height="28" fill="#9f8574"/>
     <path d="M-9 95C70 98 115 124 176 157L285 201" fill="none" stroke="#c9a48a" strokeWidth="65" strokeLinecap="round"/>
     <path d="M280 198L370 175" stroke="#dcb397" strokeWidth="27" strokeLinecap="round"/>
     <path d="M376 161L422 151L441 174L415 200L376 199" fill="#d4ae90"/>
     <path d="M439 157H535L522 252H446Z" fill="#cbac8d" stroke="#f5d5b9" strokeWidth="4"/>
     <ellipse cx="486" cy="158" rx="49" ry="12" fill="#7c5d51" stroke="#f1cdb1" strokeWidth="5"/>
     <path d="M532 172Q587 176 560 227Q550 240 523 238" fill="none" stroke="#c8a084" strokeWidth="16"/>
   </g>:<g>
     <Room/>
     <circle cx="286" cy="127" r="27" fill="#c5a087"/>
     <path d="M255 162Q286 150 320 162L340 286H244Z" fill="#4a565e"/>
     <path d="M308 197Q341 207 395 213" fill="none" stroke="#c9a58f" strokeWidth="18" strokeLinecap="round"/>
     <path d="M415 195H465L458 242H423Z" fill="#cdb095" stroke="#ead0bb" strokeWidth="2"/>
     <ellipse cx="440" cy="195" rx="25" ry="8" fill="#74594b"/>
     <path d="M464 203Q484 206 466 224" stroke="#cca98e" strokeWidth="9" fill="none"/>
   </g>}
   <FilmMarkers/>
   <text x="26" y="326" fill="#f2d2b3" fontFamily="monospace" fontSize="14">
    {close?'DETAIL / THE HAND AND CUP':'WIDE / ROOM AND ACTION'}
   </text>
  </svg>;
}
function Figure({x}:{x:number}){
 return <g transform={`translate(${x},0)`}>
    <circle cx="0" cy="137" r="26" fill="#dfb18e"/>
    <path d="M-32 174Q0 155 32 174L40 274H-42Z" fill="#a56c5e" stroke="#e3ac84" strokeWidth="2"/>
    <path d="M-25 271L-31 315M23 271L33 315" stroke="#453f4a" strokeWidth="13" strokeLinecap="round"/>
 </g>;
}
/** Identical background and figure size: only placement changes. */
export function CompositionFrames({take}:{take:Take}){
 const off=take===1;
 return <svg viewBox="0 0 640 350" className="vl-illustration" data-vl-frame="composition"
   aria-hidden="true" focusable="false">
   <rect width="640" height="350" fill="#283644"/>
   <rect y="228" width="640" height="122" fill="#26303b"/>
   <path d="M0 228H640" stroke="#9c8576" strokeWidth="4" opacity=".65"/>
   <rect x="497" y="53" width="98" height="130" rx="4" fill="#4e6978" stroke="#b3b9b5" strokeWidth="5"/>
   <path d="M545 53V183" stroke="#bbccca" strokeWidth="4"/>
   <circle cx="100" cy="99" r="37" fill="#d3a986" fillOpacity=".19"/>
   <path d="M213 13V336M427 13V336M13 117H627M13 233H627"
     stroke="#e2c9a9" strokeOpacity=".3" strokeWidth="1.6" strokeDasharray="6 7"/>
   <Figure x={off?211:320}/>
   <FilmMarkers/>
   <text x="26" y="327" fill="#eed1b4" fontFamily="monospace" fontSize="14">
    {off?'LEFT THIRD / MORE OPEN SPACE':'CENTRE / EVEN SPACE'}
   </text>
  </svg>;
}
/** The cup fill alone is the lesson's deliberate variable. */
export function ColourFrames({take}:{take:Take}){
 const accent=take===1;
 return <svg viewBox="0 0 640 350" className="vl-illustration" data-vl-frame="colour"
   aria-hidden="true" focusable="false">
   <rect width="640" height="350" fill="#313d46"/>
   <path d="M0 257H640V350H0Z" fill="#29333d"/>
   <path d="M0 256H640" stroke="#a6a6a5" strokeWidth="4" opacity=".63"/>
   <rect x="60" y="75" width="127" height="169" rx="4" fill="#485967" stroke="#9badaf" strokeWidth="5"/>
   <path d="M123 75V242" stroke="#879fa3" strokeWidth="4"/>
   <rect x="213" y="211" width="331" height="25" rx="4" fill="#8c8582"/>
   <path d="M243 237V315M513 237V315" stroke="#75716f" strokeWidth="13"/>
   <path d="M283 211V161H356V211Z" fill="#728b79"/>
   <path d="M300 161Q284 146 302 127Q314 133 325 153Q319 118 336 109Q347 133 336 160" fill="#6a927e"/>
   <path d="M395 175H482L469 219H406Z"
     fill={accent?'#ce654e':'#918e88'} stroke={accent?'#f1ac91':'#c1b2a3'} strokeWidth="3"/>
   <ellipse cx="438" cy="175" rx="44" ry="12" fill={accent?'#a93e37':'#746e6a'} stroke={accent?'#f2b49e':'#bdb1a7'} strokeWidth="4"/>
   <path d="M477 183Q518 183 503 207Q497 218 469 211" stroke={accent?'#d57762':'#a19a93'} strokeWidth="12" fill="none"/>
   <FilmMarkers/>
   <text x="26" y="327" fill="#ebd2b9" fontFamily="monospace" fontSize="14">
    {accent?'ONE WARM COLOUR ACCENT':'ALL OBJECTS MUTED'}
   </text>
 </svg>;
}
