export type Difficulty = 'easy' | 'medium' | 'hard';
export type Operator = '<' | '>' | '≤' | '≥';
export type Topic = 'one-side' | 'both-sides' | 'one-step' | 'two-step' | 'mixed';
export type Question = {
  id: string; question: string; answer: string; topic: string; difficulty: Difficulty;
  type: 'equation' | 'inequality'; explanation: string[]; value: number;
  numberLine?: { boundary: number; operator: Operator };
};
export type Response = { value: string; operator: Operator; correct: boolean };
export type Session = { id: string; chapter: 1 | 3; topic: Topic; difficulty: Difficulty; questions: Question[]; responses: Response[]; index: number; completed: boolean };
export type ChapterProgress = { attempted: number; correct: number; incorrect: number; bestScore: number; sessions: number };
export type SavedData = { session: Session | null; progress: Record<string, ChapterProgress> };
