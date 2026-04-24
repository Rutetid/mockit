import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export interface ShuffledOption {
  text: string;
  isCorrect: boolean;
}

export function shuffleOptions(options: string[], correctAnswer: number, noShuffle?: boolean): ShuffledOption[] {
  if (noShuffle) {
    return options.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === correctAnswer,
    }));
  }
  const shuffled = shuffleArray(
    options.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === correctAnswer,
    }))
  );
  return shuffled;
}
