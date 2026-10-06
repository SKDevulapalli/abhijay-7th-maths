import test from 'node:test';
import assert from 'node:assert/strict';
import { generateQuestion, generateSessionQuestions, isCorrect } from '../src/utils/questionGenerator.ts';
import { advance, createSession, emptyData, recordResponse } from '../src/utils/storage.ts';
import type { Difficulty } from '../src/types/math.ts';
function evaluate(expression: string, x: number): number {
  const normalized = expression.replaceAll('−', '-').replace(/(\d)x/g, '$1*x').replaceAll('x', `(${x})`);
  assert.match(normalized, /^[\d\s()+*/.-]+$/);
  return Function(`return (${normalized})`)();
}
test('random generators produce valid integer solutions and inequality direction', () => {
  let reversed = 0;
  for (const difficulty of ['easy', 'medium', 'hard'] as Difficulty[]) for (const type of ['equation', 'inequality'] as const) for (const kind of ['one-step', 'two-step', 'both-sides'] as const) for (let i = 0; i < 300; i++) {
    const q = generateQuestion(kind, type, difficulty);
    const [lhs, op, rhs] = q.question.split(/\s([=<>≤≥])\s/);
    assert.ok(Number.isInteger(q.value));
    assert.ok(evaluate(lhs, q.value) === evaluate(rhs, q.value), q.question);
    assert.ok(isCorrect(q, ` ${q.value} `, q.numberLine?.operator || '>'));
    if (type === 'inequality') {
      const slope = (evaluate(lhs, q.value + 1) - evaluate(rhs, q.value + 1));
      const flipped = { '>': '<', '<': '>', '≤': '≥', '≥': '≤' };
      assert.equal(q.numberLine!.operator, slope < 0 ? flipped[op as keyof typeof flipped] : op);
      if (slope < 0) { reversed++; assert.ok(q.explanation.some(s => s.includes('sign reverses'))); }
    }
  }
  assert.ok(reversed > 0);
});
test('sessions have unique questions and strict numeric input', () => {
  for (const chapter of [1, 3] as const) {
    const qs = generateSessionQuestions(chapter, 'mixed', 'hard', 20);
    assert.equal(new Set(qs.map(q => q.question)).size, 20);
    for (const bad of ['', ' ', 'Infinity', '5oops', '0x5']) assert.equal(isCorrect(qs[0], bad, '>'), false);
  }
});
test('first answer is immutable, refresh preserves lock, completion is scored once', () => {
  const questions = generateSessionQuestions(1, 'one-side', 'easy', 10);
  let data = { ...emptyData(), session: createSession(1, 'one-side', 'easy', questions) };
  for (let i = 0; i < 10; i++) {
    const updated = recordResponse(data, { value: '5', operator: '>', correct: i < 8 });
    data = JSON.parse(JSON.stringify(updated));
    assert.deepEqual(recordResponse(data, { value: '6', operator: '>', correct: true }), data);
    data = advance(data) as typeof data;
  }
  assert.equal(data.progress[1].correct, 8);
  assert.equal(data.progress[1].incorrect, 2);
  assert.equal(data.progress[1].bestScore, 80);
  assert.deepEqual(advance(data), data);
});
