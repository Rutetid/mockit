'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/navbar';
import { questions as allQuestions } from '@/lib/questions';
import { Question } from '@/lib/types';

const optionLabels = ['A', 'B', 'C', 'D'];

interface AnsweredQuestion {
  question: Question;
  selectedAnswer: number | null;
  isCorrect: boolean;
  showAnswer: boolean;
}

function StudyContent() {
  const searchParams = useSearchParams();
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const questionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const weeksParam = searchParams.get('weeks');
    if (weeksParam) {
      const weeks = weeksParam.split(',').map(Number);
      const filtered = allQuestions.filter(q => weeks.includes(q.week));
      setQuizQuestions(filtered);
      setAnswers(filtered.map(q => ({ question: q, selectedAnswer: null, isCorrect: false, showAnswer: false })));
      setQuizStarted(true);
    } else {
      setQuizQuestions(allQuestions);
      setAnswers(allQuestions.map(q => ({ question: q, selectedAnswer: null, isCorrect: false, showAnswer: false })));
      setQuizStarted(true);
    }
  }, [searchParams]);

  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => prev.map((a, i) => {
      if (i !== questionIndex) return a;
      return {
        ...a,
        selectedAnswer: answerIndex,
        isCorrect: answerIndex === a.question.correctAnswer,
        showAnswer: true,
      };
    }));
  };

  const handleRetry = () => {
    setAnswers(prev => prev.map(a => ({ ...a, selectedAnswer: null, isCorrect: false, showAnswer: false })));
    setShowResults(false);
  };

  const handleHome = () => {
    window.location.href = '/practice';
  };

  const correctCount = answers.filter(a => a.isCorrect).length;
  const answeredCount = answers.filter(a => a.showAnswer).length;
  const progress = answers.length > 0 ? (answeredCount / answers.length) * 100 : 0;

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#0C0C0C]">
        <Navbar />
        <main className="pt-20 pb-12 px-4">
        <div className="max-w-lg mx-auto space-y-6 pt-8">
          <Card className="bg-zinc-900 border-zinc-800 text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-white">Study Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="py-4">
                <div className={`text-6xl font-bold ${correctCount >= answers.length * 0.7 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {correctCount}/{answers.length}
                </div>
                <div className="text-zinc-500 mt-2">Correct Answers</div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleRetry} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white border-none">Try Again</Button>
                <Button onClick={handleHome} className="flex-1">Home</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C]">
      <Navbar />
      <main className="pt-20 pb-12 px-4">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-zinc-500">
            <Badge variant="secondary">Study Mode</Badge>
            <span>{answeredCount} / {answers.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex justify-between items-center">
          <Link href="/practice" className="text-zinc-500 hover:text-white text-sm">← Exit</Link>
          {answeredCount === answers.length && (
            <Button onClick={() => setShowResults(true)} className="text-sm">
              Finish →
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {answers.map((aq, questionIndex) => (
            <Card key={aq.question.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex gap-2 text-xs text-zinc-500 mb-2">
                  <Badge variant="outline" className="border-zinc-700 text-zinc-400">Week {aq.question.week}</Badge>
                  <span>Q{questionIndex + 1}</span>
                </div>
                <CardTitle className="text-base leading-relaxed text-white">{aq.question.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {aq.question.options.map((option, optionIndex) => {
                  let optionStyle = 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 text-zinc-300';
                  
                  if (aq.showAnswer) {
                    if (optionIndex === aq.question.correctAnswer) {
                      optionStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
                    } else if (aq.selectedAnswer === optionIndex) {
                      optionStyle = 'border-red-500 bg-red-500/10 text-red-400';
                    }
                  } else if (aq.selectedAnswer === optionIndex) {
                    optionStyle = 'border-zinc-500 bg-zinc-800 text-white';
                  }

                  return (
                    <button
                      key={optionIndex}
                      onClick={() => !aq.showAnswer && handleSelectAnswer(questionIndex, optionIndex)}
                      disabled={aq.showAnswer}
                      className={`w-full p-3 text-left border-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${optionStyle} ${aq.showAnswer ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded bg-zinc-800 font-medium text-sm text-zinc-300">
                        {optionLabels[optionIndex]}
                      </span>
                      <span className="flex-1 text-sm">{option}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full flex items-center justify-center shadow-lg border border-zinc-700 transition-colors z-50"
            aria-label="Back to top"
          >
            ↑
          </button>
        )}
      </div>
    </main>
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0C0C0C] pt-16 flex items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    }>
      <StudyContent />
    </Suspense>
  );
}