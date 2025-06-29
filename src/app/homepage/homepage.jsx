'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

// Content Sections with SEO-Optimized Text
const sections = [
  {
    title: 'About AI Guru',
    content: `AI Guru is a cutting-edge AI-powered education platform revolutionizing how students learn. We provide instant doubt resolution, personalized learning paths, and comprehensive academic support. Our advanced AI tools, including the AI Math Solver and AI Counselor Bot, empower students to excel academically with tailored guidance and real-time solutions.`,
  },
  {
    title: 'Why Choose AI Guru?',
    list: [
      'Instant doubt resolution with our AI Question Solver for quick answers.',
      'Snap and solve: Upload a photo of any problem for real-time solutions.',
      'AI Counselor Bot offers personalized academic guidance and study tips.',
      'Auto-generated quizzes to assess knowledge and boost performance.',
    ],
  },
  {
    title: 'AI-Powered Services',
    list: [
      '🔍 AI Math Solver: Step-by-step explanations for complex math problems.',
      '📸 Image-Based Scanning: Capture or upload questions for instant answers.',
      '🤖 AI Counselor Bot: 24/7 academic support and personalized advice.',
      '📝 MCQ Test Generator: Create custom quizzes to enhance retention.',
    ],
  },
  {
    title: 'Benefits for Students',
    list: [
      'Personalized learning journeys tailored to individual needs.',
      '24/7 access to academic support from any device, anywhere.',
      'Real-time progress tracking with actionable insights for improvement.',
      'Smart tools that simplify complex concepts in seconds.',
    ],
  },
  {
    title: 'Exclusive Features',
    list: [
      '📷 Camera Integration: Capture queries instantly with your device.',
      '🖼️ Image Upload: Fast, accurate solutions for uploaded questions.',
      '💬 AI-Powered Chatbot: On-demand study tips and counseling.',
      '🧠 Dynamic Quiz Builder: Practice with quizzes designed for your level.',
    ],
  },
];

export default function homepage() {
  return (
    <div className="font-sans text-gray-800">
      

      {/* Hero Section */}
      <section className="bg-[#F3F0FF] py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">The magic of AI to help schools with saving time</h2>
          <p className="text-lg mb-6">The most loved, secure, and trusted AI platform for educators and students.</p>
          <div className="space-x-4">
            <button className="bg-[#8B5CF6] text-white px-6 py-3 rounded-md">Teachers sign up free</button>
            <button className="border border-[#8B5CF6] text-[#8B5CF6] px-6 py-3 rounded-md">Schools learn more</button>
          </div>
        </div>
      </section>

      {/* Injected AI Guru Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16">
        {sections.map((section, index) => (
          <motion.section
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            id={section.title.toLowerCase().replace(/\s/g, '-')}
            className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-blue-500 hover:border-pink-500 transition duration-300"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{section.title}</h2>
            {section.content && (
              <p className="text-lg text-gray-600 leading-relaxed mb-4">{section.content}</p>
            )}
            {section.list && (
              <ul className="list-none space-y-3">
                {section.list.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        ))}
      </div>

      {/* Footer CTA */}
      <section className="bg-[#8B5CF6] text-white py-16 text-center">
        <h2 className="text-2xl font-bold">Embrace responsible AI for schools</h2>
        <p className="mt-2">Join 5M+ educators using MagicSchool to differentiate, write IEPs, and improve student outcomes.</p>
        <button className="mt-4 bg-white text-[#8B5CF6] px-6 py-3 rounded-md font-semibold">Sign up Free</button>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F1F2E] text-white py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2">MagicSchool</h3>
            <p className="text-sm">The AI Operating System for Schools</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Resources</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#">Support</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Case Studies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Legal</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}