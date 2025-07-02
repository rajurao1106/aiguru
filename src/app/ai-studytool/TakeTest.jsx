"use client";

import React, { useEffect, useState } from "react";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA31o-dTbqh99GFesdP1ePILTiV4TvXVSE`; // 👈 working public test key

export default function TakeTest({ topic, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const callGemini = async (prompt) => {
    try {
      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      const data = await res.json();
      console.log("Gemini Response:", data); // 👈 see what's returned

      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "❌ Gemini did not return any questions."
      );
    } catch (error) {
      console.error("❌ API error:", error);
      return "❌ Failed to reach Gemini API.";
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const prompt = `You are a test maker. Create 10 numbered basic test questions on the topic "${topic}". Format clearly like:\n1. What is ...?\n2. Explain ...\n3. How does ...`;

      const responseText = await callGemini(prompt);
      const list = responseText
        .split("\n")
        .filter((line) => line.trim().match(/^\d+\./)); // Ensure valid numbered lines

      if (list.length > 0) {
        setQuestions(list);
      } else {
        setQuestions(["❌ Gemini did not return valid questions. Try another topic."]);
      }

      setLoading(false);
    };

    fetchQuestions();
  }, [topic]);

  const handleSubmit = async () => {
    const evalPrompt = `Evaluate the following test answers on the topic "${topic}". Give total marks out of 10 with answer.\n\n${questions
      .map(
        (q, i) => `Q${i + 1}: ${q}\nAnswer: ${answers[i] || "No answer provided"}`
      )
      .join("\n\n")}`;

    const responseText = await callGemini(evalPrompt);
    setResult(responseText);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6  h-[43rem]  max-xl:mt-[4rem] custom-scrollbar">
      {/* <h2 className="text-2xl font-bold text-blue-600 text-center">
        🧪 Test on: {topic}
      </h2> */}
      <button onClick={onBack}>Back</button>

      {loading ? (
        <p className="text-gray-500 text-center">⏳ Generating questions...</p>
      ) : (
        <>
          {questions.map((q, i) => (
            <div key={i}>
              <p className="font-medium mb-1">{q}</p>
              <textarea
                rows={3}
                className="w-full p-2 border rounded mb-4"
                placeholder="Write your answer here..."
                value={answers[i] || ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [i]: e.target.value }))
                }
              />
            </div>
          ))}

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              ✅ Submit Test
            </button>
            <button
              onClick={onBack}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              🔙 Back
            </button>
          </div>

          {result && (
            <div className=" p-4 mt-6 rounded">
              <h3 className="font-semibold mb-2">📊 Test Result:</h3>
              <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
