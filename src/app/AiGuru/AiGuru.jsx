"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Loader } from "lucide-react";
import { FaArrowUp } from "react-icons/fa6";
import { IoCreateOutline } from "react-icons/io5";


const QuestionAnyTopic = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [answerHistory, setAnswerHistory] = useState([]); // New state for answer history
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [definition, setDefinition] = useState("");
  const [inputMode, setInputMode] = useState("topic");
  const [height, setHeight] = useState(false);
  const [titleName, setTitleName] = useState(false)

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const speakText = (text) => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    synth.speak(speech);
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/__([^_]+)__/g, "<u>$1</u>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/`([^`]+)`/g, "<code class='bg-gray-700 p-1 rounded'>$1</code>")
      .replace(/### (.*?)\n/g, "<h3 class='text-xl font-semibold'>$1</h3>")
      .replace(/## (.*?)\n/g, "<h2 class='text-2xl font-bold'>$1</h2>")
      .replace(/# (.*?)\n/g, "<h1 class='text-3xl font-extrabold'>$1</h1>")
      .replace(/\n- (.*?)\n/g, "<ul class='list-disc ml-5'><li>$1</li></ul>")
      .replace(
        /\n\d+\. (.*?)\n/g,
        "<ol class='list-decimal ml-5'><li>$1</li></ol>"
      )
      .replace(
        /\n>\s(.*?)\n/g,
        "<blockquote class='border-l-4 border-blue-500 pl-4 italic'>$1</blockquote>"
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        "<a href='$2' class='text-blue-400 underline'>$1</a>"
      )
      .replace(/\n/g, "<br>");
  };

  const fetchDefinition = useCallback(async () => {
    if (!input.trim()) {
      setError("⚠️ Please enter a topic.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setInputMode("answer");
    setChatHistory([]); // Clear previous questions when new topic is set
    setAnswerHistory([]); // Clear answer history when new topic is set
    setHeight(true);
    setTitleName(true)

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: `Define ${input}` }] }],
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch definition.");
      const data = await res.json();
      const aiDefinition =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "Definition not found.";
      setDefinition(aiDefinition);
      speakText(aiDefinition);
      setInput("");
    } catch (error) {
      setError(`⚠️ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  const fetchAIQuestion = useCallback(async () => {
    if (!definition) return;
    setError(null);
    setIsLoading(true);

    try {
      const pastQuestions = chatHistory
        .filter((msg) => msg.role === "assistant")
        .map((msg) => msg.text)
        .join("\n");
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Create a short interview question based on '${definition}' that hasn't been asked before. Previous questions: ${pastQuestions}`,
                  },
                ],
              },
            ],
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch question.");
      const data = await res.json();
      const aiQuestion =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "No question available.";
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", text: aiQuestion },
      ]);
      speakText(aiQuestion);
    } catch (error) {
      setError(`⚠️ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [definition, chatHistory]);

  const checkAnswer = async () => {
    if (!chatHistory.length || !input.trim()) return;

    try {
      const latestQuestion = chatHistory[chatHistory.length - 1].text;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Evaluate:
                    Question: ${latestQuestion}
                    Answer: ${input}
                    Respond with 'It is correct.' if correct, or 'It is not correct' with the correct answer if wrong.`,
                  },
                ],
              },
            ],
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to validate answer.");
      const data = await res.json();
      const aiResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "Could not validate answer.";
      setChatHistory((prev) => [
        ...prev,
        { role: "user", text: input },
        { role: "assistant", text: aiResponse },
      ]);
      setAnswerHistory((prev) => [
        ...prev,
        { question: latestQuestion, answer: input, response: aiResponse },
      ]);
      speakText(aiResponse);
      setInput("");
    } catch (error) {
      setError(`⚠️ ${error.message}`);
    }
  };

  const renderChatBubble = (msg, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-lg text-white ${
        msg.role === "user" ? "bg-gray-600" : "bg-gray-600 m-4"
      }`}
      dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
    />
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center p-6 max-md:p-4 bg-gradient-to-b from-[#1D1E20] to-[#2A2B2D] text-white font-sans">
     <div className={`relative top-[40%] ${titleName?"hidden":"block"}`}>
     <h1 className="text-2xl md:text-4xl text-center font-bold max-md:mb-2 tracking-tight">
      👩‍🎓 Hello Students 🧑‍🎓
      </h1>
      <h1 className="text-2xl  md:text-4xl text-center text-gray-400 font-semibold mb-16 max-md:mb-10 tracking-tight">
      How can I help you today?
      </h1>
     </div>

      <div className="w-full max-w-4xl flex-1 flex flex-col justify-end">
        {/* Chat Container */}
        <div
          className={`flex-1 ${
            height ? "max-h-[70vh]" : "max-h-0"
          } overflow-y-auto transition-all duration-300`}
          ref={chatContainerRef}
        >
          <div className="py-6 space-y-6 flex flex-col items-center scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {definition && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#2A2B2D] p-6 rounded-2xl shadow-lg max-w-2xl w-full"
                dangerouslySetInnerHTML={{ __html: formatText(definition) }}
              />
            )}
            {chatHistory.map(renderChatBubble)}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader className="animate-spin" size={20} />
                <span>Loading...</span>
              </div>
            )}
          </div>

          {/* Answer History */}
          {answerHistory.length > 0 && (
            <div className="bg-[#2A2B2D] p-6 rounded-2xl mt-4 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                Previous Answers
              </h3>
              <div className="space-y-4">
                {answerHistory.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-700 pb-4 last:border-0"
                  >
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Q:</strong> {item.question}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">A:</strong> {item.answer}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Feedback:</strong>{" "}
                      {item.response}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="mt-6 bg-[#36383A] rounded-3xl p-4 shadow-xl">
          <div className="flex items-center flex-col justify-between  gap-4 max-md:flex-col">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                inputMode === "topic" ? "Enter a topic..." : "Your answer..."
              }
              className=" w-full p-4 rounded-xl  text-white placeholder-gray-300 border-none  outline-none transition-all duration-200"
              onKeyDown={(e) =>
                inputMode === "answer" && e.key === "Enter" && checkAnswer()
              }
            />

            <div className=" w-full">
            <div className="flex w-full gap-3 items-center justify-between">
              <motion.button
                
                disabled={isLoading || !definition}
                
                className=" w-full p-3 bg-gray-600 rounded-full text-sm font-medium hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Loading..." : "Ask Questions"}
              </motion.button>

              <motion.button
                  onClick={checkAnswer}
                  disabled={isLoading || !definition}
                  
                  className="w-full p-3 bg-gray-600 rounded-full text-sm font-medium hover:bg-gray-700  transition-colors"
                >
                  Check Answer
                </motion.button>

              <motion.button
                onClick={fetchDefinition}
                disabled={isLoading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white text-black rounded-full disabled:opacity-50"
              >
                {isLoading ? (
                  <IoCreateOutline className="" size={20} />
                ) : (
                  <FaArrowUp size={20} />
                )}
              </motion.button>
            </div>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center mt-3"
            >
              {error}
            </motion.p>
          )}

          <p className="text-xs text-center text-gray-400 mt-4 hidden max-lg:block">
            Explore AI in education with the best free AI tools for students.
            Get AI for research papers, plagiarism checking, and smart study
            solutions for better learning!
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionAnyTopic;
