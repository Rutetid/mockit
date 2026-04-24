import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const RATE_LIMIT_MS = 2 * 60 * 1000;

const rateLimitMap = new Map<string, number>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const lastSubmit = rateLimitMap.get(ip);
  
  if (lastSubmit && (now - lastSubmit) < RATE_LIMIT_MS) {
    return false;
  }
  
  rateLimitMap.set(ip, now);
  return true;
}

function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [ip, timestamp] of rateLimitMap.entries()) {
    if (now - timestamp >= RATE_LIMIT_MS) {
      rateLimitMap.delete(ip);
    }
  }
}

setInterval(cleanupRateLimitMap, RATE_LIMIT_MS);

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { success: false, message: 'API not configured' },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { name, email, feedback } = await req.json();

    if (!name || !email || !feedback) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || 'unknown';

    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { success: false, message: 'Please wait 2 minutes before submitting again' },
        { status: 429 }
      );
    }

    const data = await resend.emails.send({
      from: 'MockIt Feedback <onboarding@resend.dev>',
      to: 'abhishekanand1164@gmail.com',
      subject: `New Feedback from ${name}`,
      html: `
        <h2>New Feedback Submitted</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Feedback:</strong></p>
        <p>${feedback.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send feedback' },
      { status: 500 }
    );
  }
}