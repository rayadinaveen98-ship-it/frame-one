/** All keys match the existing v0.1–v0.9 static prototype. Never rename casually. */
export const PROGRESS_KEY = 'frameone-progress-v01';
export const NOTES_KEY = 'frameone-practice-v07';
export const LANGUAGE_KEY = 'frameone-telugu-helper-v03';

export function safeProgress(validIds: readonly string[]): Set<string> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === 'string' && validIds.includes(x)));
  } catch { return new Set(); }
}
export function readPractice(id: string): string {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(NOTES_KEY) ?? '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return '';
    const value = (parsed as Record<string, unknown>)[id];
    return typeof value === 'string' ? value.slice(0, 240) : '';
  } catch { return ''; }
}
export function savePractice(id: string, note: string): boolean {
  try {
    let parsed: unknown = {};
    try { parsed = JSON.parse(localStorage.getItem(NOTES_KEY) ?? '{}'); }
    catch { parsed = {}; }
    const notes: Record<string, string> = {};
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === 'string' && key.length < 100) notes[key] = value.slice(0, 240);
      }
    }
    notes[id] = note.slice(0, 240);
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return true;
  } catch { return false; }
}
export function readTelugu(): boolean {
  try { return localStorage.getItem(LANGUAGE_KEY) === 'yes'; }
  catch { return false; }
}
export function saveTelugu(enabled: boolean): void {
  try { localStorage.setItem(LANGUAGE_KEY, enabled ? 'yes' : 'no'); }
  catch { /* Optional local setting. */ }
}
