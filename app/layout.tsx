import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReactNode } from "react";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MockIt - Practice Exams",
  description:
    "A modern practice exam app for MOOC courses. Study mode, test mode, and exam mode with 75 random questions. Prepare for your exams effectively.",
  keywords: ["practice exam", "MOOC", "study", "test", "education", "quiz"],
  authors: [{ name: "Abhishek" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "MockIt - Practice Exams",
    description:
      "A modern practice exam app for MOOC courses. Study mode, test mode, and exam mode with 75 random questions.",
    type: "website",
    siteName: "MockIt",
  },
  twitter: {
    card: "summary_large_image",
    title: "MockIt - Practice Exams",
    description:
      "A modern practice exam app for MOOC courses. Study mode, test mode, and exam mode with 75 random questions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50">
        {children}
        <Analytics />
        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}