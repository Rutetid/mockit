# MockIt

A modern, mobile-friendly practice exam web application for MOOC exam preparation.

## Features

- **Multiple Subjects** - Switch between MOOC courses; your last choice is remembered on every visit (even on mobile, after closing the browser)
- **Study Mode** - Practice with instant feedback as you answer each question
- **Test Mode** - Answer all questions and submit to see your results
- **Exam Mode** - Simulate the real exam with 75 random questions
- **240+ Questions** - 10 questions per week across all available weeks
- **Dark Theme** - Easy on the eyes, modern design
- **Mobile-Friendly** - Practice anywhere on any device

### Subjects

| Subject | Id | Questions | Weeks |
|---|---|---|---|
| Education for Sustainable Development | `esd` | 130 | 0–12 |
| Psychology of Learning | `pol` | 110 | 0–10 (11–12 pending) |

## Getting Started

### Prerequisites

- Node.js 20.9+ (required by Next.js 16)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Rutetid/mockit.git
cd mockit

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project Structure

```
mockit/
├── app/                     # Next.js app router pages
│   ├── page.tsx             # Landing page
│   ├── practice/            # Subject, week & mode selection
│   ├── study/               # Study mode
│   ├── test/                # Test mode
│   ├── exam/                # Exam mode (75 questions)
│   ├── feedback/            # Feedback form
│   └── api/feedback/        # Feedback API route (email via Resend)
├── components/
│   ├── navbar.tsx           # Navigation component
│   ├── confetti.tsx         # Perfect-score confetti
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── subjects.ts          # Subject registry + persistence helpers
│   ├── questions/
│   │   ├── esd.ts           # Education for Sustainable Development bank
│   │   └── pol.ts           # Psychology of Learning bank (imports Pol.json)
│   ├── Pol.json             # Psychology of Learning questions (JSON)
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # Shuffle & utility functions
├── public/                  # Static assets (avatar.jpg, favicon)
└── package.json             # Dependencies
```

## Subjects

Subjects are registered in `lib/subjects.ts`:

```typescript
{
  id: 'pol',
  title: 'Psychology of Learning',
  subtitle: 'By Prof. Atasi Mohanty | IIT Kharagpur',
  icon: '🧠',
  questions: polQuestions,
}
```

The selected subject is stored in `localStorage` (`mockit.subject`) and reused
automatically the next time the app is opened. A `?subject=<id>` URL parameter
overrides it.

## Adding Questions

### Psychology of Learning (`lib/Pol.json`)

Append to the JSON array. Weeks are derived from the data, so new weeks appear
in the UI automatically — no code changes needed:

```json
{
  "id": "w11-q1",
  "week": 11,
  "question": "Your question text here?",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": ""
}
```

### Education for Sustainable Development (`lib/questions/esd.ts`)

Same shape, in TypeScript:

```typescript
{
  id: "w1-q11",           // Unique ID (week-questionNumber)
  week: 1,                // Week number
  question: "Your question text here?",
  options: ["A", "B", "C", "D"],  // 2-4 options
  correctAnswer: 0,       // Index of correct answer (0-based)
  explanation: "Brief explanation of the answer",
  noShuffle: false        // Optional: keep option order fixed
}
```

### Adding a whole new subject

1. Create `lib/questions/<id>.ts` exporting a `Question[]` (JSON import works too).
2. Add an entry to `subjects` in `lib/subjects.ts`.
3. Done — subject cards, week grid, persistence, and all three modes pick it up.

## Tech Stack

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (Base UI)
- **Icons**: Lucide React
- **Language**: TypeScript

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Courses: Education for Sustainable Development · Psychology of Learning
- Instructor: Prof. Atasi Mohanty
- Institution: IIT Kharagpur (MOOC)
