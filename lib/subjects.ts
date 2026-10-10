import { Question } from './types';
import { esdQuestions } from './questions/esd';
import { polQuestions } from './questions/pol';

export interface Subject {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  questions: Question[];
}

export const subjects: Subject[] = [
  {
    id: 'esd',
    title: 'Education for Sustainable Development',
    subtitle: 'By Prof. Atasi Mohanty | IIT Kharagpur',
    icon: '🌱',
    questions: esdQuestions,
  },
  {
    id: 'pol',
    title: 'Psychology of Learning',
    subtitle: 'By Prof. Atasi Mohanty | IIT Kharagpur',
    icon: '🧠',
    questions: polQuestions,
  },
];

export const DEFAULT_SUBJECT_ID = 'pol';

const STORAGE_KEY = 'mockit.subject';

export function isSubjectId(id: string | null | undefined): id is string {
  return !!id && subjects.some(s => s.id === id);
}

export function getSubject(id: string | null | undefined): Subject {
  return subjects.find(s => s.id === id) ?? subjects.find(s => s.id === DEFAULT_SUBJECT_ID)!;
}

export function getSubjectWeeks(subject: Subject): number[] {
  return [...new Set(subject.questions.map(q => q.week))].sort((a, b) => a - b);
}

export function getStoredSubjectId(): string {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isSubjectId(stored) ? stored : DEFAULT_SUBJECT_ID;
  } catch {
    return DEFAULT_SUBJECT_ID;
  }
}

export function storeSubjectId(id: string): void {
  if (!isSubjectId(id)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // storage unavailable (private mode) — selection just won't persist
  }
}

// URL param > saved selection > default
export function resolveSubjectId(param: string | null): string {
  if (isSubjectId(param)) return param;
  return getStoredSubjectId();
}
