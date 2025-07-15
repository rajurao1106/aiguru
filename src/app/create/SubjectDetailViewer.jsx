"use client";
import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { toggleSubjectbar } from "@/redux/subjectbar"; 
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from "react-icons/tb";

export default function AiStudyTool({ selectedSubject, setSelectedSubject }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [chapterTopics, setChapterTopics] = useState({});
  const [savedResponses, setSavedResponses] = useState({});
  const [selected, setSelected] = useState({ chapter: "", topic: "" });
  const [editing, setEditing] = useState({ chapter: "", topic: "", value: "" });
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMCQ, setShowMCQ] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showNotebook, setShowNotebook] = useState(false);

   const dispatch = useDispatch(); // ✅ FIXED: added dispatch
    const isSubjectbarOpen = useSelector((state) => state.subjectbar.isSubjectbarOpen);
   const openSubjectbar = () => {
      dispatch(toggleSubjectbar());
    };

  // Load for current subject
// In AiStudyTool.jsx
useEffect(() => {
  setHasMounted(true);
  const allTopics = JSON.parse(localStorage.getItem("chapterTopics") || "{}");
  const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");

  // Initialize chapterTopics and savedResponses for the subject if not present
  if (!allTopics[selectedSubject]) allTopics[selectedSubject] = {};
  if (!allResponses[selectedSubject]) allResponses[selectedSubject] = {};

  setChapterTopics(allTopics[selectedSubject] || {});
  setSavedResponses(allResponses[selectedSubject] || {});
  setSelected({ chapter: "", topic: "" });
  setAiResponse("");
  setChapter(""); // Reset chapter input
  setTopic(""); // Reset topic input
  setShowMCQ(false); // Reset quiz state
  setShowNotebook(false); // Reset notebook state
  localStorage.setItem("-chapterTopics", JSON.stringify(allTopics));
  localStorage.setItem("savedResponses", JSON.stringify(allResponses));
}, [selectedSubject]);

  // Save chapterTopics
  useEffect(() => {
    if (!hasMounted) return;
    const allTopics = JSON.parse(localStorage.getItem("chapterTopics") || "{}");
    allTopics[selectedSubject] = chapterTopics;
    localStorage.setItem("chapterTopics", JSON.stringify(allTopics));
  }, [chapterTopics, hasMounted, selectedSubject]);

  // Save AI responses per subject automatically inside fetch
  useEffect(() => {
    if (!selected.chapter || !selected.topic) return;

    const fetchAI = async () => {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        setAiResponse("❌ API key is not configured.");
        setLoading(false);
        return;
      }

      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Explain the topic "${selected.topic}" from the chapter "${selected.chapter}" in a simple and interesting way for students.`,
                    },
                  ],
                },
              ],
            }),
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        const text =
          data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer.";
        setAiResponse(text);

        const updated = { ...savedResponses };
        if (!updated[selected.chapter]) updated[selected.chapter] = {};
        updated[selected.chapter][selected.topic] = text;
        setSavedResponses(updated);

        const allResponses = JSON.parse(
          localStorage.getItem("savedResponses") || "{}"
        );
        allResponses[selectedSubject] = updated;
        localStorage.setItem("savedResponses", JSON.stringify(allResponses));
      } catch (err) {
        console.error(err);
        setAiResponse(
          err.name === "AbortError"
            ? "❌ Request timed out."
            : `❌ Error: ${err.message}`
        );
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchAI();
  }, [selected.chapter, selected.topic]);

  // Add topic
// In AiStudyTool.jsx
const handleAddTopic = (e) => {
  e.preventDefault();
  if (!chapter.trim() || !topic.trim()) return;
  setChapterTopics((prev) => {
    const curr = { ...prev };
    if (!curr[chapter]) curr[chapter] = [];
    if (!curr[chapter].includes(topic)) curr[chapter].push(topic);
    return curr;
  });
  setChapter(""); // Clear chapter input
  setTopic(""); // Clear topic input
};

  // Delete topic
  const handleDeleteTopic = (chapName, topicName) => {
    setChapterTopics((prev) => {
      const curr = { ...prev };
      curr[chapName] = curr[chapName].filter((t) => t !== topicName);
      if (curr[chapName].length === 0) delete curr[chapName];
      return curr;
    });

    const updated = { ...savedResponses };
    if (updated[chapName]) {
      delete updated[chapName][topicName];
      if (Object.keys(updated[chapName]).length === 0) delete updated[chapName];
      setSavedResponses(updated);
      const allResponses = JSON.parse(
        localStorage.getItem("savedResponses") || "{}"
      );
      allResponses[selectedSubject] = updated;
      localStorage.setItem("savedResponses", JSON.stringify(allResponses));
    }

    if (selected.chapter === chapName && selected.topic === topicName) {
      setSelected({ chapter: "", topic: "" });
      setAiResponse("");
    }
  };

  // Start editing topic name
  const startEdit = (chap, top) => {
    setEditing({ chapter: chap, topic: top, value: top });
  };

  // Save edited topic
  const saveEdit = () => {
    const { chapter: chap, topic: oldT, value: newT } = editing;
    if (!newT.trim()) return;

    setChapterTopics((prev) => {
      const curr = { ...prev };
      curr[chap] = curr[chap].map((t) => (t === oldT ? newT : t));
      return curr;
    });

    const updated = { ...savedResponses };
    if (updated[chap] && updated[chap][oldT]) {
      updated[chap][newT] = updated[chap][oldT];
      delete updated[chap][oldT];
      setSavedResponses(updated);

      const allResponses = JSON.parse(
        localStorage.getItem("savedResponses") || "{}"
      );
      allResponses[selectedSubject] = updated;
      localStorage.setItem("savedResponses", JSON.stringify(allResponses));
    }

    if (selected.chapter === chap && selected.topic === oldT) {
      setSelected({ chapter: chap, topic: newT });
    }
    setEditing({ chapter: "", topic: "", value: "" });
  };

  // Quiz logic — same as before
  const startQuiz = () => {
    const mock = [
      {
        question: `Key idea of ${selected.topic}?`,
        options: ["A", "B", "C", "D"],
        correct: 1,
      },
      {
        question: `Real life use of ${selected.topic}?`,
        options: ["A", "B", "C", "D"],
        correct: 2,
      },
    ];
    setQuestions(mock);
    setCurrent(0);
    setScore(0);
    setQuizFinished(false);
    setShowMCQ(true);
  };
  const handleAnswer = (i) => {
    if (i === questions[current].correct) setScore((s) => s + 1);
    if (current + 1 < questions.length) setCurrent((c) => c + 1);
    else setQuizFinished(true);
  };

  const downloadPDF = async () => {
    const element = document.getElementById("notebook-content");
    if (!element) {
      console.error("Notebook content element not found!");
      alert("Cannot generate PDF: Notebook content is not available.");
      return;
    }
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0.5,
        filename: `${selected.chapter || "Notebook"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(element).save();
      console.log("PDF generation successful");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (!hasMounted) return null;

  return (
    <div className="flex flex-row h-[92vh] ">
       {/* Main Panel */}
      <div className="w-full p-4 overflow-y-auto custom-scrollbar">
      <div className="w-full flex justify-between">
           <button
            onClick={() => setSelectedSubject("")}
            className="p-2 hover:bg-gray-500/20 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
           <button className="text-2xl" onClick={openSubjectbar}>
                    {isSubjectbarOpen ? (
                      <TbLayoutSidebarLeftCollapse />
                    ) : (
                      <TbLayoutSidebarRightCollapse />
                    )}
                  </button>
      </div>
        {showNotebook ? (
          <>
            <button
              onClick={downloadPDF}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              📥 Save as PDF
            </button>
            <button
              onClick={() => setShowNotebook(false)}
              className="ml-4 text-red-600"
            >
              ❌ Close Notebook
            </button>
            <h2 className="text-2xl font-bold mb-4 text-purple-700">
              📒 My Notebook
            </h2>
            <div id="notebook-content">
              {Object.entries(savedResponses).map(([chap, tops]) => (
                <div key={chap}>
                  <h3>{chap}</h3>
                  {Object.entries(tops).map(([tName, cont], idx) => (
                    <div key={idx} className="pl-4 mt-2">
                      <h4>📌 {tName}</h4>
                      <p className="p-3 whitespace-pre-wrap"><ReactMarkdown>{cont}</ReactMarkdown></p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : showMCQ ? (
          <>
            <h2 className="text-xl font-bold text-green-700 mb-4">
              📝 Quiz: {selected.topic}
            </h2>
            {!quizFinished ? (
              <>
                <p className="text-lg font-medium">
                  {questions[current].question}
                </p>
                {questions[current].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="block w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                  >
                    {opt}
                  </button>
                ))}
              </>
            ) : (
              <>
                <p className="text-xl font-semibold text-blue-600">
                  🎉 Quiz Complete! Your Score: {score} / {questions.length}
                </p>
                <button
                  onClick={() => setShowMCQ(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  🔙 Back to Topic
                </button>
              </>
            )}
          </>
        ) : selected.topic ? (
          <>
            <h2 className="text-xl font-bold text-blue-800 mb-4">
              📘 {selected.chapter} → 🧠 {selected.topic}
            </h2>
            {loading ? (
              <p className="text-blue-500 animate-pulse">⏳ Loading...</p>
            ) : aiResponse ? (
              <pre className="p-4 whitespace-pre-wrap">
                <ReactMarkdown>{aiResponse}</ReactMarkdown>
              </pre>
            ) : (
              <p className="text-red-500">No response available.</p>
            )}
            {/* <button
              onClick={startQuiz}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              🧪 Practice MCQs
            </button> */}
          </>
        ) : (
          <p className="text-gray-600 text-lg">
            
            👈 Select a topic to view explanation
            
          </p>
        )}
      </div>
      {/* Sidebar */}
    <div
  className={`max-w-sm border-l border-gray-600 h-full overflow-y-auto transition-all duration-300 ${
    isSubjectbarOpen ? "w-0 overflow-hidden" : " w-1/3 max-lg:w-1/2 p-5 absolute right-0 bg-gray-900"
  }`}
>
    <div className="flex items-center justify-between mb-6">
         
          <h2 className="text-base ">
           <button className="text-2xl" onClick={openSubjectbar}>
                    {isSubjectbarOpen ? (
                      <TbLayoutSidebarLeftCollapse />
                    ) : (
                      <TbLayoutSidebarRightCollapse />
                    )}
                  </button>
            Subject:{" "}
            <span className="text-blue-600 dark:text-blue-400 font-normal">
              {selectedSubject
                .toLowerCase()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </span>
          </h2>
        </div>

        <form onSubmit={handleAddTopic} className="space-y-3 mb-6">
          <input
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="Chapter name"
            className="w-full px-3 py-2 rounded-lg border "
          />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic title"
            className="w-full px-3 py-2 rounded-lg border "
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
             Add Topic
          </button>
        </form>

        <div className="space-y-6">
          {Object.entries(chapterTopics).map(([chap, topics]) => (
            <div key={chap}>
              <h3 className="uppercase font-semibold mb-2 ">{chap}</h3>
              <ul className="ml-3 space-y-1">
                {topics.map((t, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {editing.chapter === chap && editing.topic === t ? (
                      <>
                        <input
                          value={editing.value}
                          onChange={(e) =>
                            setEditing((ed) => ({
                              ...ed,
                              value: e.target.value,
                            }))
                          }
                          className="px-2 w-[13vw] py-1 border rounded"
                        />
                        <button onClick={saveEdit} className="text-green-600">
                          ✅
                        </button>
                        <button
                          onClick={() =>
                            setEditing({ chapter: "", topic: "", value: "" })
                          }
                        >
                          ❌
                        </button>
                      </>
                    ) : (
                      <>
                        <span
                          onClick={() =>
                            setSelected({ chapter: chap, topic: t })
                          }
                          className="flex-1 cursor-pointer hover:text-blue-600"
                        >
                          {t}
                        </span>
                        <button
                          onClick={() => startEdit(chap, t)}
                          className="text-yellow-500"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(chap, t)}
                          className="text-red-500"
                        >
                          ❌
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowNotebook(true)}
          className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
        >
           Open Notebook
        </button>
      </div>

     
    </div>
  );
}
