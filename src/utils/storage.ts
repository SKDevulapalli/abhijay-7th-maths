import type { SavedData, Session, Response } from '../types/math.ts';
export const STORAGE_KEY = 'grade7-math-v1';
export const emptyData = (): SavedData => ({ session: null, progress: {} });
export function loadData(): SavedData {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!data || typeof data.progress !== 'object' || data.progress === null) return emptyData();
    if (data.session && (!Array.isArray(data.session.questions) || !data.session.questions.length || !Array.isArray(data.session.responses) || !Number.isInteger(data.session.index))) return emptyData();
    return data;
  } catch { return emptyData(); }
}
export function saveData(data: SavedData): boolean {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; } catch { return false; }
}
export function recordResponse(data: SavedData, response: Response): SavedData {
  const session = data.session;
  if (!session || session.completed || session.responses[session.index]) return data;
  const previous = data.progress[session.chapter] || { attempted: 0, correct: 0, incorrect: 0, bestScore: 0, sessions: 0 };
  return { session: { ...session, responses: [...session.responses, response] }, progress: { ...data.progress, [session.chapter]: { ...previous, attempted: previous.attempted + 1, correct: previous.correct + Number(response.correct), incorrect: previous.incorrect + Number(!response.correct) } } };
}
export function advance(data: SavedData): SavedData {
  const session = data.session;
  if (!session || session.completed || !session.responses[session.index]) return data;
  if (session.index < session.questions.length - 1) return { ...data, session: { ...session, index: session.index + 1 } };
  const previous = data.progress[session.chapter];
  const score = Math.round(session.responses.filter(r => r.correct).length / session.questions.length * 100);
  return { session: { ...session, completed: true }, progress: { ...data.progress, [session.chapter]: { ...previous, sessions: previous.sessions + 1, bestScore: Math.max(previous.bestScore, score) } } };
}
export function createSession(chapter: 1 | 3, topic: Session['topic'], difficulty: Session['difficulty'], questions: Session['questions']): Session {
  return { id: crypto.randomUUID(), chapter, topic, difficulty, questions, responses: [], index: 0, completed: false };
}
