"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const EditorJS = dynamic(() => import("@editorjs/editorjs"), { ssr: false });

export default function StudentNotebook({ messages = [], textTheme }) {
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
        .map(
          (_, idx) =>
            `<div style="position: absolute; top: ${
              25 * (idx + 1)
            }px; left: 0; right: 0; border-bottom: 1px dashed #ccc;"></div>`
        )
        .join("");

      const pageHtml = `
      <div style="position: relative; page-break-after: always; padding: 40px; border: 1px solid #ddd; height: 800px;
       box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <h2 style="font-size: 20px; font-weight: bold;">📓 My Notebook</h2>
          <span style="font-size: 14px; color: gray;">Page ${i + 1}</span>
        </div>

        <div style="position: relative; font-family: serif; font-size: 16px; line-height: 1.8; color: #333;">
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
    <div
      className={`  px-4 py-4 flex flex-col items-center ${textTheme}`}
    >
      {/* Header */}
      {/* <div className="w-full max-w-3xl mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">📓 My Notebook</h1>
          <p className="text-sm text-gray-500">Page {currentPage + 1}</p>
        </div>
        <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
      </div> */}

      {/* Editor Area with Notebook Styling */}
      <div className="relative w-full max-w-3xl overflow-y-scroll custom-scrollbar h-[28rem] rounded-xl shadow-lg border px-4 py-5">
        {/* EditorJS container */}
        <div
          id={`editor-holder-${currentPage}`}
          className="min-h-[400px] text-base leading-relaxed font-serif relative z-10"
          ref={editorContainerRef}
        />

        {/* Lined Background */}
        <div className="absolute top-0 inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="border-b  border-dashed border-gray-300 absolute w-full"
              style={{ top: `${(i + 1) * 26}px` }}
            />
          ))}
        </div>
      </div>
      {/* Pagination */}
      <div className="flex items-center py-2 justify-between w-full max-w-3xl ">
          {/* Download Button */}
          <button
            onClick={handleDownloadPDF}
            className=" bg-green-600 text-white  px-6 py-2 rounded hover:bg-green-700"
          >
             Download Notebook as PDF
          </button>

          <p className="text-gray-500">
            Page {currentPage + 1} of {chunks.length}
          </p>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
          >
            ◀ Prev
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, chunks.length - 1))
            }
            className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Next ▶
          </button>
        </div>
    </div>
  );
}
