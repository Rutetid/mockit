# MockIt

A modern, mobile-friendly practice exam web application for course preparation.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)

## Features

- **Study Mode** - Practice with instant feedback as you answer each question
- **Test Mode** - Answer all questions and submit to see your results
- **Exam Mode** - Simulate the real exam with 50 random questions
- **120 Questions** - 12 weeks of content (10 questions per week)
- **Dark Theme** - Easy on the eyes, modern design
- **Mobile-Friendly** - Practice anywhere on any device

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mockit.git
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

## Project Structure

```
mockit/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Landing page
│   ├── practice/          # Week & mode selection
│   ├── study/             # Study mode
│   ├── test/              # Test mode
│   └── exam/              # Exam mode (50 questions)
├── components/
│   ├── navbar.tsx         # Navigation component
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── questions.ts       # Question bank (120 questions)
│   ├── types.ts           # TypeScript interfaces
│   └── utils.ts          # Utility functions
├── public/                # Static assets
└── package.json           # Dependencies
```

## Adding Questions

Questions are stored in `lib/questions.ts`. To add more questions:

```typescript
{
  id: "w1-q11",           // Unique ID (week-questionNumber)
  week: 1,                // Week number (1-12)
  question: "Your question text here?",
  options: ["A", "B", "C", "D"],  // 2-4 options
  correctAnswer: 0,       // Index of correct answer (0-3)
  explanation: "Brief explanation of the answer"
}
```

## Tech Stack

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Language**: TypeScript

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Course: Education for Sustainable Development
- Instructor: Prof. Atasi Mohanty
- Institution: IIT Kharagpur (MOOC)
