"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Loader } from "lucide-react";
import { FaArrowUp } from "react-icons/fa6";
import { IoCreateOutline } from "react-icons/io5";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun } from "docx"; // Import docx
import { saveAs } from "file-saver"; // Import file-saver

const QuestionAnyTopic = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [definition, setDefinition] = useState("");
  const [video, setVideo] = useState(null);
  const [inputMode, setInputMode] = useState("topic");
  const [height, setHeight] = useState(false);
  const [titleName, setTitleName] = useState(false);

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
    return (
      text
        // Bold: **text** -> <strong>
        .replace(
          /\*\*(.*?)\*\*/g,
          "<strong class='font-bold text-white'>$1</strong>"
        )
        // Italics: *text* -> <em>
        .replace(/\*(.*?)\*/g, "<em class='italic text-gray-200'>$1</em>")
        // Underline: __text__ -> <u>
        .replace(/__([^_]+)__/g, "<u class='underline'>$1</u>")
        // Strikethrough: ~~text~~ -> <del>
        .replace(
          /~~(.*?)~~/g,
          "<del class='line-through text-gray-400'>$1</del>"
        )
        // Code: `text` -> <code>
        .replace(
          /`([^`]+)`/g,
          "<code class='bg-gray-800 text-yellow-200 px-2 py-0.5 rounded-md font-mono text-sm shadow-sm border border-gray-700'>$1</code>"
        )
        // Headings: #, ##, ### -> <h1>, <h2>, <h3>
        .replace(
          /### (.*?)(?:\n|$)/g,
          "<h3 class='text-xl font-semibold text-white mt-4 mb-2'>$1</h3>"
        )
        .replace(
          /## (.*?)(?:\n|$)/g,
          "<h2 class='text-2xl font-bold text-white mb-3'>$1</h2>"
        )
        .replace(
          /# (.*?)(?:\n|$)/g,
          "<h1 class='text-3xl font-extrabold text-white mt-8 mb-4'>$1</h1>"
        )
        // Unordered List: - item -> <ul><li>
        .replace(/(?:\n|^)- (.*?)(?=\n|$)/g, (match, p1) => {
          return "<ul class='list-disc ml-6 text-gray-200'><li>$1</li></ul>";
        })
        .replace(
          /\*(.*?)/g,
          "<ul><li class='text-xl font-semibold text-white mt-4 mb-2'></li></ul>"
        )

        // Blockquote: > text -> <blockquote>
        .replace(
          /\n>\s(.*?)(?=\n|$)/g,
          "<blockquote class='border-l-4 border-blue-500 pl-4 italic text-gray-300 my-2'>$1</blockquote>"
        )
        // Links: [text](url) -> <a>
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          "<a href='$2' class='text-blue-400 underline hover:text-blue-300 transition-colors'>$1</a>"
        )
        // Line breaks: \n -> <br>
        .replace(/\n/g, "<br>")
        // Clean up multiple <ul> or <ol> tags into a single list (post-processing)
        .replace(/(<\/ul><ul class='list-disc ml-6 text-gray-200'>)+/g, "")
        .replace(/(<\/ol><ol class='list-decimal ml-6 text-gray-200'>)+/g, "")
    );
  };

  const fetchYouTubeVideo = async (topic) => {
    const apiKey = "AIzaSyDnlqKMLVXtf3_JPMwZxHePYjWTwhovoJM";
    const baseUrl = "https://www.googleapis.com/youtube/v3/search";
    const reputableChannels = {
      "Traversy Media": "UC29ju8bIPH5as8OGnQzwJyA",
      "freeCodeCamp.org": "UC8butISFwT-Wl7EV0hUK0BQ",
      "The Net Ninja": "UCW5YeuERMmlnqo4oq8vwUpg",
      Academind: "UCSJbGtTlrDami-tDGPUV9-w",
    };

    try {
      const response = await axios.get(baseUrl, {
        params: {
          part: "snippet",
          q: topic,
          type: "video",
          maxResults: 10,
          order: "relevance",
          key: apiKey,
        },
      });

      const videos = response.data.items;
      if (!videos || videos.length === 0) return null;

      const reputableVideos = videos.filter((video) =>
        Object.values(reputableChannels).includes(video.snippet.channelId)
      );
      const bestVideo =
        reputableVideos.length > 0 ? reputableVideos[0] : videos[0];

      return {
        title: bestVideo.snippet.title,
        url: `https://www.youtube.com/watch?v=${bestVideo.id.videoId}`,
        channel: bestVideo.snippet.channelTitle,
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
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Generate a detailed and student-friendly definition of '${input}' that encompasses all key aspects, subtopics, and related concepts. Include relatable examples or practical applications to illustrate the topic, and address common doubts, misconceptions, or frequently asked questions associated with '${input}' to ensure a thorough and engaging understanding.`,
                  },
                ],
              },
            ],
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
                    text: `Create a basic, short and common interview question based on '${definition}' that has not been asked before. Here is the full history of previous questions: ${pastQuestions}`,
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
    setInputMode("topic");

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
                    text: `Evaluate:\nQuestion: ${latestQuestion}\nAnswer: ${input}\nRespond with 'It is correct.' if correct, or 'It is not correct' with the correct answer if wrong.`,
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

  // Function to download definition as Word document
  const downloadDefinitionAsWord = () => {
    if (!definition) return;
  
    // Convert formatted text into paragraphs with proper styles
    const formattedParagraphs = [];
    const lines = definition.split("\n");
  
    lines.forEach((line) => {
      if (line.startsWith("# ")) {
        // H1
        formattedParagraphs.push(
          new Paragraph({
            children: [new TextRun({ text: line.replace("# ", ""), bold: true, size: 36 })],
            spacing: { after: 300 },
          })
        );
      } else if (line.startsWith("## ")) {
        // H2
        formattedParagraphs.push(
          new Paragraph({
            children: [new TextRun({ text: line.replace("## ", ""), bold: true, size: 28 })],
            spacing: { after: 250 },
          })
        );
      } else if (line.startsWith("### ")) {
        // H3
        formattedParagraphs.push(
          new Paragraph({
            children: [new TextRun({ text: line.replace("### ", ""), bold: true, size: 24 })],
            spacing: { after: 200 },
          })
        );
      } else if (line.startsWith("- ")) {
        // Bullet list
        formattedParagraphs.push(
          new Paragraph({
            text: line.replace("- ", ""),
            bullet: { level: 0 },
            spacing: { after: 150 },
          })
        );
      } else if (/\*\*(.*?)\*\*/.test(line)) {
        // Bold Text
        formattedParagraphs.push(
          new Paragraph({
            children: [new TextRun({ text: line.replace(/\*\*/g, ""), bold: true, size: 24 })],
          })
        );
      } else if (/\*(.*?)\*/.test(line)) {
        // Italic Text
        formattedParagraphs.push(
          new Paragraph({
            children: [new TextRun({ text: line.replace(/\*/g, ""), italics: true, size: 24 })],
          })
        );
      } else if (/__(.*?)__/.test(line)) {
        // Underline Text
        formattedParagraphs.push(
          new Paragraph({
            children: [new TextRun({ text: line.replace(/__/g, ""), underline: {}, size: 24 })],
          })
        );
      } else {
        // Normal Paragraph
        formattedParagraphs.push(new Paragraph({ text: line, spacing: { after: 100 } }));
      }
    });
  
    // Create a Word document
    const doc = new Document({
      sections: [{ properties: {}, children: formattedParagraphs }],
    });
  
    // Generate and download the Word file
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "definition.docx");
    });
  };
  

  const renderChatBubble = (msg, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-lg text-white ${
        msg.role === "user" ? "text-left w-full p-3" : "bg-gray-700 m-4"
      }`}
      dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
    />
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center  bg-gradient-to-b from-[#1D1E20] to-[#2A2B2D] text-white font-sans">
      <div className={`relative top-[40%] ${titleName ? "hidden" : "block"}`}>
        <h1 className="text-2xl md:text-4xl text-center font-bold max-md:mb-2 tracking-tight">
          👩‍🎓 Hello Student 🧑‍🎓
        </h1>
        <h1 className="text-2xl md:text-4xl text-center text-gray-400 font-semibold mb-16 max-md:mb-10 tracking-tight">
          How can I help you today?
        </h1>
      </div>

      <div className="w-full max-w-3xl flex-1 flex flex-col justify-end">
        <div
          className={`custom-scrollbar flex-1 ${
            height ? "max-h-[76vh]" : "max-h-0"
          } transition-all duration-300 overflow-y-scroll scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-64`}
          ref={chatContainerRef}
        >
          <div className="flex flex-col items-center ">
            {definition && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 max-lg:p-4 rounded-2xl shadow-lg w-full"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: formatText(definition) }}
                />
                <motion.button
                  onClick={downloadDefinitionAsWord}
                  whileTap={{ scale: 0.9 }}
                  className="mt-4 p-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  Download as Word
                </motion.button>
                {video && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="py-6 w-full"
                  >
                    <p>Recommended Video:</p>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      {video.title}
                    </a>
                    <p className="text-gray-400">by {video.channel}</p>
                  </motion.div>
                )}
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

        <div className="bg-[#36383A] border-gray-500 rounded-3xl px-4 py-2 shadow-xl">
          <div className="flex items-center flex-col justify-between gap-2 max-md:flex-col">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                inputMode === "topic"
                  ? "Enter a Topic or Doubt..."
                  : "Your answer..."
              }
              className="w-full p-3 rounded-xl text-white placeholder-gray-300 border-none outline-none transition-all duration-200"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (inputMode === "topic") fetchDefinition();
                  else if (inputMode === "answer") checkAnswer();
                }
              }}
            />
            <div className="w-full">
              <div className="flex w-full gap-3 items-center justify-between mb-2">
                <div className="flex w-[50%] max-lg:w-[100%] gap-5 ">
                  <motion.button
                    onClick={fetchAIQuestion}
                    disabled={isLoading || !definition}
                    className="w-full p-3 border border-gray-500 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Loading..." : "Ask Questions"}
                  </motion.button>
                  <motion.button
                    onClick={checkAnswer}
                    disabled={isLoading || !definition}
                    className="w-full p-3 border border-gray-500 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                   {isLoading ? "Loading..." : " Check Answer"}
                  </motion.button>
                </div>
                <motion.button
                  onClick={fetchDefinition}
                  disabled={isLoading}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white text-black rounded-full disabled:opacity-50"
                >
                  {isLoading ? (
                    <IoCreateOutline size={20} />
                  ) : (
                    <FaArrowUp size={18} />
                  )}
                </motion.button>
              </div>
            </div>
            <p className="text-xs text-center text-gray-400 hidden max-lg:block">
              Explore AI and education with our artificial intelligence in
              education platform! Solve doubts instantly using our math problem
              solver powered by artificial intelligence on education.
            </p>
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
        </div>
      </div>
    </div>
  );
};

export default QuestionAnyTopic;
