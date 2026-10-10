'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
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
  DEFAULT_SUBJECT_ID,
} from '@/lib/subjects';

type Mode = 'study' | 'test' | 'exam';

function PracticeContent() {
  const searchParams = useSearchParams();
  const [subjectId, setSubjectId] = useState<string>(DEFAULT_SUBJECT_ID);
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const subject = getSubject(subjectId);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen]);

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

          <Card className="bg-zinc-900 border-zinc-800 overflow-visible">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Select Subject</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="relative z-40" ref={dropdownRef}>
                <button
                  type="button"
                  id="subject-select"
                  onClick={() => setDropdownOpen(open => !open)}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  className="relative w-full h-12 px-4 pr-10 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm font-medium flex items-center gap-2 text-left hover:border-zinc-500 focus:outline-none focus:border-[#C2410C] transition-colors cursor-pointer"
                >
                  <span aria-hidden="true">{subject.icon}</span>
                  <span className="flex-1 truncate">{subject.title}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <ul
                    role="listbox"
                    aria-label="Select subject"
                    className="absolute left-0 right-0 top-full mt-2 z-40 rounded-xl border border-zinc-700 bg-zinc-800 shadow-2xl shadow-black/50 overflow-hidden"
                  >
                    {subjects.map((s, index) => {
                      const isSelected = s.id === subjectId;
                      return (
                        <li key={s.id}>
                          {index > 0 && <div className="h-px bg-zinc-700/60" />}
                          <button
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              handleSelectSubject(s.id);
                              setDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                              isSelected ? 'bg-[#C2410C]/10' : 'hover:bg-zinc-700/40'
                            }`}
                          >
                            <span className="text-lg" aria-hidden="true">{s.icon}</span>
                            <span className="flex-1 min-w-0">
                              <span className={`block text-sm font-medium ${isSelected ? 'text-[#F97316]' : 'text-white'}`}>
                                {s.title}
                              </span>
                              <span className="block text-xs text-zinc-500">
                                {s.questions.length} questions
                              </span>
                            </span>
                            {isSelected && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-[#F97316] flex-shrink-0"
                                aria-hidden="true"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <p className="text-xs text-zinc-500">
                {subject.questions.length} questions · Weeks {availableWeeks[0]}–{availableWeeks[availableWeeks.length - 1]}
              </p>
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
