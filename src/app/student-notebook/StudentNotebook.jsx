"use client";

import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function StudentNotebook({ messages = [], textTheme }) {
  const [chunks, setChunks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const splitPagesByHeight = () => {
      if (!contentRef.current) return;
      const containerHeight = contentRef.current.offsetHeight;
      const lines = pages[0].content.split("\n");
      let currentPageContent = "";
      const newPages = [];
      let currentHeight = 0;
      const lineHeightPx = 16;

      lines.forEach((line) => {
        const estimatedLineHeight = line.startsWith("# ")
          ? 1.5 * lineHeightPx
          : line.startsWith("## ")
          ? 1.3 * lineHeightPx
          : lineHeightPx;
        currentHeight += estimatedLineHeight;

        if (currentHeight <= containerHeight) {
          currentPageContent += (currentPageContent ? "\n" : "") + line;
        } else {
          if (currentPageContent) {
            newPages.push({ content: currentPageContent, id: `page-${newPages.length}` });
          }
          currentPageContent = line;
          currentHeight = estimatedLineHeight;
        }
      });

      if (currentPageContent) {
        newPages.push({ content: currentPageContent, id: `page-${newPages.length}` });
      }

      if (newPages.length === 0) newPages.push({ content: "", id: "page-0" });

      setPages(newPages);
      if (currentPage >= newPages.length) {
        setCurrentPage(newPages.length - 1);
      }
    };

    splitPagesByHeight();
  }, [messages]);

  const handlePrevPage = () => currentPage > 0 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < pages.length - 1 && setCurrentPage(currentPage + 1);

  const handleDownloadPDF = async () => {
    if (typeof window === "undefined") return;

    const { default: html2pdf } = await import("html2pdf.js");
    const contentContainer = document.createElement("div");

    for (let i = 0; i < chunks.length; i++) {
      const linesHTML = Array.from({ length: 20 })
        .map(
          (_, idx) =>
            `<div style="position: absolute;
        
            left: 0; right: 0; "></div>`
        )
        .join("");

          //  top: ${
          //     25 * (idx + 1)
          //   }px; 
          // border-bottom: 1px dashed #ccc;

      const pageHtml = `
      <div style="position: relative; page-break-after: always; padding: 40px;  height: 800px;
       box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <h2 style="font-size: 20px; font-weight: bold;">📓 My Notebook</h2>
          <span style="font-size: 14px; ">Page ${i + 1}</span>
        </div>

        <div style="position: relative;  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size: 16px; line-height: 1.8;">
          ${chunks[i] || ""}
          ${linesHTML}
        </div>
      </div>
    `;
    // border: 1px solid #ddd;
    // color: gray;
    //  color: #333;

      const div = document.createElement("div");
      div.innerHTML = pageHtml;
      contentContainer.appendChild(div);
    }

    doc.save("notebook.pdf");
  };

  const markdownComponents = {
    h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-lg font-semibold mb-1.5">{children}</h2>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    ul: ({ children }) => <ul className="ml-4 list-disc">{children}</ul>,
    ol: ({ children }) => <ol className="ml-4 list-decimal">{children}</ol>,
    a: ({ children, href }) => (
      <a href={href} className="text-blue-600 hover:underline">{children}</a>
    ),
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
        <div className="absolute top-5 inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className=" absolute w-full"
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
