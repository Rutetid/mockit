'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Navbar } from '@/components/navbar';

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !feedback.trim()) {
      setStatus('error');
      setMessage('Please fill all fields');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, feedback }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage('Thank you for your feedback!');
        setName('');
        setEmail('');
        setFeedback('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-zinc-100">
      <Navbar />
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center py-6 border-b border-zinc-800">
            <h1 className="text-xl font-semibold text-white">Give Feedback or Report Errors</h1>
          </div>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    disabled={status === 'loading'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    disabled={status === 'loading'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Feedback</label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what you think or report any errors..."
                    className="min-h-[120px] bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 resize-none"
                    disabled={status === 'loading'}
                  />
                </div>

                {message && (
                  <div className={`p-3 rounded-lg text-sm ${
                    status === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                    status === 'error' ? 'bg-red-500/10 text-red-400' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {message}
                  </div>
                )}

                <Button 
                  type="submit"
                  className="w-full h-11 bg-white text-black hover:bg-zinc-200"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}