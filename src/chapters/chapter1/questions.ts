import { generateQuestion } from '../../utils/questionGenerator.ts';
import type { Difficulty } from '../../types/math.ts';
export const generateOneStepEquation = (difficulty: Difficulty = 'easy') => generateQuestion('one-step', 'equation', difficulty);
export const generateTwoStepEquation = (difficulty: Difficulty = 'easy') => generateQuestion('two-step', 'equation', difficulty);
export const generateBothSidesEquation = (difficulty: Difficulty = 'easy') => generateQuestion('both-sides', 'equation', difficulty);
