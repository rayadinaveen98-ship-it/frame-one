/* Visual contract: compare actual rendered pixels of React and approved HTML.
 * No artificial screenshot approvals; both screenshots are taken in the same
 * browser, viewport, device scale and animation-free state in CI. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

async function screenshotPhone(locator,filename,shotDir){
  const image=await locator.screenshot({animations:'disabled'});
  fs.writeFileSync(path.join(shotDir,filename),image);
  return image;
}
async function comparePixels(page,approved,react,label,{maxChangedRatio=0.08}={}){
  const out=await page.evaluate(async ([a,b])=>{
    function load(encoded){
      return new Promise((resolve,reject)=>{
        const img=new Image();
        img.onload=()=>resolve(img);
        img.onerror=()=>reject(new Error('Could not decode screenshot'));
        img.src='data:image/png;base64,'+encoded;
      });
    }
    const [imgA,imgB]=await Promise.all([load(a),load(b)]);
    if(imgA.width!==imgB.width||imgA.height!==imgB.height)
      return {error:'dimensions differ',a:[imgA.width,imgA.height],b:[imgB.width,imgB.height]};
    const cvs=document.createElement('canvas');cvs.width=imgA.width;cvs.height=imgA.height;
    const ctx=cvs.getContext('2d',{willReadFrequently:true});
    if(!ctx)throw new Error('Canvas rendering unavailable');
    ctx.drawImage(imgA,0,0);const d1=ctx.getImageData(0,0,cvs.width,cvs.height).data;
    ctx.clearRect(0,0,cvs.width,cvs.height);
    ctx.drawImage(imgB,0,0);const d2=ctx.getImageData(0,0,cvs.width,cvs.height).data;
    let changed=0,meanAbs=0;
    const total=cvs.width*cvs.height;
    for(let p=0;p<total;p++){
      const i=p*4;
      const diff=Math.max(Math.abs(d1[i]-d2[i]),Math.abs(d1[i+1]-d2[i+1]),Math.abs(d1[i+2]-d2[i+2]));
      if(diff>28)changed++;
      meanAbs+=(Math.abs(d1[i]-d2[i])+Math.abs(d1[i+1]-d2[i+1])+Math.abs(d1[i+2]-d2[i+2]))/3;
    }
    return {width:cvs.width,height:cvs.height,changedRatio:changed/total,meanAbs:meanAbs/total,changedPixels:changed};
  },[approved.toString('base64'),react.toString('base64')]);
  assert(!out.error,label+': '+JSON.stringify(out));
  assert(out.changedRatio<=maxChangedRatio,
    label+': '+(out.changedRatio*100).toFixed(2)+'% significant pixel changes exceed '+(maxChangedRatio*100)+'% parity budget');
  return out;
}
module.exports={screenshotPhone,comparePixels};
