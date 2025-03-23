"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Loader } from "lucide-react";
import { FaArrowUp } from "react-icons/fa6";

const QuestionAnyTopic = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [answerHistory, setAnswerHistory] = useState([]); // New state for answer history
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [definition, setDefinition] = useState("");
  const [inputMode, setInputMode] = useState("topic");
  const [height, setHeight] = useState(false)

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
    setHeight(true)

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
    <div className="h-[100vh] overflow-hidden flex flex-col items-center justify-end p-6 max-lg:p-0 bg-[#1D1E20] text-white">
      <div className="w-[60%] max-lg:w-full ">
        <div className={` ${height?"h-[70vh]":"h-[0vh]"} overflow-y-auto`} ref={chatContainerRef}>
          <div className=" space-y-4 flex items-center justify-center flex-col scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 mb-3">
            {definition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl"
                dangerouslySetInnerHTML={{ __html: formatText(definition) }}
              />
            )}
            {chatHistory.map(renderChatBubble)}
            {isLoading ? "Loading..." : ""}
          </div>

          {/* Answer History */}
          {answerHistory.length > 0 && (
            <div className="p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Answer History</h3>
              {answerHistory.map((item, index) => (
                <div key={index} className="mb-2">
                  <p>
                    <strong>Q:</strong> {item.question}
                  </p>
                  <p>
                    <strong>A:</strong> {item.answer}
                  </p>
                  <p>
                    <strong>Feedback:</strong> {item.response}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#36383A] rounded-3xl p-3 gap-3 ">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              inputMode === "topic" ? "Enter a topic..." : "Your answer..."
            }
            className="flex-1 w-full p-3 rounded-lg h-[4rem] text-white placeholder-gray-400 outline-none"
            onKeyDown={(e) =>
              inputMode === "answer" && e.key === "Enter" && checkAnswer()
            }
          />
          
        

        <div className="flex justify-between gap-3 max-lg:mb-32 ">
          <motion.button
            onClick={fetchAIQuestion}
            disabled={isLoading || !definition}
            
            className="flex-1 py-2 px-4 bg-gray-500 rounded-full hover:bg-gray-600 disabled:bg-gray-500"
          >
            {isLoading ? "Questions Is Loading..." : "Ask Questions"}
          </motion.button>
          {inputMode === "answer" && (
            <motion.button
              onClick={checkAnswer}
              
              className="flex-1 py-2 px-4 bg-gray-500 rounded-full hover:bg-gray-600"
            >
              Check Answer
            </motion.button>
          )}
          <motion.button
            onClick={fetchDefinition}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            className="p-3 bg-white text-black rounded-full disabled:bg-gray-500"
          >
            {isLoading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <FaArrowUp/>
            )}
          </motion.button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm text-center"
          >
            {error}
          </motion.p>
        )}
        </div>
      </div>
    </div>
  );
};

export default QuestionAnyTopic;
