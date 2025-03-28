"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { FaArrowUp, FaCamera, FaImage, FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoCreateOutline } from "react-icons/io5";
import { MdRefresh } from "react-icons/md";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import Tesseract from "tesseract.js";

const QuestionAnyTopic = () => {
  const [input, setInput] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [video, setVideo] = useState(null);
  const [inputMode, setInputMode] = useState("topic");
  const [height, setHeight] = useState(false);
  const [titleName, setTitleName] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [scannedQuestion, setScannedQuestion] = useState(null);
  const [mcq, setMcq] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [previousMcqQuestions, setPreviousMcqQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null); // New state for current question

  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

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
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-white'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='italic text-gray-200'>$1</em>")
      .replace(/__([^_]+)__/g, "<u class='underline'>$1</u>")
      .replace(/~~(.*?)~~/g, "<del class='line-through text-gray-400'>$1</del>")
      .replace(/`([^`]+)`/g, "<code class='bg-gray-800 text-yellow-200 px-2 py-0.5 rounded-md font-mono text-sm shadow-sm border border-gray-700'>$1</code>")
      .replace(/### (.*?)(?:\n|$)/g, "<h3 class='text-xl font-semibold text-white mt-4 mb-2'>$1</h3>")
      .replace(/## (.*?)(?:\n|$)/g, "<h2 class='text-2xl font-bold text-white mb-3'>$1</h2>")
      .replace(/# (.*?)(?:\n|$)/g, "<h1 class='text-3xl font-extrabold text-white mt-8 mb-4'>$1</h1>")
      .replace(/(?:\n|^)- (.*?)(?=\n|$)/g, (match, p1) => "<ul class='list-disc ml-6 text-gray-200'><li>$1</li></ul>")
      .replace(/\n>\s(.*?)(?=\n|$)/g, "<blockquote class='border-l-4 border-blue-500 pl-4 italic text-gray-300 my-2'>$1</blockquote>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' class='text-blue-400 underline hover:text-blue-300 transition-colors'>$1</a>")
      .replace(/\n/g, "<br>")
      .replace(/(<\/ul><ul class='list-disc ml-6 text-gray-200'>)+/g, "")
      .replace(/(<\/ol><ol class='list-decimal ml-6 text-gray-200'>)+/g, "");
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
          q: `${topic} tutorial`,
          type: "video", 
          maxResults: 10, 
          order: "relevance", 
          key: apiKey 
        },
      });
      const videos = response.data.items;
      if (!videos || videos.length === 0) return null;

      const reputableVideos = videos.filter((video) => 
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

  const scanImageForQuestion = async (imageFile) => {
    setIsLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(imageFile, "eng", { 
        logger: (m) => console.log(m) 
      });
      const scannedText = text.trim() || "No question detected.";
      setScannedQuestion(scannedText);
      setInput(scannedText);
    } catch (error) {
      setError(`⚠️ Error scanning image: ${error.message}`);
      setScannedQuestion(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      scanImageForQuestion(file);
      setIsUploadModalOpen(false);
    }
  };

  const fetchDefinition = useCallback(async () => {
    const query = scannedQuestion || input.trim();
    if (!query) {
      setError("⚠️ Please enter a topic or upload an image with a question.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setHeight(true);
    setTitleName(true);
    setPreviousMcqQuestions([]);

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
                    text: `Generate a detailed and student-friendly definition of '${query}' that encompasses all key aspects, subtopics, and related concepts. Include relatable examples or practical applications to illustrate the topic, and address common doubts, misconceptions, or frequently asked questions associated with '${query}' to ensure a thorough and engaging understanding.`,
                  },
                ],
              },
            ],
          })
        }
      );
      if (!res.ok) throw new Error("Failed to fetch definition.");
      const data = await res.json();
      const aiDefinition = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Definition not found.";

      setConversationHistory((prev) => [...prev, { type: "definition", text: aiDefinition, question: query }]);
      speakText(aiDefinition);

      const videoResult = await fetchYouTubeVideo(query);
      setVideo(videoResult);

      setInput("");
      setScannedQuestion(null);
    } catch (error) {
      setError(`⚠️ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [input, scannedQuestion]);

  const fetchAIQuestion = useCallback(async () => {
    if (!conversationHistory.some((item) => item.type === "definition")) return;
    setError(null);
    setIsLoading(true);
    setInputMode("answer");

    try {
      const pastQuestions = conversationHistory.filter((item) => item.type === "question").map((item) => item.text).join("\n");
      const latestDefinition = conversationHistory.filter((item) => item.type === "definition").slice(-1)[0]?.text || "";
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
                    text: `Create a basic, short, and common interview question based on '${latestDefinition}' that has not been asked before. Here is the full history of previous questions: ${pastQuestions}`,
                  },
                ],
              },
            ],
          })
        }
      );
      if (!res.ok) throw new Error("Failed to fetch question.");
      const data = await res.json();
      const aiQuestion = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No question available.";
      setConversationHistory((prev) => [...prev, { type: "question", text: aiQuestion }]);
      setCurrentQuestion(aiQuestion); // Set the current question
      speakText(aiQuestion);
    } catch (error) {
      setError(`⚠️ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [conversationHistory]);

  const checkAnswer = useCallback(async () => {
    if (!currentQuestion) {
      setError("⚠️ No question available to check.");
      return;
    }
    if (!input.trim()) {
      setError("⚠️ Please enter an answer.");
      return;
    }

    setIsCheckingAnswer(true);
    setError(null);

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
                    text: `Evaluate this answer: "${input.trim()}" for the question: "${currentQuestion}". Provide feedback on whether the answer is correct, partially correct, or incorrect, and explain why.`,
                  },
                ],
              },
            ],
          })
        }
      );
      if (!res.ok) throw new Error("Failed to check answer.");
      const data = await res.json();
      const feedback = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No feedback available.";

      setConversationHistory((prev) => [
        ...prev,
        { type: "answer", text: input.trim() },
        { type: "response", text: feedback },
      ]);
      speakText(feedback);
      setInput("");
      setInputMode("topic"); // Reset to topic mode after answering
      setCurrentQuestion(null); // Clear current question
    } catch (error) {
      setError(`⚠️ ${error.message}`);
    } finally {
      setIsCheckingAnswer(false);
    }
  }, [input, currentQuestion, conversationHistory]);

  const generateMCQ = useCallback(async () => {
    if (!conversationHistory.some((item) => item.type === "definition")) {
      setError("⚠️ Please generate a definition first to create an MCQ.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setMcq(null);
    setSelectedOption("");

    try {
      const latestDefinition = conversationHistory.filter((item) => item.type === "definition").slice(-1)[0]?.text || "";
      const pastMcqQuestions = previousMcqQuestions.join("\n");
      
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
                    text: `Generate a multiple-choice question (MCQ) based on '${latestDefinition}'. Ensure the question is different from these previously generated questions: ${pastMcqQuestions || "None"}. Format the response as follows:
                    Question: [Your question here]
                    A) [Option A]
                    B) [Option B]
                    C) [Option C]
                    D) [Option D]
                    Correct Answer: [A/B/C/D]`,
                  },
                ],
              },
            ],
          })
        }
      );

      if (!res.ok) throw new Error("Failed to generate MCQ.");
      
      const data = await res.json();
      const mcqText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      
      if (!mcqText) throw new Error("No MCQ content received from API.");

      const lines = mcqText.split("\n").map(line => line.trim()).filter(line => line);
      const mcqData = {
        question: "",
        options: {},
        correctAnswer: ""
      };

      lines.forEach((line) => {
        if (line.startsWith("Question:")) {
          mcqData.question = line.replace("Question:", "").trim();
        } else if (/^[A-D]\)/.test(line)) {
          const [key, value] = line.split(")").map(part => part.trim());
          mcqData.options[key] = value;
        } else if (line.startsWith("Correct Answer:")) {
          mcqData.correctAnswer = line.replace("Correct Answer:", "").trim();
        }
      });

      if (!mcqData.question || Object.keys(mcqData.options).length !== 4 || !mcqData.correctAnswer) {
        throw new Error("Invalid MCQ format received from API.");
      }

      if (!["A", "B", "C", "D"].includes(mcqData.correctAnswer)) {
        throw new Error("Correct answer must be A, B, C, or D.");
      }

      if (previousMcqQuestions.includes(mcqData.question)) {
        throw new Error("Generated duplicate MCQ question. Please try again.");
      }

      setMcq(mcqData);
      setConversationHistory((prev) => [...prev, { type: "mcq", text: mcqData }]);
      setPreviousMcqQuestions((prev) => [...prev, mcqData.question]);
      speakText(`${mcqData.question} A) ${mcqData.options.A} B) ${mcqData.options.B} C) ${mcqData.options.C} D) ${mcqData.options.D}`);
    } catch (error) {
      setError(`⚠️ Failed to generate MCQ: ${error.message}`);
      console.error("MCQ Generation Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationHistory, previousMcqQuestions]);

  const checkMCQAnswer = () => {
    if (!mcq) {
      setError("⚠️ No MCQ available to check.");
      return;
    }
    if (!selectedOption) {
      setError("⚠️ Please select an option before submitting.");
      return;
    }

    setIsCheckingAnswer(true);
    setError(null);

    try {
      const isCorrect = selectedOption === mcq.correctAnswer;
      const responseText = isCorrect 
        ? "Correct! Well done!" 
        : `Incorrect. The correct answer is ${mcq.correctAnswer}: ${mcq.options[mcq.correctAnswer]}`;

      setConversationHistory((prev) => [
        ...prev,
        { 
          type: "mcq_answer", 
          text: `You selected: ${selectedOption}) ${mcq.options[selectedOption]}` 
        },
        { 
          type: "response", 
          text: responseText 
        },
      ]);
      
      speakText(responseText);
      setSelectedOption("");
    } catch (error) {
      setError(`⚠️ Error checking answer: ${error.message}`);
    } finally {
      setIsCheckingAnswer(false);
    }
  };

  const refreshConversation = () => {
    setConversationHistory([]);
    setVideo(null);
    setInput("");
    setInputMode("topic");
    setHeight(false);
    setTitleName(false);
    setError(null);
    setScannedQuestion(null);
    setMcq(null);
    setSelectedOption("");
    setIsCheckingAnswer(false);
    setPreviousMcqQuestions([]);
    setCurrentQuestion(null);
  };

  const downloadDefinitionAsWord = () => {
    const definition = conversationHistory.find((item) => item.type === "definition")?.text;
    if (!definition) return;

    const formattedParagraphs = [];
    const lines = definition.split("\n");

    lines.forEach((line) => {
      if (line.startsWith("# ")) {
        formattedParagraphs.push(new Paragraph({ 
          children: [new TextRun({ text: line.replace("# ", ""), bold: true, size: 36 })], 
          spacing: { after: 300 } 
        }));
      } else if (line.startsWith("## ")) {
        formattedParagraphs.push(new Paragraph({ 
          children: [new TextRun({ text: line.replace("## ", ""), bold: true, size: 28 })], 
          spacing: { after: 250 } 
        }));
      } else if (line.startsWith("### ")) {
        formattedParagraphs.push(new Paragraph({ 
          children: [new TextRun({ text: line.replace("### ", ""), bold: true, size: 24 })], 
          spacing: { after: 200 } 
        }));
      } else if (line.startsWith("- ")) {
        formattedParagraphs.push(new Paragraph({ 
          text: line.replace("- ", ""), 
          bullet: { level: 0 }, 
          spacing: { after: 150 } 
        }));
      } else if (/\*\*(.*?)\*\*/.test(line)) {
        formattedParagraphs.push(new Paragraph({ 
          children: [new TextRun({ text: line.replace(/\*\*/g, ""), bold: true, size: 24 })] 
        }));
      } else if (/\*(.*?)\*/.test(line)) {
        formattedParagraphs.push(new Paragraph({ 
          children: [new TextRun({ text: line.replace(/\*/g, ""), italics: true, size: 24 })] 
        }));
      } else if (/__(.*?)__/.test(line)) {
        formattedParagraphs.push(new Paragraph({ 
          children: [new TextRun({ text: line.replace(/__/g, ""), underline: {}, size: 24 })] 
        }));
      } else {
        formattedParagraphs.push(new Paragraph({ 
          text: line, 
          spacing: { after: 100 } 
        }));
      }
    });

    const doc = new Document({ sections: [{ properties: {}, children: formattedParagraphs }] });
    Packer.toBlob(doc).then((blob) => saveAs(blob, "definition.docx"));
  };

  const renderConversationItem = (item, index) => {
    let content;
    switch (item.type) {
      case "definition":
        content = (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }} 
            className="p-6 max-lg:p-4 rounded-2xl shadow-lg w-full"
          >
            <div dangerouslySetInnerHTML={{ __html: formatText(item.text) }} />
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
        );
        break;
      case "question":
        content = (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-gray-700 m-4 p-3 rounded-lg text-white" 
            dangerouslySetInnerHTML={{ __html: formatText(item.text) }} 
          />
        );
        break;
      case "answer":
        content = (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-left w-full p-3 rounded-lg text-white" 
            dangerouslySetInnerHTML={{ __html: formatText(item.text) }} 
          />
        );
        break;
      case "response":
        content = (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-gray-700 m-4 p-3 rounded-lg text-white" 
            dangerouslySetInnerHTML={{ __html: formatText(item.text) }} 
          />
        );
        break;
      case "mcq":
        content = (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-gray-700 m-4 p-3 rounded-lg text-white"
          >
            <p dangerouslySetInnerHTML={{ __html: formatText(item.text.question) }} />
            <form>
              <ul className="list-none mt-2">
                {Object.entries(item.text.options).map(([key, value]) => (
                  <li key={key} className="my-1">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`mcq-${index}`}
                        value={key}
                        checked={selectedOption === key}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="mr-2"
                      />
                      {key}) {value}
                    </label>
                  </li>
                ))}
              </ul>
            </form>
            <motion.button 
              onClick={checkMCQAnswer} 
              whileTap={{ scale: 0.9 }} 
              disabled={isCheckingAnswer}
              className="mt-4 p-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isCheckingAnswer ? "Checking..." : "Submit MCQ Answer"}
            </motion.button>
          </motion.div>
        );
        break;
      case "mcq_answer":
        content = (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-left w-full p-3 rounded-lg text-white" 
            dangerouslySetInnerHTML={{ __html: formatText(item.text) }} 
          />
        );
        break;
      default:
        content = null;
    }
    return <div key={index}>{content}</div>;
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-[#1D1E20] to-[#2A2B2D] text-white font-sans">
      <div className={`relative top-[40%] ${titleName ? "hidden" : "block"}`}>
        <h1 className="text-2xl md:text-4xl text-center font-bold max-md:mb-2 tracking-tight">👩‍🎓 Hello Student 🧑‍🎓</h1>
        <h2 className="text-2xl md:text-4xl text-center text-gray-400 font-semibold mb-16 max-md:mb-10 tracking-tight">How can I help you today?</h2>
      </div>

      <div className="w-full max-w-3xl flex-1 flex flex-col justify-end">
        <div 
          className={`custom-scrollbar flex-1 ${height ? "max-h-[76vh]" : "max-h-0"} transition-all duration-300 overflow-y-scroll scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-64`} 
          ref={chatContainerRef}
        >
          <div className="flex flex-col items-center">
            {conversationHistory.map(renderConversationItem)}
            {isLoading && (
              <div className="flex items-center gap-2 text-white">
                <Loader className="animate-spin py-5" size={20} />
                <span>Loading...</span>
              </div>
            )}
            {isCheckingAnswer && (
              <div className="flex items-center gap-2 text-white">
                <Loader className="animate-spin py-5" size={20} />
                <span>Checking Answer...</span>
              </div>
            )}
            {error && (
              <div className="text-red-400 p-4">{error}</div>
            )}
          </div>
        </div>

        <div className="bg-[#36383A] border-gray-500 rounded-3xl px-4 py-2 shadow-xl">
          <div className="flex items-center flex-col justify-between gap-2 max-md:flex-col">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputMode === "topic" ? "Enter a Topic or Doubt..." : "Your answer..."}
              className="w-full p-3 rounded-xl text-white placeholder-gray-300 border-none outline-none transition-all duration-200"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (inputMode === "topic") {
                    fetchDefinition();
                  } else if (inputMode === "answer") {
                    checkAnswer();
                  }
                }
              }}
            />
            <div className="w-full">
              <div className="flex w-full gap-3 items-center justify-between mb-2">
                <div className="flex w-[70%] max-lg:w-[100%] gap-3">
                  <div className="relative">
                    <div className="absolute z-0 right-[0px] bottom-32">
                      {isUploadModalOpen && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className=" inset-0 bg-opacity-50 flex items-center justify-center z-50"
                        >
                          <div className="bg-gray-800 flex-col gap-5 rounded-lg shadow-lg flex">
                            <motion.button 
                              onClick={() => fileInputRef.current.click()} 
                              whileTap={{ scale: 0.9 }} 
                              className="p-3 text-white rounded-full transition-colors"
                            >
                              <FaImage size={20} className="inline" />
                            </motion.button>
                            <motion.button 
                              onClick={() => cameraInputRef.current.click()} 
                              whileTap={{ scale: 0.9 }} 
                              className="p-3 text-white rounded-full transition-colors"
                            >
                              <FaCamera size={20} className="inline" />
                            </motion.button>
                            <motion.button 
                              onClick={refreshConversation} 
                              whileTap={{ scale: 0.9 }} 
                              className="p-3 text-white rounded-full transition-colors"
                            >
                              <MdRefresh size={20} />
                            </motion.button>
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={handleImageUpload} 
                              accept="image/*" 
                              className="hidden" 
                            />
                            <input 
                              type="file" 
                              ref={cameraInputRef} 
                              onChange={handleImageUpload} 
                              accept="image/*" 
                              capture="environment" 
                              className="hidden" 
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <motion.button 
                      onClick={() => setIsUploadModalOpen((prev) => !prev)} 
                      whileTap={{ scale: 0.9 }} 
                      className=" p-3 border border-gray-500 rounded-full bg-gray-500 text-white font-medium hover:bg-gray-700 transition-colors"
                    >
                      {isUploadModalOpen ? <RxCross2 size={18} className="z-10" /> : <FaPlus size={18} className="z-10" />}
                    </motion.button>
                  </div>
                  <motion.button 
                    onClick={fetchAIQuestion} 
                    disabled={isLoading || !conversationHistory.length} 
                    className="w-full border border-gray-500 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Loading..." : "Ask Questions"}
                  </motion.button>
                  <motion.button 
                    onClick={generateMCQ} 
                    disabled={isLoading || !conversationHistory.some((item) => item.type === "definition")} 
                    className="w-full border border-gray-500 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Loading..." : "Generate MCQ"}
                  </motion.button>
                </div>
                <motion.button 
                  onClick={fetchDefinition} 
                  disabled={isLoading} 
                  className=" p-3 border border-gray-500 bg-white text-black rounded-full font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? <IoCreateOutline /> : <FaArrowUp />}
                </motion.button>
              </div>
            </div>
            <p className="text-xs text-center text-gray-400 hidden max-lg:block">
              Explore AI and education with our artificial intelligence in education platform! Solve doubts instantly using our math problem solver powered by artificial intelligence on education.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionAnyTopic;