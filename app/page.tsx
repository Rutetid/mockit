'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';

const features = [
  {
    icon: '📖',
    title: 'Study Mode',
    description: 'Learn as you go with instant feedback after every answer. Perfect for understanding concepts.',
  },
  {
    icon: '✏️',
    title: 'Test Mode',
    description: 'Answer all questions and submit to see your score. Great for self-assessment.',
  },
  {
    icon: '🎯',
    title: 'Exam Mode',
    description: '50 random questions timed like the real exam. Test your readiness.',
  },
];

const stats = [
  { value: '12', label: 'Weeks' },
  { value: '120', label: 'Questions' },
  { value: '3', label: 'Modes' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0C0C0C] text-zinc-100">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(194,65,12,0.15),transparent_50%)]" />
          <div className="max-w-6xl mx-auto relative">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-block px-3 py-1 bg-[#C2410C] text-white text-xs font-medium tracking-wider uppercase rounded">
                  MOOC Exam Prep
                </div>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-[1.1]">
                  Master Your
                  <br />
                  <span className="text-[#C2410C]">Coursework</span>
                </h1>
                <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
                  Practice effectively with Study, Test, and Exam modes. 
                  Build confidence before the real exam.
                </p>
                <Link href="/practice">
                  <Button className="bg-[#C2410C] hover:bg-[#9A3412] text-white px-8 h-14 text-lg rounded-none">
                    Get Started →
                  </Button>
                </Link>
              </div>
              
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-orange-600/20 rounded-full blur-3xl" />
                <div className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="h-px bg-zinc-800" />
                    <div className="space-y-3">
                      <div className="h-4 bg-zinc-800 w-3/4 rounded" />
                      <div className="h-4 bg-zinc-800 w-full rounded" />
                      <div className="h-4 bg-zinc-800 w-5/6 rounded" />
                      <div className="h-px bg-zinc-800 my-4" />
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-12 bg-zinc-800 border border-zinc-700 rounded-lg" />
                        <div className="h-12 bg-zinc-800 border border-zinc-700 rounded-lg" />
                        <div className="h-12 bg-zinc-800 border border-zinc-700 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-zinc-800 bg-zinc-900/50">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-serif font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-zinc-500 mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                How It Works
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div 
                  key={i} 
                  className="group bg-zinc-900 border border-zinc-800 p-8 hover:border-[#C2410C] transition-all duration-300 rounded-xl"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24 bg-gradient-to-b from-zinc-900 to-black">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Ready to Start Practicing?
            </h2>
            <p className="text-zinc-400 text-lg">
              Select your weeks and choose a mode that fits your study goals.
            </p>
            <Link href="/practice">
              <Button className="bg-[#C2410C] hover:bg-[#9A3412] text-white px-10 h-14 text-lg rounded-none">
                Start Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto flex flex-col justify-between items-center gap-4">
            <div className="text-sm text-zinc-500">
              © 2026 MockIt. Practice tool for MOOC exams. Made with ❤️ by students, for students.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
