import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function About() {
  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-8 lg:px-20 bg-white">
      {/* Animated Background Blob */}
      <motion.div
        className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-blue-100 rounded-full filter blur-3xl opacity-60 z-0"
        animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-purple-100 rounded-full filter blur-2xl opacity-50 z-0"
        animate={{ x: [0, -30, 30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <div className="flex justify-center items-center gap-2 mb-6">
          <Sparkles className="text-blue-600" size={28} />
          <h2 className="text-4xl font-extrabold text-gray-900">
            About DigiNote
          </h2>
        </div>
        <p className="text-lg text-gray-700 mt-4 leading-relaxed">
          <strong>DigiNote</strong> is your all-in-one AI notes maker designed
          for students, professionals, educators, researchers, and creators.
          Instantly generate study notes, flashcards, proposals, reports, and
          even speech outlines with ease.
        </p>
        <p className="text-lg text-gray-700 mt-4 leading-relaxed">
          Whether you're working on assignments, preparing for quizzes, or
          looking for fresh creative inspiration, <strong>DigiNote</strong>{" "}
          boosts your productivity with AI-powered precision.
        </p>
      </motion.div>
    </section>
  );
}
