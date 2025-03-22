import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "AI Guru - AI Learning Assistant",
  description: "Explore AI in education with the best free AI tools for students. Get AI for research papers, plagiarism checking, and smart study solutions for better learning!",
  keywords: "ai in education, education in ai, ai on education, best ai tool for students, free ai tools for students, ai for research papers, ai plagiarism checker free, ai research papers",
  author: "D. Raju Rao",
  robots: "index, follow",
  openGraph: {
    title: "AI Guru - AI Learning Assistant",
    description: "Explore AI in education with the best free AI tools for students. Get AI for research papers, plagiarism checking, and smart study solutions for better learning!",
    url: "https://aiguru.vercel.app/",
    type: "website",
    images: [
      {
        url: "https://aiguru.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Guru",
      },
    ],
  },
};

const geist = Geist({ subsets: ["latin"], weight: "400" });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
