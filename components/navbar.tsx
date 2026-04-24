'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-serif font-bold text-white tracking-tight"
        >
          MockIt
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/feedback"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Feedback
          </Link>
          <Link
            href="/practice"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Practice
          </Link>
        </div>
      </div>
    </nav>
  );
}
