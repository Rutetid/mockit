'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';

type Mode = 'study' | 'test' | 'exam';

function PracticeContent() {
  const searchParams = useSearchParams();
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

  useEffect(() => {
    const weeksParam = searchParams.get('weeks');
    if (weeksParam) {
      setSelectedWeeks(weeksParam.split(',').map(Number));
    }
  }, [searchParams]);

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

  const selectAll = () => {
    setSelectedWeeks([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  };

  const clearAll = () => {
    setSelectedWeeks([]);
  };

  const handleStart = () => {
    if (!selectedMode) return;
    if (selectedMode === 'exam') {
      window.location.href = '/exam';
    } else {
      const params = selectedWeeks.length > 0 ? `?weeks=${selectedWeeks.join(',')}` : '';
      window.location.href = `/${selectedMode}${params}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-zinc-100">
      <Navbar />
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center py-6 border-b border-zinc-800">
            <p className="text-sm text-zinc-500">MOOC Course</p>
            <h1 className="text-lg font-semibold text-white mt-1">
              Education for Sustainable Development
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              By Prof. Atasi Mohanty | IIT Kharagpur
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
              <span>✨</span>
              <span>All the best for your MOOC Exams!</span>
              <span>✨</span>
            </div>
          </div>

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
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(week => (
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
