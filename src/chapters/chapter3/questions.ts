import { generateQuestion } from '../../utils/questionGenerator.ts';
import type { Difficulty } from '../../types/math.ts';
export const generateOneStepInequality = (difficulty: Difficulty = 'easy') => generateQuestion('one-step', 'inequality', difficulty);
export const generateTwoStepInequality = (difficulty: Difficulty = 'easy') => generateQuestion('two-step', 'inequality', difficulty);
export const generateBothSidesInequality = (difficulty: Difficulty = 'easy') => generateQuestion('both-sides', 'inequality', difficulty);
