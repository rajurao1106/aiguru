import axios from "axios";
import Tesseract from "tesseract.js";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export const fetchYouTubeVideo = async (topic) => {
  const apiKey = "AIzaSyDnlqKMLVXtf3_JPMwZxHePYjWTwhovoJM";
  const baseUrl = "https://www.googleapis.com/youtube/v3/search";
  const reputableChannels = {
    "Traversy Media": "UC29ju8bIPH5as8OGnQzwJyA",
    "freeCodeCamp.org": "UC8butISFwT-Wl7EV0hUK0BQ",
    "The Net Ninja": "UCW5YeuERMmlnqo4oq8vwUpg",
    Academind: "UCSJbGtTlrDami-tDGPUV9-w",
  };

  try {
    const response = await axios.get(baseUrl, { params: { part: "snippet", q: `${topic} tutorial`, type: "video", maxResults: 10, order: "relevance", key: apiKey } });
    const videos = response.data.items;
    if (!videos || videos.length === 0) return null;

    const reputableVideos = videos.filter((video) => Object.values(reputableChannels).includes(video.snippet.channelId));
    const bestVideo = reputableVideos.length > 0 ? reputableVideos[0] : videos[0];

    return { title: bestVideo.snippet.title, url: `https://www.youtube.com/watch?v=${bestVideo.id.videoId}`, channel: bestVideo.snippet.channelTitle };
  } catch (error) {
    console.error("Error fetching YouTube video:", error.message);
    return null;
  }
};

export const scanImageForQuestion = async (imageFile, setIsLoading, setError, setScannedQuestion, setInput) => {
  setIsLoading(true);
  try {
    const { data: { text } } = await Tesseract.recognize(imageFile, "eng", { logger: (m) => console.log(m) });
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

export const fetchDefinition = async (input, scannedQuestion, setError, setIsLoading, setHeight, setTitleName, setPreviousMcqQuestions, setConversationHistory, speakText, fetchYouTubeVideo, setVideo, setInput, setScannedQuestion) => {
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
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `Generate a detailed and student-friendly definition of '${query}' that encompasses all key aspects, subtopics, and related concepts. Include relatable examples or practical applications to illustrate the topic, and address common doubts, misconceptions, or frequently asked questions associated with '${query}' to ensure a thorough and engaging understanding.` }] }],
      }),
    });
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
};

