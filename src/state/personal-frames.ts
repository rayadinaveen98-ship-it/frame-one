/** Frame One personal cinema frames: separate IndexedDB from learner backups.
 * Images never leave the device, and deletion only affects Frame One's copy.
 */
export type Focus = 'center' | 'top' | 'bottom' | 'left' | 'right';
export type PersonalFrame = {
  id:string;
  image:Blob;
  title:string;
  addedAt:number;
  sortOrder:number;
  focus:Focus;
};
const DATABASE='frameone-personal-frames-v1';
const STORE='frames';
export const MAX_FRAMES=24;
const MAX_FILE_BYTES=25*1024*1024;
const LONG_SIDE=1920;
function openDatabase():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{
    if(typeof indexedDB==='undefined'){reject(new Error('Photo storage is not supported on this device.'));return;}
    const request=indexedDB.open(DATABASE,1);
    request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id'});};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error??new Error('Photo storage could not open.'));
    request.onblocked=()=>reject(new Error('Photo storage is busy in another tab.'));
  });
}
export async function listFrames():Promise<PersonalFrame[]>{
  const db=await openDatabase();
  try {
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readonly');
      const req=tx.objectStore(STORE).getAll();
      req.onsuccess=()=>resolve((req.result as PersonalFrame[]).sort((a,b)=>a.sortOrder-b.sortOrder || a.addedAt-b.addedAt));
      req.onerror=()=>reject(req.error??new Error('Could not read your frames.'));
    });
  }finally{db.close();}
}
async function writeFrame(frame:PersonalFrame):Promise<void>{
  const db=await openDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).put(frame);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Could not save the photo.'));
      tx.onabort=()=>reject(tx.error??new Error('Photo save was interrupted.'));
    });
  }finally{db.close();}
}
export async function deleteFrame(id:string):Promise<void>{
  const db=await openDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Could not remove the photo.'));
      tx.onabort=()=>reject(tx.error??new Error('Photo removal was interrupted.'));
    });
  }finally{db.close();}
}
export async function persistFrameOrder(frames:PersonalFrame[]):Promise<void>{
  const db=await openDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      frames.forEach((frame,index)=>tx.objectStore(STORE).put({...frame,sortOrder:index}));
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Could not reorder photos.'));
      tx.onabort=()=>reject(tx.error??new Error('Photo order update interrupted.'));
    });
  }finally{db.close();}
}
async function decode(file:File):Promise<{source:CanvasImageSource;width:number;height:number;release:()=>void}>{
  if(typeof createImageBitmap==='function'){
    const bitmap=await createImageBitmap(file);
    return {source:bitmap,width:bitmap.width,height:bitmap.height,release:()=>bitmap.close()};
  }
  const url=URL.createObjectURL(file);
  try{
    const img=await new Promise<HTMLImageElement>((resolve,reject)=>{
      const element=new Image();
      element.onload=()=>resolve(element);
      element.onerror=()=>reject(new Error('This image format could not be decoded.'));
      element.src=url;
    });
    return {source:img,width:img.naturalWidth,height:img.naturalHeight,release:()=>URL.revokeObjectURL(url)};
  }catch(err){URL.revokeObjectURL(url);throw err;}
}
/** Re-encode once on selection so 24 large camera originals never overload IDB. */
export async function prepareFrame(file:File,sortOrder:number):Promise<PersonalFrame>{
  if(!file.type.startsWith('image/'))throw new Error('Select image files only.');
  if(file.size>MAX_FILE_BYTES)throw new Error('One image exceeds the 25 MB selection limit.');
  const decoded=await decode(file);
  try{
    if(!decoded.width||!decoded.height)throw new Error('Image dimensions are invalid.');
    const ratio=Math.min(1,LONG_SIDE/Math.max(decoded.width,decoded.height));
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(decoded.width*ratio));
    canvas.height=Math.max(1,Math.round(decoded.height*ratio));
    const context=canvas.getContext('2d',{alpha:false});
    if(!context)throw new Error('Photo processing is unavailable.');
    context.drawImage(decoded.source,0,0,canvas.width,canvas.height);
    const image=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(
      value=>value?resolve(value):reject(new Error('Could not compress this image.')),
      'image/jpeg',.83));
    return {id:typeof crypto!=='undefined'&&typeof crypto.randomUUID==='function'
      ?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(36).slice(2),
      image,title:file.name.slice(0,120),addedAt:Date.now(),sortOrder,focus:'center'};
  }finally{decoded.release();}
}
export async function addFrame(frame:PersonalFrame):Promise<void>{await writeFrame(frame);}
export async function editFrame(frame:PersonalFrame):Promise<void>{await writeFrame(frame);}
