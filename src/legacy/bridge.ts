import type { StoryPlan } from '../components/labs/story-data';
/** Narrow integration boundary while the seven labs continue using the original runtime. */
export type LegacyPage = 'home' | 'learn' | 'lesson' | 'lab' | 'crafts';
export type LabName = 'frame' | 'sound' | 'light' | 'cut' | 'story' | 'colour' | 'continuity';
export interface LegacyRoute { page: LegacyPage; lesson: string | null; lab?: LabName }
export interface LegacyBridge {
  navigate: (page: LegacyPage, lesson?: string) => void;
  openLab: (lab: LabName) => void;
  completeLesson: (id: string) => void;
  savePractice: (id: string, note: string) => boolean;
  setTelugu: (enabled: boolean) => void;
  exportBackup: () => void;
  /** Same legacy backup schema, exposed as local text for WebViews that block downloads. */
  getBackupJSON: () => string;
  importBackup: (data: unknown) => void;
  /** Typed Make Lab adapter: keeps the v0.7 storyboard inside the old backup engine. */
  getStoryboard: () => StoryPlan;
  saveStoryboard: (plan: StoryPlan) => boolean;
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
export function completeLesson(id: string): void { window.frameOneLegacy?.completeLesson(id); }