export const fetchAIQuestion = async (conversationHistory, setError, setIsLoading, setInputMode, setConversationHistory, speakText, setCurrentQuestion) => {
  if (!conversationHistory.some((item) => item.type === "definition")) return;
  setError(null);
  setIsLoading(true);
  setInputMode("answer");

  try {
    const pastQuestions = conversationHistory.filter((item) => item.type === "question").map((item) => item.text).join("\n");
    const latestDefinition = conversationHistory.filter((item) => item.type === "definition").slice(-1)[0]?.text || "";
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `Create a basic, short, and common interview question based on '${latestDefinition}' that has not been asked before. Here is the full history of previous questions: ${pastQuestions}` }] }],
      }),
    });
    if (!res.ok) throw new Error("Failed to fetch question.");
    const data = await res.json();
    const aiQuestion = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No question available.";
    setConversationHistory((prev) => [...prev, { type: "question", text: aiQuestion }]);
    setCurrentQuestion(aiQuestion);
    speakText(aiQuestion);
  } catch (error) {
    setError(`⚠️ ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

export const checkAnswer = async (input, currentQuestion, setIsCheckingAnswer, setError, setConversationHistory, speakText, setInput, setInputMode, setCurrentQuestion) => {
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
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `Evaluate this answer: "${input.trim()}" for the question: "${currentQuestion}". Provide feedback on whether the answer is correct, partially correct, or incorrect, and explain why.` }] }],
      }),
    });
    if (!res.ok) throw new Error("Failed to check answer.");
    const data = await res.json();
    const feedback = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No feedback available.";

    setConversationHistory((prev) => [...prev, { type: "answer", text: input.trim() }, { type: "response", text: feedback }]);
    speakText(feedback);
    setInput("");
    setInputMode("topic");
    setCurrentQuestion(null);
  } catch (error) {
    setError(`⚠️ ${error.message}`);
  } finally {
    setIsCheckingAnswer(false);
  }
};

export const generateMCQ = async (conversationHistory, previousMcqQuestions, setError, setIsLoading, setMcq, setSelectedOption, setConversationHistory, setPreviousMcqQuestions, speakText) => {
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
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `Generate a multiple-choice question (MCQ) based on '${latestDefinition}'. Ensure the question is different from these previously generated questions: ${pastMcqQuestions || "None"}. Format the response as follows:
          Question: [Your question here]
          A) [Option A]
          B) [Option B]
          C) [Option C]
          D) [Option D]
          Correct Answer: [A/B/C/D]` }] }],
      }),
    });

    if (!res.ok) throw new Error("Failed to generate MCQ.");
    const data = await res.json();
    const mcqText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!mcqText) throw new Error("No MCQ content received from API.");

    const lines = mcqText.split("\n").map(line => line.trim()).filter(line => line);
    const mcqData = { question: "", options: {}, correctAnswer: "" };
    lines.forEach((line) => {
      if (line.startsWith("Question:")) mcqData.question = line.replace("Question:", "").trim();
      else if (/^[A-D]\)/.test(line)) {
        const [key, value] = line.split(")").map(part => part.trim());
        mcqData.options[key] = value;
      } else if (line.startsWith("Correct Answer:")) mcqData.correctAnswer = line.replace("Correct Answer:", "").trim();
    });

    if (!mcqData.question || Object.keys(mcqData.options).length !== 4 || !mcqData.correctAnswer) throw new Error("Invalid MCQ format received from API.");
    if (!["A", "B", "C", "D"].includes(mcqData.correctAnswer)) throw new Error("Correct answer must be A, B, C, or D.");
    if (previousMcqQuestions.includes(mcqData.question)) throw new Error("Generated duplicate MCQ question. Please try again.");

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
};

export const downloadDefinitionAsWord = (conversationHistory) => {
  const definition = conversationHistory.find((item) => item.type === "definition")?.text;
  if (!definition) return;

  const formattedParagraphs = [];
  const lines = definition.split("\n");

  lines.forEach((line) => {
    if (line.startsWith("# ")) {
      formattedParagraphs.push(new Paragraph({ children: [new TextRun({ text: line.replace("# ", ""), bold: true, size: 36 })], spacing: { after: 300 } }));
    } else if (line.startsWith("## ")) {
      formattedParagraphs.push(new Paragraph({ children: [new TextRun({ text: line.replace("## ", ""), bold: true, size: 28 })], spacing: { after: 250 } }));
    } else if (line.startsWith("### ")) {
      formattedParagraphs.push(new Paragraph({ children: [new TextRun({ text: line.replace("### ", ""), bold: true, size: 24 })], spacing: { after: 200 } }));
    } else if (line.startsWith("- ")) {
      formattedParagraphs.push(new Paragraph({ text: line.replace("- ", ""), bullet: { level: 0 }, spacing: { after: 150 } }));
    } else if (/\*\*(.*?)\*\*/.test(line)) {
      formattedParagraphs.push(new Paragraph({ children: [new TextRun({ text: line.replace(/\*\*/g, ""), bold: true, size: 24 })] }));
    } else if (/\*(.*?)\*/.test(line)) {
      formattedParagraphs.push(new Paragraph({ children: [new TextRun({ text: line.replace(/\*/g, ""), italics: true, size: 24 })] }));
    } else if (/__(.*?)__/.test(line)) {
      formattedParagraphs.push(new Paragraph({ children: [new TextRun({ text: line.replace(/__/g, ""), underline: {}, size: 24 })] }));
    } else {
      formattedParagraphs.push(new Paragraph({ text: line, spacing: { after: 100 } }));
    }
  });

  const doc = new Document({ sections: [{ properties: {}, children: formattedParagraphs }] });
  Packer.toBlob(doc).then((blob) => saveAs(blob, "definition.docx"));
};