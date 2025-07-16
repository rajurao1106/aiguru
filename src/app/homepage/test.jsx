"use client";

import React from "react";
import { motion } from "framer-motion";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

// Content Sections with SEO-Optimized Text
const sections = [
  {
    title: "Discover DigiNote",
    content: `DigiNote transforms education with cutting-edge AI tools. Our platform offers instant doubt resolution, personalized learning paths, and real-time academic support. From AI Math Solvers to Counselor Bots, we empower students and educators to achieve excellence with tailored, secure solutions.`,
  },
  {
    title: "Why DigiNote Stands Out",
    list: [
      "Instant answers with our AI Question Solver for all subjects.",
      "Snap & Solve: Upload problem images for quick, accurate solutions.",
      "AI Counselor Bot provides 24/7 personalized study guidance.",
      "Auto-generated quizzes to boost retention and track progress.",
    ],
  },
  {
    title: "Advanced AI Tools",
    list: [
      "🔍 AI Math Solver: Clear, step-by-step solutions for math challenges.",
      "📸 Image Scanning: Upload or capture questions for instant answers.",
      "🤖 AI Counselor Bot: Round-the-clock academic and study support.",
      "📝 Quiz Generator: Custom quizzes tailored to your learning level.",
    ],
  },
  {
    title: "Student Success Benefits",
    list: [
      "Customized learning paths for every student's unique needs.",
      "Access support anytime, anywhere, on any device.",
      "Real-time insights to track and improve academic performance.",
      "Simplified complex concepts with smart, AI-driven tools.",
    ],
  },
  {
    title: "Unique AI Features",
    list: [
      "📷 Camera Integration: Instantly capture and solve queries.",
      "🖼️ Image Upload: Fast solutions for uploaded questions.",
      "💬 AI Chatbot: On-demand academic advice and study tips.",
      "🧠 Dynamic Quizzes: Practice塞尔, Practice with tailored assessments.",
    ],
  },
];

export default function Homepage() {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16">
        {sections.map((section, index) => (
          <motion.section
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            id={section.title.toLowerCase().replace(/\s/g, "-")}
            className="bg-white rounded-2xl p-8 shadow-md border-l-4 border-purple-600 hover:shadow-lg transition-all duration-300"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            {section.content && (
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4">
                {section.content}
              </p>
            )}
            {section.list && (
              <ul className="list-none space-y-4">
                {section.list.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600 text-base sm:text-lg">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        ))}
      </div>

      {/* Footer CTA */}
      <section className="bg-purple-700 text-white py-16 text-center">
        <motion.h2
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-2xl sm:text-3xl font-thin mb-4"
        >
          Transform Education with DigiNote
        </motion.h2>
        <motion.p
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-base sm:text-lg mb-6 max-w-2xl mx-auto"
        >
          Join over 5 million educators and students using DigiNote to
          streamline learning and improve outcomes with responsible AI.
        </motion.p>
        <motion.button
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-white text-purple-700 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-purple-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-700"
          aria-label="Sign up for free"
        >
          Get Started Free
        </motion.button>
      </section>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-4">
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} DigiNote. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
