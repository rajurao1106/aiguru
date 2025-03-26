"use client"

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Loader } from "lucide-react";
import { FaArrowUp } from "react-icons/fa6";
import { IoCreateOutline } from "react-icons/io5";
import axios from "axios";

const QuestionAnyTopic = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [definition, setDefinition] = useState("");
  const [video, setVideo] = useState(null); // New state for YouTube video
  const [inputMode, setInputMode] = useState("topic");
  const [height, setHeight] = useState(false);
  const [titleName, setTitleName] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
      .replace(/\n\d+\. (.*?)\n/g, "<ol class='list-decimal ml-5'><li>$1</li></ol>")
      .replace(/\n>\s(.*?)\n/g, "<blockquote class='border-l-4 border-blue-500 pl-4 italic'>$1</blockquote>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' class='text-blue-400 underline'>$1</a>")
      .replace(/\n/g, "<br>");
  };

  // Fetch YouTube video based on topic
  const fetchYouTubeVideo = async (topic) => {
    const apiKey = "AIzaSyDnlqKMLVXtf3_JPMwZxHePYjWTwhovoJM";
    const baseUrl = "https://www.googleapis.com/youtube/v3/search";
    const reputableChannels = {
      "Traversy Media": "UC29ju8bIPH5as8OGnQzwJyA",
      "freeCodeCamp.org": "UC8butISFwT-Wl7EV0hUK0BQ",
      "The Net Ninja": "UCW5YeuERMmlnqo4oq8vwUpg",
      "Academind": "UCSJbGtTlrDami-tDGPUV9-w"
    };

    try {
      const response = await axios.get(baseUrl, {
        params: {
          part: "snippet",
          q: topic,
          type: "video",
          maxResults: 10,
          order: "relevance",
          key: apiKey
        }
      });

      const videos = response.data.items;
      if (!videos || videos.length === 0) return null;

      const reputableVideos = videos.filter(video =>
        Object.values(reputableChannels).includes(video.snippet.channelId)
      );
      const bestVideo = reputableVideos.length > 0 ? reputableVideos[0] : videos[0];

      return {
        title: bestVideo.snippet.title,
        url: `https://www.youtube.com/watch?v=${bestVideo.id.videoId}`,
        channel: bestVideo.snippet.channelTitle
      };
    } catch (error) {
      console.error("Error fetching YouTube video:", error.message);
      return null;
    }
  };

  const fetchDefinition = useCallback(async () => {
    if (!input.trim()) {
      setError("⚠️ Please enter a topic.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setChatHistory([]);
    setAnswerHistory([]);
    setHeight(true);
    setTitleName(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: `Generate a detailed definition of '${input}' that includes all key aspects, subtopics, and related concepts for a comprehensive understanding.` }] }]
          })
        }
      );
      if (!res.ok) throw new Error("Failed to fetch definition.");
      const data = await res.json();
      const aiDefinition = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Definition not found.";
      setDefinition(aiDefinition);
      speakText(aiDefinition);

      // Fetch YouTube video after setting definition
      const videoResult = await fetchYouTubeVideo(input);
      setVideo(videoResult);

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
    setInputMode("answer");

    try {
      const pastQuestions = chatHistory.filter(msg => msg.role === "assistant").map(msg => msg.text).join("\n");
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: `Create a basic, short and common interview question based on '${definition}' that has not been asked before. Here is the full history of previous questions: ${pastQuestions}` }] }]
          })
        }
      );
      if (!res.ok) throw new Error("Failed to fetch question.");
      const data = await res.json();
      const aiQuestion = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No question available.";
      setChatHistory(prev => [...prev, { role: "assistant", text: aiQuestion }]);
      speakText(aiQuestion);
    } catch (error) {
      setError(`⚠️ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [definition, chatHistory]);

  const checkAnswer = async () => {
    if (!chatHistory.length || !input.trim()) return;
    setInputMode("topic");

    try {
      const latestQuestion = chatHistory[chatHistory.length - 1].text;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: `Evaluate:\nQuestion: ${latestQuestion}\nAnswer: ${input}\nRespond with 'It is correct.' if correct, or 'It is not correct' with the correct answer if wrong.` }] }]
          })
        }
      );
      if (!res.ok) throw new Error("Failed to validate answer.");
      const data = await res.json();
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Could not validate answer.";
      setChatHistory(prev => [...prev, { role: "user", text: input }, { role: "assistant", text: aiResponse }]);
      setAnswerHistory(prev => [...prev, { question: latestQuestion, answer: input, response: aiResponse }]);
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
      className={`p-3 rounded-lg text-white ${msg.role === "user" ? "text-left w-full p-3" : "bg-gray-700 m-4"}`}
      dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
    />
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center p-6 max-md:p-4 bg-gradient-to-b from-[#1D1E20] to-[#2A2B2D] text-white font-sans">
      <div className={`relative top-[40%] ${titleName ? "hidden" : "block"}`}>
        <h1 className="text-2xl md:text-4xl text-center font-bold max-md:mb-2 tracking-tight">👩‍🎓 Hello Students 🧑‍🎓</h1>
        <h1 className="text-2xl md:text-4xl text-center text-gray-400 font-semibold mb-16 max-md:mb-10 tracking-tight">How can I help you today?</h1>
      </div>

      <div className="w-full max-w-3xl flex-1 flex flex-col justify-end">
        <div className={`custom-scrollbar flex-1 ${height ? "max-h-[70vh]" : "max-h-0"} transition-all duration-300 overflow-y-scroll scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-64`} ref={chatContainerRef}>
          <div className="flex flex-col items-center">
            {definition && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 max-lg:p-1 rounded-2xl shadow-lg w-full"
                dangerouslySetInnerHTML={{ __html: formatText(definition) }}
              />
            )}
            {video && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 max-lg:p-1 rounded-2xl shadow-lg w-full"
              >
                <p>Recommended Video:</p>
                <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{video.title}</a>
                <p className="text-gray-400">by {video.channel}</p>
              </motion.div>
            )}
            {chatHistory.map(renderChatBubble)}
            {isLoading && (
              <div className="flex items-center gap-2 text-white">
                <Loader className="animate-spin py-5" size={20} />
                <span>Loading...</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-[#36383A] border border-gray-500 rounded-3xl p-2 shadow-xl">
          <div className="flex items-center flex-col justify-between gap-4 max-md:flex-col">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputMode === "topic" ? "Enter a Topic or Doubt..." : "Your answer..."}
              className="w-full p-3 rounded-xl text-white placeholder-gray-300 border-none outline-none transition-all duration-200"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (inputMode === "topic") fetchDefinition();
                  else if (inputMode === "answer") checkAnswer();
                }
              }}
            />
            <div className="w-full">
              <div className="flex w-full gap-3 items-center justify-between">
                <div className="flex w-[50%] max-lg:w-[100%] gap-5">
                  <motion.button
                    onClick={fetchAIQuestion}
                    disabled={isLoading || !definition}
                    className="w-full p-3 border border-gray-500 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    {isLoading ? "Loading..." : "Ask Questions"}
                  </motion.button>
                  <motion.button
                    onClick={checkAnswer}
                    disabled={isLoading || !definition}
                    className="w-full p-3 border border-gray-500 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    Check Answer
                  </motion.button>
                </div>
                <motion.button
                  onClick={fetchDefinition}
                  disabled={isLoading}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white text-black rounded-full disabled:opacity-50"
                >
                  {isLoading ? <IoCreateOutline size={20} /> : <FaArrowUp size={18} />}
                </motion.button>
              </div>
            </div>
            <p className="text-xs text-center text-gray-400 hidden max-lg:block">
            Explore AI in education! Instantly solve doubts with our AI-powered math solver.
          </p>
          </div>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center mt-3">
              {error}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionAnyTopic;