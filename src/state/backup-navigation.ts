/**
 * A one-shot, memory-only navigation intent for the Android backup shortcut.
 * No new localStorage keys, backup fields, browser history format or secrets.
 */
import {navigate} from '../legacy/bridge';

let backupRequested=false;

export function openLearningBackup():void{
  backupRequested=true;
  navigate('learn');
}

/** Called only when Learn's actual backup panel has mounted. */
export function consumeLearningBackupRequest():boolean{
  const requested=backupRequested;
  backupRequested=false;
  return requested;
}
