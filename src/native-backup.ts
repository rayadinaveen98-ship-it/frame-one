import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const BACKUP_NAME='frame-one-learning-backup.json';
const MAX_BACKUP_BYTES=2_000_000;

/** Android WebViews don't always download Blob object URLs.
 * Write the existing v1 JSON to Android-private cache, verify its contents,
 * and give the learner an explicit external share/save chooser.
 *
 * IMPORTANT: a share sheet is not a durable save. Don't tell learners their
 * backup is safe until they select a destination and verify the saved file.
 * Existing file import and manual JSON copy/paste remain available.
 */
export function isAndroidBackupAvailable(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform()==='android';
}

export async function shareAndroidLearningBackup(raw:string):Promise<void> {
  if(!isAndroidBackupAvailable())throw new Error('Android native share is not available here.');
  if(new TextEncoder().encode(raw).byteLength>MAX_BACKUP_BYTES)
    throw new Error('Backup is too large to share safely.');
  let payload:unknown;
  try { payload=JSON.parse(raw); } catch { throw new Error('Backup JSON is invalid.'); }
  if(!payload || typeof payload!=='object' || (payload as {format?:unknown}).format!=='frameone-learning-backup' || (payload as {version?:unknown}).version!==1)
    throw new Error('Unexpected Frame One backup format.');

  const result=await Filesystem.writeFile({
    path:BACKUP_NAME, data:raw,
    directory:Directory.Cache,encoding:Encoding.UTF8
  });
  // Confirm that an actual native file exists with the same bytes before
  // invoking an external Android chooser. Never publish the JSON to a log.
  const verified=await Filesystem.readFile({
    path:BACKUP_NAME,directory:Directory.Cache,encoding:Encoding.UTF8
  });
  if(typeof verified.data!=='string'||verified.data!==raw)
    throw new Error('Android could not verify the generated backup file.');

  await Share.share({
    title:'Frame One learning backup',
    dialogTitle:'Save your Frame One backup outside this app',
    text:'Keep this JSON file private. It contains your lesson progress and filmmaking notes.',
    files:[result.uri]
  });
}
