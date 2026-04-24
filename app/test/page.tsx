'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Navbar } from '@/components/navbar';
import { Confetti } from '@/components/confetti';
import { questions as allQuestions } from '@/lib/questions';
import { Question } from '@/lib/types';

const optionLabels = ['A', 'B', 'C', 'D'];

interface AnsweredQuestion {
  question: Question;
  selectedAnswer: number | null;
}

function TestContent() {
  const searchParams = useSearchParams();
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted) {
      window.scrollTo(0, 0);
    }
  }, [submitted]);

  useEffect(() => {
    const weeksParam = searchParams.get('weeks');
    let filtered: Question[];
    if (weeksParam) {
      const weeks = weeksParam.split(',').map(Number);
      filtered = allQuestions.filter(q => weeks.includes(q.week));
    } else {
      filtered = allQuestions;
    }
    setQuizQuestions(filtered);
    setAnswers(filtered.map(q => ({ question: q, selectedAnswer: null })));
    setQuizStarted(true);
  }, [searchParams]);

  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => prev.map((a, i) => {
      if (i !== questionIndex) return a;
      return { ...a, selectedAnswer: answerIndex };
    }));
  };

  const handleSubmit = () => {
    const answered = answers.filter(a => a.selectedAnswer !== null).length;
    if (answered < answers.length) {
      setShowConfirmModal(true);
    } else {
      setSubmitted(true);
    }
  };

  const confirmSubmit = () => {
    setShowConfirmModal(false);
    setSubmitted(true);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleHome = () => {
    window.location.href = '/practice';
  };

  const correctCount = answers.filter(a => a.selectedAnswer === a.question.correctAnswer).length;
  const answeredCount = answers.filter(a => a.selectedAnswer !== null).length;
  const progress = answers.length > 0 ? (answeredCount / answers.length) * 100 : 0;
  const allAnswered = answeredCount === answers.length;

  if (submitted) {
    const percentage = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;
    const isPerfect = correctCount === answers.length;
    return (
      <div className="min-h-screen bg-[#0C0C0C]">
        <Confetti active={isPerfect} />
        <Navbar />
        <main className="pt-20 pb-12 px-4">
        <div ref={resultsRef} className="max-w-lg mx-auto space-y-6 pt-8">
          <Card className="bg-zinc-900 border-zinc-800 text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-white">Test Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="py-4">
                <div className={`text-6xl font-bold ${
                  percentage >= 90 ? 'text-emerald-400' :
                  percentage >= 70 ? 'text-blue-400' :
                  percentage >= 50 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {percentage}%
                </div>
                <div className="text-zinc-500 mt-2">{correctCount} / {answers.length} correct</div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleRetry} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white border-none">Try Again</Button>
                <Button onClick={handleHome} className="flex-1">Home</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {answers.map((aq, questionIndex) => {
              const isCorrect = aq.selectedAnswer === aq.question.correctAnswer;
              return (
                <Card key={aq.question.id} className={`${isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                  <CardContent className="py-4">
                    <div className="flex gap-2 text-xs text-zinc-500 mb-2">
                      <Badge variant="outline" className="border-zinc-700 text-zinc-400">Week {aq.question.week}</Badge>
                      <span>Q{questionIndex + 1}</span>
                      <Badge variant={isCorrect ? 'default' : 'destructive'} className="ml-auto">
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-white mb-2">{aq.question.question}</p>
                    <p className="text-sm text-zinc-400">
                      Your answer: <span className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>{aq.selectedAnswer !== null ? aq.question.options[aq.selectedAnswer] : 'Not answered'}</span>
                    </p>
                    {!isCorrect && aq.selectedAnswer !== null && (
                      <p className="text-sm text-emerald-400 mt-1">
                        Correct: {aq.question.options[aq.question.correctAnswer]}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
            <Badge variant="secondary">Test Mode</Badge>
            <span>{answeredCount} / {answers.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Incomplete?</DialogTitle>
              <DialogDescription>
                You have only answered {answers.filter(a => a.selectedAnswer !== null).length} out of {answers.length} questions.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                Go Back
              </Button>
              <Button onClick={confirmSubmit}>
                Submit Anyway
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex justify-between items-center">
          <Link href="/practice" className="text-zinc-500 hover:text-white text-sm">← Exit</Link>
          <Button onClick={handleSubmit} className="bg-white text-black hover:bg-zinc-200 text-sm">
            Submit
          </Button>
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
                  const isSelected = aq.selectedAnswer === optionIndex;
                  return (
                    <button
                      key={optionIndex}
                      onClick={() => handleSelectAnswer(questionIndex, optionIndex)}
                      className={`w-full p-3 text-left border-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        isSelected 
                          ? 'border-zinc-500 bg-zinc-800 text-white' 
                          : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 text-zinc-300'
                      }`}
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

        <div className="sticky bottom-4">
          <Button onClick={handleSubmit} className="w-full h-12 text-lg bg-white text-black hover:bg-zinc-200">
            Submit ({answeredCount}/{answers.length})
          </Button>
        </div>
      </div>
    </main>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0C0C0C] pt-16 flex items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    }>
      <TestContent />
    </Suspense>
  );
}