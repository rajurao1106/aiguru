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
    title: "About DigiNote",
    content: `DigiNote is a cutting-edge AI-powered education platform revolutionizing how students learn. We provide instant doubt resolution, personalized learning paths, and comprehensive academic support. Our advanced AI tools, including the AI Math Solver and AI Counselor Bot, empower students to excel academically with tailored guidance and real-time solutions.`,
  },
  {
    title: "Why Choose DigiNote?",
    list: [
      "Instant doubt resolution with our AI Question Solver for quick answers.",
      "Snap and solve: Upload a photo of any problem for real-time solutions.",
      "AI Counselor Bot offers personalized academic guidance and study tips.",
      "Auto-generated quizzes to assess knowledge and boost performance.",
    ],
  },
  {
    title: "AI-Powered Services",
    list: [
      "🔍 AI Math Solver: Step-by-step explanations for complex math problems.",
      "📸 Image-Based Scanning: Capture or upload questions for instant answers.",
      "🤖 AI Counselor Bot: 24/7 academic support and personalized advice.",
      "📝 MCQ Test Generator: Create custom quizzes to enhance retention.",
    ],
  },
  {
    title: "Benefits for Students",
    list: [
      "Personalized learning journeys tailored to individual needs.",
      "24/7 access to academic support from any device, anywhere.",
      "Real-time progress tracking with actionable insights for improvement.",
      "Smart tools that simplify complex concepts in seconds.",
    ],
  },
  {
    title: "Exclusive Features",
    list: [
      "📷 Camera Integration: Capture queries instantly with your device.",
      "🖼️ Image Upload: Fast, accurate solutions for uploaded questions.",
      "💬 AI-Powered Chatbot: On-demand study tips and counseling.",
      "🧠 Dynamic Quiz Builder: Practice with quizzes designed for your level.",
    ],
  },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">DigiNote</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="#home"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                About
              </a>
              <a
                href="#services"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Services
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Contact
              </a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-24 pb-16 bg-gradient-to-br from-blue-600 to-pink-500 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-extrabold mb-4"
          >
            Learn Smarter with DigiNote
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl mb-6"
          >
            Discover the ultimate AI-powered education platform for instant
            doubt solving, personalized learning, and academic success.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Start Learning Now
          </motion.button>
        </div>
      </section>

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
            className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-blue-500 hover:border-pink-500 transition duration-300"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {section.title}
            </h2>
            {section.content && (
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                {section.content}
              </p>
            )}
            {section.list && (
              <ul className="list-none space-y-3">
                {section.list.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DigiNote</h3>
              <p className="text-gray-300">
                Empowering students with AI-driven tools for smarter, faster,
                and personalized learning experiences.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#about"
                    className="text-gray-300 hover:text-white transition"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-300 hover:text-white transition"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-300 hover:text-white transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-300">Email: rajurao1106@gmail.com</p>
              <p className="text-gray-300">Phone: 7470578442</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            © {new Date().getFullYear()} DigiNote. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
