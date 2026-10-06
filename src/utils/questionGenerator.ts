import type { Difficulty, Operator, Question, Topic } from '../types/math.ts';
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(values: T[]): T => values[random(0, values.length - 1)];
const flip = (op: Operator): Operator => ({ '<': '>', '>': '<', '≤': '≥', '≥': '≤' } as const)[op];
const term = (a: number) => a === 1 ? 'x' : a === -1 ? '−x' : `${a}x`;
const expression = (a: number, b: number) => `${term(a)}${b === 0 ? '' : b > 0 ? ` + ${b}` : ` − ${-b}`}`;
export function generateQuestion(kind: 'one-step' | 'two-step' | 'both-sides', type: 'equation' | 'inequality', difficulty: Difficulty = 'easy'): Question {
  const limit = difficulty === 'easy' ? 9 : difficulty === 'medium' ? 12 : 15;
  const value = random(difficulty === 'easy' ? 0 : -limit, limit);
  const negative = type === 'inequality' && difficulty !== 'easy' && Math.random() < .5;
  let a = random(2, difficulty === 'hard' ? 9 : 5) * (negative ? -1 : 1);
  let b = random(1, limit) * pick([-1, 1]);
  let c = 0;
  const op: Operator = pick(['<', '>', '≤', '≥']);
  const sign = type === 'equation' ? '=' : op;
  let question: string;
  let explanation: string[];
  let answerOp = op;
  if (kind === 'one-step' && Math.random() < .33) {
    const divisor = a;
    const rhs = value;
    question = `x / ${divisor} ${sign} ${rhs}`;
    if (divisor < 0) answerOp = flip(op);
    explanation = [question, `Multiply both sides by ${divisor}.`];
    if (type === 'inequality' && divisor < 0) explanation.push('When you multiply an inequality by a negative number, the inequality sign reverses.');
    explanation.push(`x ${type === 'equation' ? '=' : answerOp} ${value * divisor}`);
    return finish(value * divisor, question, explanation, answerOp);
  }
  if (kind === 'one-step') {
    if (Math.random() < .5) a = 1; else b = 0;
  }
  if (kind === 'both-sides') {
    c = random(1, 5);
    if (c + a === 0) c++;
    a = c + a;
  }
  const coefficient = a - c;
  const rhs = coefficient * value + b;
  question = `${expression(a, b)} ${sign} ${c ? expression(c, rhs) : rhs}`;
  explanation = [question];
  if (c) explanation.push(`Subtract ${c}x from both sides.`, `${expression(coefficient, b)} ${sign} ${rhs}`);
  if (b) explanation.push(`${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} on both sides.`, `${term(coefficient)} ${sign} ${rhs - b}`);
  if (coefficient !== 1) explanation.push(`Divide both sides by ${coefficient}.`);
  if (type === 'inequality' && coefficient < 0) {
    answerOp = flip(op);
    explanation.push('When you divide an inequality by a negative number, the inequality sign reverses.');
  }
  explanation.push(`x ${type === 'equation' ? '=' : answerOp} ${value}`);
  return finish(value, question, explanation, answerOp);
  function finish(boundary: number, text: string, steps: string[], operator: Operator): Question {
    if (!Number.isInteger(boundary) || Math.abs(boundary) > 135 || (kind !== 'one-step' && a === c)) throw new Error('Invalid question');
    return { id: crypto.randomUUID(), question: text, answer: `x ${type === 'equation' ? '=' : operator} ${boundary}`, value: boundary, topic: kind, difficulty, type, explanation: steps, ...(type === 'inequality' ? { numberLine: { boundary, operator } } : {}) };
  }
}
export function generateSessionQuestions(chapter: 1 | 3, topic: Topic, difficulty: Difficulty, count: number): Question[] {
  const questions: Question[] = [];
  const seen = new Set<string>();
  for (let tries = 0; questions.length < count && tries < count * 100; tries++) {
    const kinds: ('one-step' | 'two-step' | 'both-sides')[] = topic === 'mixed' ? ['one-step', 'two-step', 'both-sides'] : topic === 'one-side' ? ['one-step', 'two-step'] : [topic];
    const q = generateQuestion(pick(kinds), chapter === 1 ? 'equation' : 'inequality', difficulty);
    if (!seen.has(q.question)) { seen.add(q.question); questions.push(q); }
  }
  if (questions.length !== count) throw new Error('Unable to generate unique questions. Please try again.');
  return questions;
}
export function isCorrect(question: Question, raw: string, operator: Operator): boolean {
  const normalized = raw.trim();
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return false;
  return Number(normalized) === question.value && (question.type === 'equation' || operator === question.numberLine?.operator);
}
