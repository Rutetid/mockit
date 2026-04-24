export interface Question {
  id: string;
  week: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  noShuffle?: boolean;
}

export type Mode = 'study' | 'test' | 'exam';

export interface Answer {
  questionId: string;
  selectedAnswer: number | null;
  isCorrect: boolean;
}

export interface QuizResult {
  mode: Mode;
  totalQuestions: number;
  correctAnswers: number;
  answers: Answer[];
  date: Date;
}