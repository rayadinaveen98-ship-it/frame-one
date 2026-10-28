import type {PosterArt} from '../data/cinema-library';

/** Original CSS/SVG cinema-cover illustrations: bundled offline, never remote thumbnails. */
export function CinemaArtwork({art}:{art:PosterArt}) {
  return <span className={'cinema-poster-scene cinema-poster-'+art} aria-hidden="true">
    <svg className="cinema-poster-drawing" viewBox="0 0 300 360" preserveAspectRatio="xMidYMid meet" focusable="false">
      <path d="M18 284H282" stroke="currentColor" strokeOpacity=".13" strokeWidth="1"/>
      {art==='projector' && <>
        <path d="M106 190L273 112V283L106 226Z" fill="#f3c69b" fillOpacity=".10"/>
        <circle cx="113" cy="148" r="79" fill="#151e24" stroke="#deb18d" strokeWidth="4"/>
        <circle cx="113" cy="148" r="60" fill="none" stroke="#d7a17e" strokeOpacity=".42" strokeWidth="2"/>
        {[0,72,144,216,288].map(angle=><ellipse key={angle}
          cx="113" cy="107" rx="13" ry="18" transform={'rotate('+angle+' 113 148)'}
          fill="#d0ae91" fillOpacity=".7"/>)}
        <circle cx="113" cy="148" r="13" fill="#0d121a" stroke="#c9ab8c" strokeWidth="3"/>
        <path d="M76 211H157L181 237V263H65V236Z" fill="#1c2830" stroke="#cfac88" strokeWidth="3"/>
        <path d="M102 263L87 303M142 263L157 303" stroke="#c5ab96" strokeWidth="5"/>
      </>}
      {art==='story' && <>
        <rect x="51" y="82" width="191" height="242" rx="5" transform="rotate(-10 150 205)"
          fill="#8b6b57" fillOpacity=".3" stroke="#dfb58d" strokeOpacity=".55" strokeWidth="2"/>
        <rect x="59" y="77" width="184" height="237" rx="4" transform="rotate(5 150 205)"
          fill="#e4cfb4" fillOpacity=".86"/>
        <g transform="translate(76 110) rotate(5 100 110)" fill="#5c4c45" opacity=".85">
          <rect width="63" height="5" rx="2"/><rect y="23" width="149" height="2" rx="1"/>
          <rect y="37" width="126" height="2" rx="1"/><rect y="51" width="141" height="2" rx="1"/>
          <rect y="77" x="29" width="90" height="4" rx="2"/>
          <rect y="102" width="135" height="2" rx="1"/>
          <rect y="116" width="116" height="2" rx="1"/>
          <rect y="139" x="40" width="95" height="4" rx="2"/>
        </g>
        <path d="M210 230L250 180M210 230L201 252L224 241Z" stroke="#3c2724" strokeWidth="8" strokeLinecap="round"/>
      </>}
      {art==='frame' && <>
        <rect x="29" y="75" width="242" height="208" rx="3" fill="#192c35" stroke="#c59c7f" strokeWidth="5"/>
        <path d="M48 75V283M252 75V283M29 139H271M29 214H271"
          stroke="#e1bc99" strokeOpacity=".27" strokeWidth="2"/>
        <circle cx="198" cy="148" r="51" fill="#c28a73" fillOpacity=".78"/>
        <path d="M30 271L103 210L139 244L207 179L271 256V283H29Z" fill="#0f1820" opacity=".95"/>
        <circle cx="137" cy="194" r="13" fill="#0c1119"/>
        <path d="M128 211Q137 202 146 211V266H128Z" fill="#0c1119"/>
        <path d="M20 63V87M20 63H46M280 63H256M280 63V87M20 294V270M20 294H46M280 294H256M280 294V270"
          stroke="#f0caa6" strokeWidth="4" strokeLinecap="square"/>
      </>}
      {art==='light' && <>
        <path d="M164 69L278 300H28Z" fill="#f7d5a7" fillOpacity=".19"/>
        <path d="M164 69L222 286H105Z" fill="#f1bc8f" fillOpacity=".18"/>
        <ellipse cx="164" cy="305" rx="111" ry="23" fill="#e5b08a" fillOpacity=".24"/>
        <circle cx="163" cy="72" r="24" fill="#f6d8ae" fillOpacity=".74"/>
        <circle cx="155" cy="198" r="19" fill="#172029"/>
        <path d="M137 224Q155 208 174 224L178 298H132Z" fill="#151a22"/>
        <path d="M142 292L128 341M166 292L184 341" stroke="#141922" strokeWidth="13" strokeLinecap="round"/>
        <path d="M23 318H277" stroke="#c8ab91" strokeOpacity=".28" strokeWidth="3"/>
      </>}
      {art==='sound' && <>
        <circle cx="150" cy="174" r="22" fill="#e3bf9b"/>
        {[48,78,112].map((radius,index)=><circle key={radius} cx="150" cy="174" r={radius}
          stroke="#e1b58d" strokeWidth={index===0?4:2.5} strokeOpacity={.65-index*.13} fill="none"/>)}
        <g stroke="#f1d3af" strokeWidth="6" strokeLinecap="round" fill="none">
          <path d="M45 196V163M73 221V139M101 241V118M199 242V118M227 221V139M255 196V163"/>
        </g>
        <path d="M34 293H266" stroke="#d2a785" strokeOpacity=".24" strokeWidth="2"/>
      </>}
      {art==='cut' && <>
        <path d="M59 41V330M241 41V330" stroke="#d0aa89" strokeWidth="4"/>
        {[60,130,200,270].map((y,index)=><g key={index}>
          <rect x="62" y={y} width="176" height="54" rx="2" fill={index%2?'#6a5049':'#2c3942'}
            stroke="#e3c1a1" strokeOpacity=".72" strokeWidth="2"/>
          <circle cx={index%2?182:116} cy={y+24} r="15" fill="#e8b58e" fillOpacity=".68"/>
          <path d={'M64 '+(y+52)+'L118 '+(y+28)+'L148 '+(y+52)+'Z'} fill="#171e26"/>
          <rect x="39" y={y+8} width="12" height="14" rx="1" fill="#c9a18a"/>
          <rect x="249" y={y+8} width="12" height="14" rx="1" fill="#c9a18a"/>
        </g>)}
      </>}
      {art==='studio' && <>
        <path d="M75 117H225L194 195H106Z" fill="#4b3531" stroke="#e1b78d" strokeWidth="4"/>
        <path d="M87 147H214M106 195L74 304M194 195L226 304"
          stroke="#d8ad8a" strokeWidth="9" strokeLinecap="round"/>
        <path d="M75 117L58 102M225 117L240 102" stroke="#d8ad8a" strokeWidth="5"/>
        <rect x="83" y="234" width="135" height="22" rx="4" fill="#a37c62"/>
        <path d="M92 245L80 319M208 245L220 319" stroke="#b98c70" strokeWidth="7"/>
        <path d="M147 59L147 99" stroke="#e8c3a0" strokeWidth="3" strokeDasharray="6 6"/>
        <path d="M129 68L150 52L171 68" fill="none" stroke="#e8c3a0" strokeWidth="4"/>
      </>}
      {art==='crew' && <>
        {[{x:73,y:145,r:27},{x:161,y:119,r:31},{x:236,y:150,r:25}].map((p,i)=><g key={p.x}>
          <circle cx={p.x} cy={p.y} r={p.r} fill={i===1?'#e1aa86':'#b88774'} opacity=".91"/>
          <path d={'M'+(p.x-p.r-17)+' 311V'+(p.y+p.r+55)+'Q'+p.x+' '+(p.y+p.r-21)+' '+(p.x+p.r+17)+' '+(p.y+p.r+55)+'V311Z'}
            fill={i===1?'#26313a':'#1d222c'} stroke="#d1a98b" strokeOpacity=".3" strokeWidth="2"/>
        </g>)}
        <path d="M32 311H267" stroke="#e5b494" strokeWidth="3" strokeOpacity=".37"/>
      </>}
    </svg>
    <span className="cinema-poster-grain"/>
  </span>;
}
