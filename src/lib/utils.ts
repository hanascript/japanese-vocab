import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Example spaced repetition algorithm implementation
export function calculateNextReview(
  isCorrect: boolean,
  currentEaseFactor: number,
  currentInterval: number,
  currentRepetitions: number,
  difficulty?: number // 1-5 scale, 5 being hardest
) {
  let newEaseFactor = currentEaseFactor;
  let newInterval = currentInterval;
  let newRepetitions = currentRepetitions;

  if (isCorrect) {
    newRepetitions += 1;
    
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(currentInterval * currentEaseFactor);
    }
    
    // Adjust ease factor based on difficulty if provided
    if (difficulty) {
      const adjustment = 0.1 - (difficulty - 3) * (0.08 + (difficulty - 3) * 0.02);
      newEaseFactor = Math.max(1.3, currentEaseFactor + adjustment);
    }
  } else {
    // Card answered incorrectly - reset repetitions and set short interval
    newRepetitions = 0;
    newInterval = 1;
    newEaseFactor = Math.max(1.3, currentEaseFactor - 0.2);
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
  };
}
