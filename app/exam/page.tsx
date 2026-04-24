'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/navbar';
import { Confetti } from '@/components/confetti';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getRandomQuestions } from '@/lib/questions';
import { Question } from '@/lib/types';
import { shuffleArray, shuffleOptions, type ShuffledOption } from '@/lib/utils';

const optionLabels = ['A', 'B', 'C', 'D'];

interface AnsweredQuestion {
  question: Question;
  selectedAnswer: number | null;
  shuffledOptions: ShuffledOption[];
}

export default function ExamPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted) {
      window.scrollTo(0, 0);
    }
  }, [submitted]);

  const handleStart = () => {
    const questions = getRandomQuestions(75);
    setQuizQuestions(questions);
    setAnswers(questions.map(q => ({ 
      question: q, 
      selectedAnswer: null,
      shuffledOptions: shuffleOptions(q.options, q.correctAnswer, q.noShuffle)
    })));
    setQuizStarted(true);
  };

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
    setAnswers(prev => prev.map(a => ({ 
      ...a, 
      selectedAnswer: null,
      shuffledOptions: shuffleOptions(a.question.options, a.question.correctAnswer)
    })));
    setSubmitted(false);
  };

  const handleRetryWrong = () => {
    const wrongQuestions = answers.filter(a => {
      const correctIndex = a.shuffledOptions.findIndex(o => o.isCorrect);
      return a.selectedAnswer !== correctIndex;
    }).map(a => a.question);
    setQuizQuestions(wrongQuestions);
    setAnswers(wrongQuestions.map(q => ({ 
      question: q, 
      selectedAnswer: null,
      shuffledOptions: shuffleOptions(q.options, q.correctAnswer, q.noShuffle)
    })));
    setSubmitted(false);
  };

  const handleHome = () => {
    window.location.href = '/practice';
  };

  const correctCount = answers.filter(a => {
    const correctIndex = a.shuffledOptions.findIndex(o => o.isCorrect);
    return a.selectedAnswer === correctIndex;
  }).length;
  const answeredCount = answers.filter(a => a.selectedAnswer !== null).length;
  const progress = (answeredCount / answers.length) * 100;
  const allAnswered = answeredCount === answers.length;

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-[#0C0C0C]">
        <Navbar />
        <main className="pt-20 pb-12 px-4">
        <div className="max-w-md mx-auto space-y-6">
          <Link href="/practice" className="text-zinc-500 hover:text-white text-sm">← Back</Link>

          <div/>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">🎯 Exam Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-white">75</div>
                <div className="text-zinc-500 mt-2">Questions</div>
                <p className="text-sm text-zinc-400 mt-4">Questions will be randomly selected from all available questions</p>
              </div>

              <Button onClick={handleStart} className="w-full h-12 text-lg bg-[#C2410C] hover:bg-[#9A3412]">
                Start Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      </div>
    );
  }

  if (submitted) {
    const percentage = Math.round((correctCount / answers.length) * 100);
    const isPerfect = correctCount === answers.length;
    return (
      <div className="min-h-screen bg-[#0C0C0C]">
        <Confetti active={isPerfect} />
        <Navbar />
        <main className="pt-20 pb-12 px-4">
        <div ref={resultsRef} className="max-w-lg mx-auto space-y-6 pt-8">
          <Card className="bg-zinc-900 border-zinc-800 text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-white">Exam Complete!</CardTitle>
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
                {correctCount < answers.length && (
                  <Button onClick={handleRetryWrong} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white border-none active:scale-95 transition-all">
                    Retry Wrong ({answers.length - correctCount})
                  </Button>
                )}
                <Button onClick={handleRetry} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white border-none active:scale-95 transition-all">Try Again</Button>
                <Button onClick={handleHome} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white border-none active:scale-95 transition-all">Home</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {answers.map((aq, questionIndex) => {
              const correctIndex = aq.shuffledOptions.findIndex(o => o.isCorrect);
              const isCorrect = aq.selectedAnswer === correctIndex;
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
                      Your answer: <span className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                        {aq.selectedAnswer !== null ? aq.shuffledOptions[aq.selectedAnswer].text : 'Not answered'}
                      </span>
                    </p>
                    {!isCorrect && aq.selectedAnswer !== null && (
                      <p className="text-sm text-emerald-400 mt-1">
                        Correct: {aq.shuffledOptions[correctIndex].text}
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
        <div className="sticky top-16 bg-[#0C0C0C] -mx-4 px-4 py-3 space-y-2 border-b border-zinc-800 z-40">
          <div className="flex justify-between text-sm text-zinc-500">
            <Badge variant="secondary">Exam Mode</Badge>
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
                {aq.shuffledOptions.map((option, optionIndex) => {
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
                      <span className="flex-1 text-sm">{option.text}</span>
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