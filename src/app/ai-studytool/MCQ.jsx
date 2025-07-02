"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const MCQApp = ({ onBack }) => {
  const [topic, setTopic] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [error, setError] = useState(null);

  const generateMCQs = useCallback(async () => {
    if (!topic) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Generate 10 multiple-choice questions (MCQs) on the topic "${topic}". Each question must follow this exact format:

Question: [question]
A) Option A
B) Option B
C) Option C
D) Option D
Correct Answer: [A/B/C/D]

Do not include explanations, numbering, or extra formatting.`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      const mcqsRaw = text
        .split(/Question:/)
        .map((chunk) => "Question:" + chunk.trim())
        .filter((x) => x.length > 30)
        .map((mcqText) => {
          const lines = mcqText.split("\n").map((l) => l.trim());
          const mcq = { question: "", options: {}, correctAnswer: "" };

          lines.forEach((line) => {
            if (line.startsWith("Question:")) mcq.question = line.slice(9).trim();
            else if (/^[A-D]\)/.test(line)) {
              const [key, ...rest] = line.split(")");
              mcq.options[key.trim()] = rest.join(")").trim();
            } else if (line.startsWith("Correct Answer:")) {
              mcq.correctAnswer = line.split(":")[1].trim();
            }
          });

          return mcq;
        });

      setMcqs(mcqsRaw);
    } catch (err) {
      console.error("MCQ generation error:", err);
      setError("⚠️ " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  useEffect(() => {
    const saved = localStorage.getItem("mcqTopic");
    if (saved) {
      setTopic(saved.slice(0, 150));
    }
  }, []);

  const handleStart = () => {
    setQuizStarted(true);
    generateMCQs();
  };

  const handleSubmit = () => {
    const current = mcqs[currentIndex];
    if (!selectedOption) return;
    if (selectedOption === current.correctAnswer) setScore((s) => s + 1);

    setUserAnswers((prev) => [
      ...prev,
      {
        question: current.question,
        correct: current.correctAnswer,
        selected: selectedOption,
        options: current.options
      }
    ]);

    setSelectedOption("");
    const next = currentIndex + 1;
    if (next < mcqs.length) setCurrentIndex(next);
    else setFinished(true);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto overflow-y-scroll custom-scrollbar h-[43rem] max-xl:mt-[4rem]">
      <button
        onClick={onBack}
        className="mb-4 bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300 text-sm"
      >
        🔙 Back to Chat
      </button>

      {!quizStarted ? (
        <div className="text-center mt-10">
          <h2 className="text-xl font-bold mb-4"> Practice MCQs</h2>
          {/* <p className="text-sm text-gray-600 mb-2">Topic: <strong>{topic}</strong></p> */}
          <button
            onClick={handleStart}
            className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600"
          >
            Start Quiz
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <Loader className="animate-spin mb-3" />
          <p className="text-sm text-gray-500">Generating questions...</p>
        </div>
      ) : finished ? (
        <div className="text-left">
          <h2 className="text-2xl font-bold text-center">🎉 Quiz Finished</h2>
          <p className="text-lg mt-3 text-center">Your Score: {score} / {mcqs.length}</p>

          <h3 className="mt-6 text-xl font-semibold">❌ Wrong Answers Only</h3>

          <div className="mt-4 space-y-6">
            {userAnswers
              .filter((item) => item.selected !== item.correct)
              .map((item, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-white shadow-sm"
                >
                  <p className="font-medium text-red-700 mb-2">
                    {index + 1}. {item.question}
                  </p>
                  <ul className="space-y-1 ml-4">
                    {Object.entries(item.options).map(([key, value]) => {
                      const isCorrect = key === item.correct;
                      const isSelected = key === item.selected;

                      return (
                        <li
                          key={key}
                          className={`p-1 rounded ${
                            isCorrect
                              ? "text-green-700 font-semibold"
                              : isSelected
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {key}) {value}
                          {isSelected && " ⬅️ Your Answer"}
                          {isCorrect && !isSelected && " ✅ Correct Answer"}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-700 mb-2">
            Question {currentIndex + 1} / {mcqs.length}
          </p>
          <h3 className="font-bold mb-2">{mcqs[currentIndex].question}</h3>
          <div className="space-y-2 mb-4">
            {Object.entries(mcqs[currentIndex].options).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="mcq"
                  value={key}
                  checked={selectedOption === key}
                  onChange={() => setSelectedOption(key)}
                />
                {key}) {value}
              </label>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Answer
          </button>
          {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
        </>
      )}
    </div>
  );
};

export default MCQApp;
