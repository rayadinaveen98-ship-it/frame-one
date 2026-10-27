/** Content types for future React lesson components. Migration is still underway. */
export type LessonSection = [heading: string, explanation: string];
export interface Lesson {
  id: string;
  num: string;
  unit: string;
  title: string;
  subtitle: string;
  minutes: number;
  sections: LessonSection[];
  answer: number;
  opts: string[];
  q: string;
  feedback: string;
  idea: string;
  try: string;
  [key: string]: unknown;
}
export interface Curriculum { lessons: Lesson[]; chapters: unknown[]; teluguNotes: Record<string, string>; glossary: unknown[]; crafts: unknown[]; choices: Record<string, unknown>; }
