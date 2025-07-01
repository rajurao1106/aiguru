"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const EditorJS = dynamic(() => import("@editorjs/editorjs"), { ssr: false });

export default function StudentNotebook({ messages = [], textTheme, handleNotes }) {
  const [chunks, setChunks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  const WORDS_PER_PAGE = 100;

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br>");
  };

  const splitMessagesIntoChunks = () => {
    const markdownText = messages
      .map((msg) => {
        const role = msg.role === "user" ? "🧑 User:" : "🤖 AI:";
        const rawContent = msg.content?.trim() || "";
        const formatted = formatText(rawContent);
        return `${role}<br><br>${formatted}`;
      })
      .join("<br><br>");

    const words = markdownText.trim().split(/\s+/);
    const pages = [];

    for (let i = 0; i < words.length; i += WORDS_PER_PAGE) {
      pages.push(words.slice(i, i + WORDS_PER_PAGE).join(" "));
    }

    return pages;
  };

  const initEditor = async (text) => {
    if (editorRef.current) {
      await editorRef.current.destroy();
      editorRef.current = null;
    }

    if (typeof window !== "undefined" && editorContainerRef.current) {
      const { default: Editor } = await import("@editorjs/editorjs");

      const instance = new Editor({
        holder: `editor-holder-${currentPage}`,
        data: {
          blocks: [
            {
              type: "paragraph",
              data: { text },
            },
          ],
        },
        autofocus: true,
        onReady: () => {
          editorRef.current = instance;
        },
      });
    }
  };

  useEffect(() => {
    const pages = splitMessagesIntoChunks();
    setChunks(pages);
    setCurrentPage(0);
  }, [messages]);

  useEffect(() => {
    if (chunks.length > 0 && typeof window !== "undefined") {
      const text = chunks[currentPage] || "";
      initEditor(text);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [currentPage, chunks]);

  const handleDownloadPDF = async () => {
    if (typeof window === "undefined") return;

    const { default: html2pdf } = await import("html2pdf.js");
    const contentContainer = document.createElement("div");

    for (let i = 0; i < chunks.length; i++) {
      const linesHTML = Array.from({ length: 20 })
        .map((_, idx) => `<div style="position: absolute; left: 0; right: 0;"></div>`)
        .join("");

      const pageHtml = `
        <div style="position: relative; page-break-after: always; padding: 40px; height: 800px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <h2 style="font-size: 20px; font-weight: bold;">📓 My Notebook</h2>
            <span style="font-size: 14px;">Page ${i + 1}</span>
          </div>
          <div style="position: relative; font-size: 16px; line-height: 1.8;">
            ${chunks[i] || ""}
            ${linesHTML}
          </div>
        </div>
      `;

      const div = document.createElement("div");
      div.innerHTML = pageHtml;
      contentContainer.appendChild(div);
    }

    html2pdf()
      .set({
        margin: 0,
        filename: "notebook.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(contentContainer)
      .save();
  };

  return (
    <div className={`w-full px-4 ${textTheme}`}>
     

      {/* Editor */}
      <div className="relative w-full max-w-4xl mx-auto h-[25rem] border rounded-xl shadow overflow-y-scroll custom-scrollbar">
        <div
          id={`editor-holder-${currentPage}`}
          className="min-h-[400px] p-6 text-base leading-relaxed font-serif z-10 relative"
          ref={editorContainerRef}
        />
        {/* Background lines */}
        <div className="absolute top-5 inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-full  border-gray-200" style={{ top: `${(i + 1) * 26}px` }} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-4xl mx-auto mt-6 flex flex-wrap gap-4 items-center justify-between">
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
        >
          Download as PDF
        </button>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600"
          >
            ◀ Prev
          </button>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, chunks.length - 1))}
            disabled={currentPage === chunks.length - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600"
          >
            Next ▶
          </button>
        </div>

        <button
          onClick={handleNotes}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Save Notes
        </button>
      </div>
       {/* Header */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          {/* <h1 className="text-2xl md:text-3xl font-bold text-gray-700">📓 My Notebook</h1> */}
          <p className="text-sm text-gray-500">Page {currentPage + 1} of {chunks.length}</p>
        </div>
        <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}
