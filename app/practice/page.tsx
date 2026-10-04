'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import {
  subjects,
  getSubject,
  getSubjectWeeks,
  resolveSubjectId,
  storeSubjectId,
} from '@/lib/subjects';

type Mode = 'study' | 'test' | 'exam';

function PracticeContent() {
  const searchParams = useSearchParams();
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

  const subject = getSubject(subjectId);

  useEffect(() => {
    const resolved = resolveSubjectId(searchParams.get('subject'));
    setSubjectId(resolved);
    const weeks = getSubjectWeeks(getSubject(resolved));
    const weeksParam = searchParams.get('weeks');
    if (weeksParam) {
      setSelectedWeeks(weeksParam.split(',').map(Number).filter(w => weeks.includes(w)));
    }
  }, [searchParams]);

  const handleSelectSubject = (id: string) => {
    if (id === subjectId) return;
    const available = getSubjectWeeks(getSubject(id));
    setSubjectId(id);
    storeSubjectId(id);
    setSelectedWeeks(prev => prev.filter(w => available.includes(w)));
  };

  const toggleWeek = (week: number) => {
    if (selectedMode === 'exam') return;
    setSelectedWeeks(prev =>
      prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week].sort((a, b) => a - b)
    );
  };

  const handleSelectMode = (mode: Mode) => {
    if (mode === 'exam') {
      setSelectedWeeks([]);
    }
    setSelectedMode(mode);
  };

  const availableWeeks = getSubjectWeeks(subject);

  const selectAll = () => {
    setSelectedWeeks(availableWeeks);
  };

  const clearAll = () => {
    setSelectedWeeks([]);
  };

  const handleStart = () => {
    if (!selectedMode || !subjectId) return;
    const params = new URLSearchParams();
    params.set('subject', subjectId);
    if (selectedMode !== 'exam' && selectedWeeks.length > 0) {
      params.set('weeks', selectedWeeks.join(','));
    }
    const query = params.toString();
    const path = selectedMode === 'exam' ? 'exam' : selectedMode;
    window.location.href = `/${path}?${query}`;
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-zinc-100">
      <Navbar />
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center py-6 border-b border-zinc-800">
            <p className="text-sm text-zinc-500">MOOC Course</p>
            <h1 className="text-lg font-semibold text-white mt-1">
              {subject.title}
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              {subject.subtitle}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
              <span>✨</span>
              <span>All the best for your MOOC Exams!</span>
              <span>✨</span>
            </div>
          </div>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Select Subject</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {subjects.map(s => {
                const isSelected = s.id === subjectId;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSubject(s.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-[#C2410C] bg-[#C2410C]/10'
                        : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-sm font-medium text-white leading-snug">{s.title}</div>
                    <div className="text-xs text-zinc-500 mt-1">{s.questions.length} questions</div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className={`bg-zinc-900 border-zinc-800 ${selectedMode === 'exam' ? 'opacity-50' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-white">Select Weeks</CardTitle>
                {selectedMode !== 'exam' && (
                  <div className="flex gap-2 text-xs">
                    <button onClick={selectAll} className="text-zinc-500 hover:text-white">Select All</button>
                    <span className="text-zinc-700">|</span>
                    <button onClick={clearAll} className="text-zinc-500 hover:text-white">Clear</button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {availableWeeks.map(week => (
                  <Button
                    key={week}
                    variant={selectedWeeks.includes(week) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleWeek(week)}
                    disabled={selectedMode === 'exam'}
                    className={`h-10 ${selectedWeeks.includes(week) ? 'bg-[#C2410C] hover:bg-[#9A3412]' : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                  >
                    {week}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-zinc-900 border-zinc-800 ${selectedMode === 'exam' ? 'bg-zinc-900/50 border-zinc-800/50' : ''}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Select Mode</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSelectMode('study')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedMode === 'study'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                <div className="text-2xl mb-1">📖</div>
                <div className="text-sm font-medium text-white">Study</div>
                <div className="text-xs text-zinc-500">Instant feedback</div>
              </button>

              <button
                onClick={() => handleSelectMode('test')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedMode === 'test'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                <div className="text-2xl mb-1">✏️</div>
                <div className="text-sm font-medium text-white">Test</div>
                <div className="text-xs text-zinc-500">Score at end</div>
              </button>

              <button
                onClick={() => handleSelectMode('exam')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedMode === 'exam'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-sm font-medium text-white">Exam</div>
                <div className="text-xs text-zinc-500">75 questions</div>
              </button>
            </CardContent>
          </Card>

          <Button
            onClick={handleStart}
            className="w-full h-12 text-lg bg-[#C2410C] hover:bg-[#9A3412]"
            disabled={!selectedMode}
          >
            Start {selectedMode ? selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1) : ''}
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0C0C0C] pt-16 flex items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    }>
      <PracticeContent />
    </Suspense>
  );
}
