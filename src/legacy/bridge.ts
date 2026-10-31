import type { StoryPlan } from '../components/labs/story-data';
export interface StoryProject {id:string;name:string;scene:StoryPlan}
export interface StoryProjectsSnapshot {activeId:string|null;error:string|null;projects:StoryProject[]}

/** Narrow integration boundary while the seven labs continue using the original runtime. */
export type LegacyPage = 'home' | 'learn' | 'lesson' | 'lab' | 'crafts' | 'collection';
export type LabName = 'frame' | 'sound' | 'light' | 'cut' | 'story' | 'colour' | 'continuity';
export interface LegacyRoute { page: LegacyPage; lesson: string | null; lab?: LabName; collection?: string; journey?: string }
export interface LegacyBridge {
  navigate: (page: LegacyPage, lesson?: string) => void;
  /** Navigate only within Frame One; never fall through to an external URL. */
  goBack: () => void;
  openLab: (lab: LabName) => void;
  openCollection: (collectionId: string) => void;
  completeLesson: (id: string, continuation?: {nextLessonId?:string;returnCollectionId?:string}) => void;
  savePractice: (id: string, note: string) => boolean;
  setTelugu: (enabled: boolean) => void;
  exportBackup: () => void;
  /** Same legacy backup schema, exposed as local text for WebViews that block downloads. */
  getBackupJSON: () => string;
  /** Pure backup preflight; returns counts only, never private note content. */
  inspectBackup: (data: unknown) => {completedLessons:number;practiceNotes:number;storyboardShots:number;storyboardProjects:number};
  importBackup: (data: unknown) => void;
  /** Typed Make Lab adapter: keeps the v0.7 storyboard inside the old backup engine. */
  getStoryboard: () => StoryPlan;
  saveStoryboard: (plan: StoryPlan) => boolean;
  getStoryProjects: () => StoryProjectsSnapshot;
  createStoryProject: (name:string,seed?:StoryPlan) => boolean;
  switchStoryProject: (id:string) => boolean;
  renameStoryProject: (id:string,name:string) => boolean;
  deleteStoryProject: (id:string) => boolean;
  exportShotList: () => void;
  illustration: (shape: 'place' | 'person' | 'detail') => string;
}
declare global {
  interface Window { frameOneLegacy?: LegacyBridge }
}
export function navigate(page: LegacyPage, lesson?: string): void {
  window.frameOneLegacy?.navigate(page, lesson);
}
export function openLab(lab: LabName): void { window.frameOneLegacy?.openLab(lab); }
export function openCollection(collectionId: string): void { window.frameOneLegacy?.openCollection(collectionId); }
export function completeLesson(id: string, continuation?: {nextLessonId?:string;returnCollectionId?:string}): void { window.frameOneLegacy?.completeLesson(id,continuation); }
