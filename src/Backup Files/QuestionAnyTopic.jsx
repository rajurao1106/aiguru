"use client"

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import {
  FaArrowUp,
  FaCamera,
  FaImage,
  FaPlus,
  FaMicrophone,
} from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoCreateOutline } from "react-icons/io5";
import { MdRefresh } from "react-icons/md";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import Tesseract from "tesseract.js";
import Link from "next/link";
import { RiPsychotherapyFill } from "react-icons/ri";
import loading from "../../images/loading.gif";
import loading2 from "../../images/loading2.gif";
import question from "../../images/question.gif";
import test from "../../images/mcq.gif";
import camera from "../../images/camera.gif";
import image_file from "../../images/image_file.gif";
import student_councilor from "../../images/student_councilor.gif";
import Image from "next/image";

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
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userName, setUserName] = useState("");
  const [lastTopic, setLastTopic] = useState(null);

  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [conversations, setConversations] = useState([]);
  const recognitionRef = useRef(null);

  const handleVoiceClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // Append the transcript and "use client"; to the input field
      setInput((prev) => prev + transcript + input);
      // Optionally add to conversations if you still want to track spoken text separately
      setConversations((prev) => [...prev, transcript]);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  useEffect(() => {
    const storedName = sessionStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
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
      .replace(
        /\*\*(.*?)\*\*/g,
        "<strong class='font-bold '>$1</strong>"
      )
      .replace(/\*(.*?)\*/g, "<em class='italic '>$1</em>")
      .replace(/\*(.*?)/g, "<p class='italic '>$1<br/></p>")
      .replace(
        /\\boxed\{([^}]+)\}/g,
        "<code class='bg-gray-800 text-yellow-200 px-2 py-0.5 rounded-md font-mono text-sm shadow-sm border border-gray-700'>$1</code>"
      )
      .replace(/__([^_]+)__/g, "<u class='underline'>$1</u>")
      .replace(/~~(.*?)~~/g, "<del class='line-through '>$1</del>")
      .replace(
        /`([^`]+)`/g,
        "<code class=' px-2 py-0.5 rounded-md font-mono text-sm shadow-sm'>$1</code>"
      )
      .replace(
        /### (.*?)(?:\n|$)/g,
        "<h3 class='text-xl font-semibold  mt-4 mb-2'>$1</h3>"
      )
      .replace(
        /## (.*?)(?:\n|$)/g,
        "<h2 class='text-2xl font-bold  mb-3'>$1</h2>"
      )
      .replace(
        /# (.*?)(?:\n|$)/g,
        "<h1 class='text-3xl font-extrabold  mt-8 mb-4'>$1</h1>"
      )
      .replace(
        /(?:\n|^)- (.*?)(?=\n|$)/g,
        (match, p1) =>
          "<ul class='list-disc ml-6 '><li>$1</li></ul>"
      )
      .replace(
        /\n>\s(.*?)(?=\n|$)/g,
        "<blockquote class='border-l-4 border-blue-500 pl-4 italic text-gray-300 my-2'>$1</blockquote>"
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        "<a href='$2' class='text-blue-400 underline hover:text-blue-300 transition-colors'>$1</a>"
      )
      .replace(/\n/g, "<br>")
      .replace(/(<\/ul><ul class='list-disc ml-6 '>)+/g, "")
      .replace(/(<\/ol><ol class='list-decimal ml-6 '>)+/g, "")
      .replace(/(?:\n|^)- (.*?)(?=\n|$)/g, "<li class=''>$1</li>")
      .replace(/(?:<li.*?>.*?<\/li>)+/g, "<ul class='list-disc ml-6'>$&</ul>")
      .replace(
        /\n>\s(.*?)(?=\n|$)/g,
        "<blockquote class='border-l-4 border-blue-500 pl-4 italic text-gray-300 my-2'>$1</blockquote>"
      )
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        "<a href='$2' class='text-blue-400 underline hover:text-blue-300 transition-colors'>$1</a>"
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
          q: `${topic} tutorial`,
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

  const scanImageForQuestion = async (imageFile) => {
    setIsLoading(true);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imageFile, "eng", {
        logger: (m) => console.log(m),
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

  const isQuestionOrDoubt = (text) => {
    const questionWords = [
      "what",
      "why",
      "how",
      "when",
      "where",
      "who",
      "is",
      "are",
      "does",
      "do",
      "can",
      "could",
      "should",
      "would",
    ];
    const lowerText = text.toLowerCase().trim();
    return (
      lowerText.endsWith("?") ||
      questionWords.some((word) => lowerText.startsWith(word))
    );
  };

  const fetchClarification = async (doubt, topic) => {
    setIsLoading(true);
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
                    text: `The student has a doubt: "${doubt}" related to the topic "${topic}. Provide a clear, concise, and student-friendly explanation to address this doubt in the context of ${topic}. Avoid giving a generic definition of the doubt itself; instead, focus on clarifying it with respect to ${topic}. Include examples if applicable.`,
                  },
                ],
              },
            ],
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch clarification.");
      const data = await res.json();
      const clarification =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "No clarification available.";
      setConversationHistory((prev) => [
        ...prev,
        { type: "user", text: doubt },
        { type: "response", text: clarification },
      ]);
      speakText(clarification);
    } catch (error) {
      setError(`⚠️ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDefinition = useCallback(
    async (queryOverride = null) => {
      const query = queryOverride || scannedQuestion || input.trim();
      if (!query) {
        setError("⚠️ Please enter a topic or upload an image with a question.");
        return;
      }
      if (query.toLowerCase().startsWith("my name is ")) {
        const name = query.substring(11).trim();
        setUserName(name);
        sessionStorage.setItem("userName", name);
        setConversationHistory((prev) => [
          ...prev,
          { type: "user", text: query },
          {
            type: "response",
            text: `Nice to meet you, ${name}! How can I assist you today?`,
          },
        ]);
        setInput("");
        return;
      }
      if (query.toLowerCase() === "what is my name") {
        if (userName) {
          setConversationHistory((prev) => [
            ...prev,
            { type: "user", text: query },
            { type: "response", text: `Your name is ${userName}.` },
          ]);
        } else {
          setConversationHistory((prev) => [
            ...prev,
            { type: "user", text: query },
            {
              type: "response",
              text: "You haven't told me your name yet! Please tell me by saying 'My name is [your name]'.",
            },
          ]);
        }
        setInput("");
        return;
      }

      setError(null);
      setIsLoading(true);
      setHeight(true);
      setTitleName(true);

      // Check if the input is a question/doubt and there's a previous topic
      if (lastTopic && isQuestionOrDoubt(query)) {
        await fetchClarification(query, lastTopic);
        setInput("");
        setScannedQuestion(null);
        return;
      }

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
                      text: `'${query}'`,
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

        setConversationHistory((prev) => [
          ...prev,
          { type: "definition", text: aiDefinition, question: query },
        ]);
        setLastTopic(query); // Set the current topic as the last topic
        setPreviousMcqQuestions([]);
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
    },
    [input, scannedQuestion, userName, lastTopic]
  );

  const fetchAIQuestion = useCallback(async () => {
    if (!conversationHistory.some((item) => item.type === "definition")) return;
    setError(null);
    setIsLoading(true);
    setInputMode("answer");

    try {
      const pastQuestions = conversationHistory
        .filter((item) => item.type === "question")
        .map((item) => item.text)
        .join("\n");
      const latestDefinition =
        conversationHistory
          .filter((item) => item.type === "definition")
          .slice(-1)[0]?.text || "";
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
                    text: `Create a basic, short, and common question based on '${latestDefinition}' that has not been asked before. Here is the full history of previous questions: ${pastQuestions}`,
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
      setConversationHistory((prev) => [
        ...prev,
        { type: "question", text: aiQuestion },
      ]);
      setCurrentQuestion(aiQuestion);
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
                    text: `Evaluate the following question and the user's answer:

Latest Question: ${currentQuestion}

User's Answer: ${input}

If the user's answer is correct, respond with 'It is correct.'

Otherwise, if the user's answer is incorrect, respond with 'It is not correct' and provide the correct answer.

If the user requests an explanation (e.g., by saying 'Explain it,' 'I don’t know,' 'Clarify it,' 'How do I solve it,' or 'How does it work'), do not say 'It is not correct.' Instead, start with 'I can explain it to you.' Then, provide a detailed explanation along with the correct answer`,
                  },
                ],
              },
            ],
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to check answer.");
      const data = await res.json();
      const feedback =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "No feedback available.";

      setConversationHistory((prev) => [
        ...prev,
        { type: "answer", text: input.trim() },
        { type: "response", text: feedback },
      ]);
      speakText(feedback);
      setInput("");
      setInputMode("topic");
      setCurrentQuestion(null);
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
      const latestDefinition =
        conversationHistory
          .filter((item) => item.type === "definition")
          .slice(-1)[0]?.text || "";
      const pastMcqQuestions = previousMcqQuestions.join("\n");

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
                    text: `Generate a multiple-choice question (MCQ) based on '${latestDefinition}'. Ensure the question is different from these previously generated questions: ${
                      pastMcqQuestions || "None"
                    }. Format the response as follows:
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
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to generate MCQ.");

      const data = await res.json();
      const mcqText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!mcqText) throw new Error("No MCQ content received from API.");

      const lines = mcqText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);
      const mcqData = {
        question: "",
        options: {},
        correctAnswer: "",
      };

      lines.forEach((line) => {
        if (line.startsWith("Question:")) {
          mcqData.question = line.replace("Question:", "").trim();
        } else if (/^[A-D]\)/.test(line)) {
          const [key, value] = line.split(")").map((part) => part.trim());
          mcqData.options[key] = value;
        } else if (line.startsWith("Correct Answer:")) {
          mcqData.correctAnswer = line.replace("Correct Answer:", "").trim();
        }
      });

      if (
        !mcqData.question ||
        Object.keys(mcqData.options).length !== 4 ||
        !mcqData.correctAnswer
      ) {
        throw new Error("Invalid MCQ format received from API.");
      }

      if (!["A", "B", "C", "D"].includes(mcqData.correctAnswer)) {
        throw new Error("Correct answer must be A, B, C, or D.");
      }

      if (previousMcqQuestions.includes(mcqData.question)) {
        throw new Error("Generated duplicate MCQ question. Please try again.");
      }

      setMcq(mcqData);
      setConversationHistory((prev) => [
        ...prev,
        { type: "mcq", text: mcqData },
      ]);
      setPreviousMcqQuestions((prev) => [...prev, mcqData.question]);
      speakText(
        `${mcqData.question} A) ${mcqData.options.A} B) ${mcqData.options.B} C) ${mcqData.options.C} D) ${mcqData.options.D}`
      );
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
        : `Incorrect. The correct answer is ${mcq.correctAnswer}: ${
            mcq.options[mcq.correctAnswer]
          }`;

      setConversationHistory((prev) => [
        ...prev,
        {
          type: "mcq_answer",
          text: `You selected: ${selectedOption}) ${mcq.options[selectedOption]}`,
        },
        {
          type: "response",
          text: responseText,
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
    setLastTopic(null); // Reset last topic
  };

  const downloadDefinitionAsWord = () => {
    const definition = conversationHistory.find(
      (item) => item.type === "definition"
    )?.text;
    if (!definition) return;

    const formattedParagraphs = [];
    const lines = definition.split("\n");

    lines.forEach((line) => {
      if (line.startsWith("# ")) {
        formattedParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.replace("# ", ""),
                bold: true,
                size: 36,
              }),
            ],
            spacing: { after: 300 },
          })
        );
      } else if (line.startsWith("## ")) {
        formattedParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.replace("## ", ""),
                bold: true,
                size: 28,
              }),
            ],
            spacing: { after: 250 },
          })
        );
      } else if (line.startsWith("### ")) {
        formattedParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.replace("### ", ""),
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          })
        );
      } else if (line.startsWith("- ")) {
        formattedParagraphs.push(
          new Paragraph({
            text: line.replace("- ", ""),
            bullet: { level: 0 },
            spacing: { after: 150 },
          })
        );
      } else if (/\*\*(.*?)\*\*/.test(line)) {
        formattedParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.replace(/\*\*/g, ""),
                bold: true,
                size: 24,
              }),
            ],
          })
        );
      } else if (/\*(.*?)\*/.test(line)) {
        formattedParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.replace(/\*/g, ""),
                italics: true,
                size: 24,
              }),
            ],
          })
        );
      } else if (/__(.*?)__/.test(line)) {
        formattedParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.replace(/__/g, ""),
                underline: {},
                size: 24,
              }),
            ],
          })
        );
      } else {
        formattedParagraphs.push(
          new Paragraph({
            text: line,
            spacing: { after: 100 },
          })
        );
      }
    });

    const doc = new Document({
      sections: [{ properties: {}, children: formattedParagraphs }],
    });
    Packer.toBlob(doc).then((blob) => saveAs(blob, "Notes.docx"));
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
              className="mt-4 p-2 px-4 bg-blue-500  rounded-full hover:bg-blue-600 transition-colors"
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
                <p className="">by {video.channel}</p>
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
            className="bg-gray-700 m-4 p-3 rounded-lg "
            dangerouslySetInnerHTML={{ __html: formatText(item.text) }}
          />
        );
        break;
      case "answer":
        content = (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left w-full p-3 rounded-lg "
            dangerouslySetInnerHTML={{ __html: formatText(item.text) }}
          />
        );
        break;
      case "response":
        content = (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 m-4 p-3 rounded-lg "
            dangerouslySetInnerHTML={{ __html: formatText(item.text) }}
          />
        );
        break;
      case "mcq":
        content = (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 m-4 p-3 rounded-lg "
          >
            <p
              dangerouslySetInnerHTML={{
                __html: formatText(item.text.question),
              }}
            />
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
              className="mt-4 p-2 px-4 bg-blue-500  rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
            className="text-left w-full p-3 rounded-lg "
            dangerouslySetInnerHTML={{ __html: formatText(item.text) }}
          />
        );
        break;
      case "user":
        content = (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left w-full p-3 rounded-lg "
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
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center font-sans text-white bg-[#212121]">
      <div className={`relative top-[40%] ${titleName ? "hidden" : "block"}`}>
        <h1 className="text-2xl md:text-4xl text-center font-bold max-md:mb-2 tracking-tight">
          👩‍🎓 Hello {userName || "Student"} 🧑‍🎓
        </h1>
        <h2 className="text-2xl md:text-4xl text-center  font-semibold mb-16 max-md:mb-10 tracking-tight">
          How can I help you today?
        </h2>
      </div>

      <div className="w-full flex-1 flex flex-col justify-end">
        <div
          className={`custom-scrollbar flex-1 ${
            height ? "max-h-[76vh]" : "max-h-0"
          } transition-all duration-300 
          overflow-y-scroll scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 
          w-full justify-center items-start flex h-64 `}
          ref={chatContainerRef}
        >
          <div className="flex flex-col justify-center items-center w-3xl">
            {conversationHistory.map(renderConversationItem)}
            {isLoading && (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin py-5" size={20} />
                <span>
                  <Image src={loading} className="w-20" />
                </span>
              </div>
            )}
            {isCheckingAnswer && (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin py-5" size={20} />
                <span>Checking Answer...</span>
              </div>
            )}
            {error && <div className="text-red-400 p-4">{error}</div>}
          </div>
        </div>

            {/* Search bar */}
        <div className="justify-center flex items-center">
          <div className="bg-[#303030]  border border-gray-600 lg:rounded-3xl rounded-t-3xl px-4 py-2 w-3xl">
            <div className="flex relative items-center flex-col justify-between gap-2 max-md:flex-col">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  inputMode === "topic"
                    ? "Enter a Topic or Doubt..."
                    : "Your answer..."
                }
                className="w-full p-3 rounded-xl text-white border-none outline-none transition-all duration-200"
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
                <div
                  className={`flex relative w-full items-center justify-between mb-2 `}
                >
                  <button
                    disabled={isLoading || !conversationHistory.length}
                    className="rounded-full p-1 bg-[#666666] disabled:cursor-not-allowed relative flex w-full max-lg:w-[100%] gap-[6px]"
                  >
                    {/* refresh button */}
                    <motion.button
                      onClick={() => {
                        refreshConversation();
                      }}
                      whileTap={{ scale: 0.9 }}
                      disabled={isLoading || !conversationHistory.length}
                      className="  w-[45px] h-[45px]  rounded-full text-sm 
                      font-medium transition-colors  disabled:cursor-not-allowed"
                    >
                      <motion.button className="p-3 text-black bg-white rounded-full transition-colors">
                        <MdRefresh size={20} />
                      </motion.button>
                    </motion.button>

                    {/* open camera */}
                    <motion.button
                      onClick={() => {
                        cameraInputRef.current.click();
                        setIsUploadModalOpen((prev) => !prev);
                      }}
                      disabled={isLoading || !conversationHistory.length}
                      whileTap={{ scale: 0.9 }}
                      className="w-[40px] h-[45px] text-black rounded-full text-sm 
                      font-medium transition-colors  disabled:cursor-not-allowed"
                    >
                      <Image src={camera} className="" />
                      <input
                        type="file"
                        ref={cameraInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                      />
                    </motion.button>

                    {/* upload image */}
                    <motion.button
                      onClick={() => {
                        fileInputRef.current.click();
                        setIsUploadModalOpen((prev) => !prev);
                      }}
                      disabled={isLoading || !conversationHistory.length}
                      whileTap={{ scale: 0.9 }}
                      className=" w-[40px] h-[45px] text-gray-500 rounded-full
                       text-sm font-medium transition-colors  disabled:cursor-not-allowed"
                    >
                      <Image src={image_file} className="" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </motion.button>

                    {/* student councilor */}
                    <motion.button
                      onClick={() => setIsUploadModalOpen((prev) => !prev)}
                      disabled={isLoading || !conversationHistory.length}
                      className=" w-[45px] h-[45px]  border-gray-500 rounded-full text-sm font-medium
                       hover:bg-gray-300 transition-colors  disabled:cursor-not-allowed"
                    >
                      <Link href={"/Councilor"} aria-label={"Speed Test"}>
                      <Image src={student_councilor} className="" />
                      </Link>
                    </motion.button>

                    {/* ask questions */}
                    <motion.button
                      onClick={fetchAIQuestion}
                      disabled={isLoading || !conversationHistory.length}
                      className=" w-[45px] h-[45px]  rounded-full text-sm font-medium transition-colors
                       disabled:cursor-not-allowed"
                    >
                     <Image src={question} className="" alt="" />
                    </motion.button>

                    {/* generate MCQ */}
                    <motion.button
                      onClick={generateMCQ}
                      disabled={
                        isLoading ||
                        !conversationHistory.some(
                          (item) => item.type === "definition"
                        )
                      }
                      className=" w-[40px] h-[45px] rounded-full text-sm font-medium hover:bg-gray-300
                       transition-colors disabled:cursor-not-allowed"
                    >
                      <Image src={test} className="" />
                    </motion.button>
                  </button>

                  {/* search button */}
                  <motion.button
                    disabled={isLoading}
                    className="w-[45px] absolute right-1 h-[45px] flex items-center
                     flex-col justify-center border border-gray-500 bg-white
                      text-black rounded-full font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {input.trim() === "" ? (
                      <motion.button onClick={handleVoiceClick}>
                        <FaMicrophone />
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={fetchDefinition}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <IoCreateOutline />
                        ) : (
                          <FaArrowUp onClick={() => fetchDefinition()} />
                        )}
                      </motion.button>
                    )}
                  </motion.button>
                </div>
              </div>

              <p className="text-xs text-center text-gray-500 hidden max-lg:block">
                Explore AI and education with our artificial intelligence in
                education platform! Solve doubts instantly using our math
                problem solver powered by artificial intelligence on education.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionAnyTopic;
