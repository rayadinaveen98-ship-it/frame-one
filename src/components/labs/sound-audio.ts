/** Original Frame One synthesized sound sketches.
 * No audio files, no network requests and no automatic playback.
 * AudioContext is created ONLY inside the Play button interaction.
 */
export type SoundMode = 'silence'|'warm'|'tension';
export const soundOptions:Record<SoundMode,{label:string;sub:string;description:string}>={
  silence:{label:'No music',sub:'Only the optional background ambience',description:'No musical notes play here. With ambience enabled, you can still hear soft generated background sound. A real film without music may still contain dialogue, footsteps and other sounds.'},
  warm:{label:'Gentle tones',sub:'Soft, higher musical notes',description:'These simple notes might make the imagined wait feel calm or hopeful. This is just a sound sketch, not a full piece of music.'},
  tension:{label:'Uneasy tones',sub:'Low notes that shift slightly',description:'These low notes might make the imagined wait feel uncertain or tense. The picture we are imagining has not changed.'}
};
export interface SoundSession { stop:()=>void }
export const SOUND_SECONDS=5;

/** Constructed synchronously on a user's Play click.
 * Owns sources, context and timer; stop is idempotent.
 */
export function createSoundSession(
  mode:SoundMode, ambience:boolean, onEnded:()=>void, onError:()=>void
):SoundSession|null{
  const AudioCtx=window.AudioContext||(window as Window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
  if(!AudioCtx)return null;
  let ctx:AudioContext;
  try{ctx=new AudioCtx();}catch{return null;}
  const sources:AudioScheduledSourceNode[]=[];
  let timer:number|undefined;
  let stopped=false;
  const stop=()=>{
    if(stopped)return;
    stopped=true;
    if(timer!==undefined)window.clearTimeout(timer);
    for(const node of sources){try{node.stop();}catch{}try{node.disconnect();}catch{}}
    void ctx.close().catch(()=>{});
  };
  try{
    const start=ctx.currentTime+.08,seconds=SOUND_SECONDS;
    const master=ctx.createGain();master.gain.value=.75;master.connect(ctx.destination);
    if(ambience){
      const buffer=ctx.createBuffer(1,Math.round(ctx.sampleRate*2),ctx.sampleRate);
      const data=buffer.getChannelData(0);
      for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.3;
      const noise=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),ambGain=ctx.createGain();
      noise.buffer=buffer;noise.loop=true;
      filter.type='lowpass';filter.frequency.value=420;ambGain.gain.value=.11;
      noise.connect(filter);filter.connect(ambGain);ambGain.connect(master);
      noise.start(start);noise.stop(start+seconds);sources.push(noise);
    }
    if(mode!=='silence'){
      const warm=mode==='warm';
      const freqs=warm?[261.63,329.63,392,440,392,329.63]:[110,116.54,110,103.83,116.54,103.83,110];
      for(let i=0;i<freqs.length;i++){
        const t=start+.13+i*(warm?.62:.53);
        const o=ctx.createOscillator(),gain=ctx.createGain();
        o.type=warm?'sine':'triangle';o.frequency.setValueAtTime(freqs[i],t);
        gain.gain.setValueAtTime(.0001,t);
        gain.gain.exponentialRampToValueAtTime(warm?.12:.075,t+.08);
        gain.gain.exponentialRampToValueAtTime(.0001,Math.min(start+seconds,t+.55));
        o.connect(gain);gain.connect(master);
        o.start(t);o.stop(Math.min(start+seconds,t+.56));sources.push(o);
      }
    }
    // Resume must occur as part of the original user gesture.
    void ctx.resume().catch(()=>{if(!stopped){stop();onError();}});
    timer=window.setTimeout(()=>{if(!stopped){stop();onEnded();}},seconds*1000);
    return{stop};
  }catch{stop();return null;}
}
