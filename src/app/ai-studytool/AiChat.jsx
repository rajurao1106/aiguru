"use client";

import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import MCQApp from "./MCQ";
import TestApp from "./TakeTest"; // ✅ New test component
import { FaNotesMedical } from "react-icons/fa6";

export default function AiChat({
  theme,
  textTheme,
  input,
  setInput,
  messages,
  setMessages,
  isLoading,
  handleSendWithVideo,
  handleNotes,
  handleTopicClick,
}) {
  const [showMCQ, setShowMCQ] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [mcqPromptAvailable, setMcqPromptAvailable] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState(""); // ✅ For test topic

  // Store last AI response for MCQ/Test
  useEffect(() => {
    const lastMsg = messages?.[messages.length - 1];
    if (lastMsg?.role === "assistant" && lastMsg?.content) {
      localStorage.setItem("lastAiResponse", lastMsg.content);
      setLastAiResponse(lastMsg.content);
      setMcqPromptAvailable(true);
    }
  }, [messages]);

  // Show test or MCQ screen
  if (showTest)
    return <TestApp topic={lastAiResponse} onBack={() => setShowTest(false)} />;
  if (showMCQ) return <MCQApp onBack={() => setShowMCQ(false)} />;

  return (
    <section className={`w-full h-full ${textTheme} flex flex-col justify-end`}>
      <div className="max-w-2xl mx-auto flex flex-col w-full">
        {/* Chat History */}

        <div className="flex flex-col gap-3 overflow-scroll custom-scrollbar h-[27rem] max-lg:h-[77vh] px-6 py-4">
          {messages.map((msg, index) => (
            <div key={index} className="flex flex-col gap-2 ">
              <div
                className={`p-3  rounded-xl text-sm w-fit max-w-[100%]  ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : theme
                    ? "text-black bg-gray-100"
                    : "bg-gray-800 text-white"
                }`}
              >
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-blue-500 underline hover:text-blue-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {typeof msg.content === "string"
                    ? msg.content
                    : msg.content.topic.replace(/"/g, "")}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {isLoading && <p className="text-sm text-gray-400">Loading...</p>}

          {mcqPromptAvailable && (
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const response = localStorage.getItem("lastAiResponse");
                    if (response) localStorage.setItem("mcqTopic", response);
                    setShowMCQ(true);
                  }}
                  className="bg-blue-500 px-4 py-2 cursor-pointer rounded text-sm hover:bg-blue-600 transition"
                >
                  Practice MCQs
                </button>

                <button
                  onClick={() => setShowTest(true)}
                  disabled={!lastAiResponse.trim()}
                  className={`px-4 py-2 rounded text-sm transition ${
                    lastAiResponse.trim()
                      ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                >
                  Take a Test
                </button>
                <button
                  onClick={() => {
                    // Delete last assistant message
                    setMessages((prev) => {
                      const updated = [...prev];
                      for (let i = updated.length - 1; i >= 0; i--) {
                        if (updated[i].role === "assistant") {
                          updated.splice(i, 1);
                          break;
                        }
                      }
                      return updated;
                    });
                  }}
                  className="bg-red-500 px-4 py-2 cursor-pointer rounded text-sm hover:bg-red-600 transition"
                >
                  Delete Topic Answer
                </button>
              </div>
              <button
                onClick={handleTopicClick}
                className={`bg-blue-500 max-lg:hidden px-4 py-2 cursor-pointer rounded text-sm hover:bg-blue-600 transition`}
              >
                Next Topic
              </button>
            </div>
          )}
        </div>

        {/* Input box */}
        <div
          className={`relative max-lg:border max-lg:mx-1 ${
            theme ? "bg-gray-200" : "bg-gray-950"
          }  lg:mb-2 rounded-full border-gray-700`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your doubt or enter a topic..."
            className={`w-[93%] max-xl:w-[85%]  p-4 pr-16 pl-4 rounded-full duration-300 placeholder-gray-400 outline-none`}
            onKeyDown={(e) => e.key === "Enter" && handleSendWithVideo()}
          />
          <button
            className="absolute top-2 right-14 text-gray-500 text-2xl rounded-full p-2"
            onClick={handleNotes}
          >
            <FaNotesMedical />
          </button>
          <button
            onClick={handleSendWithVideo}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center"
          >
            <FaArrowUp />
          </button>
        </div>
        <p className="text-xs text-center text-gray-400 py-2">
          The leading AI platform for educators and students. Experience
          personalized learning, instant solutions, and smart tools to save time
          and boost academic success.
        </p>
      </div>
    </section>
  );
}
