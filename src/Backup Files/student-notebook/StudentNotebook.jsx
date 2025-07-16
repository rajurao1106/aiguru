"use client";

import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function StudentNotebook({ messages = [], handleNotes }) {
  const initializePages = () => {
    const combinedContent = messages
      .map((msg) =>
        typeof msg === "object" && "content" in msg
          ? String(msg.content || "").trim()
          : String(msg || "").trim()
      )
      .filter((content) => content.length > 0)
      .join("\n\n");

    return combinedContent
      ? [{ content: combinedContent, id: "page-0" }]
      : [{ content: "", id: "page-0" }];
  };

  const [pages, setPages] = useState(initializePages());
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef(null);

  const handleContentChange = (e) => {
    const updatedPages = [...pages];
    updatedPages[currentPage].content = e.target.value;
    setPages(updatedPages);
  };

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

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
  };

  const renderMarkdownToPDF = (doc, text, x, y, maxWidth, lineHeight, pageHeight) => {
    const lines = text.split("\n");
    let currentY = y;

    lines.forEach((line) => {
      let fontSize = 12;
      let fontStyle = "normal";
      let textContent = line;

      if (line.startsWith("# ")) {
        fontSize = 16;
        fontStyle = "bold";
        textContent = line.slice(2);
      } else if (line.startsWith("## ")) {
        fontSize = 14;
        fontStyle = "bold";
        textContent = line.slice(3);
      }

      doc.setFontSize(fontSize);
      doc.setFont("times", fontStyle);

      const cleanText = textContent.replace(/\*\*(.*?)\*\*/g, "$1");
      const wrappedLines = doc.splitTextToSize(cleanText, maxWidth);

      wrappedLines.forEach((wrappedLine) => {
        if (currentY + lineHeight > pageHeight + y) {
          doc.addPage();
          currentY = y;
        }
        doc.text(wrappedLine, x, currentY);
        currentY += lineHeight;
      });
    });

    return currentY;
  };

  const handleDownload = () => {
    const doc = new jsPDF({
      format: "a5",
      unit: "mm",
    });

    const margin = 15;
    const maxLineWidth = doc.internal.pageSize.width - 2 * margin;
    const lineHeight = 6;
    const pageHeight = doc.internal.pageSize.height - 2 * margin;

    doc.setFontSize(12);
    doc.setFont("times", "normal");

    pages.forEach((page, index) => {
      if (index > 0) doc.addPage();
      renderMarkdownToPDF(
        doc,
        page.content,
        margin,
        margin,
        maxLineWidth,
        lineHeight,
        pageHeight
      );
    });

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
    <div className="flex flex-col max-lg:mt-[4rem] justify-center items-center">
      <div className="rounded-xl shadow-2xl flex flex-col gap-2 w-full max-w-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage + 1} of {pages.length}
          </span>
          <button
            onClick={handleNotes}
            className="bg-blue-600 px-5 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-base font-medium"
          >
            Back
          </button>
        </div>

        <div className="relative border border-gray-300 rounded-lg h-[26rem] max-lg:h-[38rem] overflow-hidden shadow-inner">
          {pages.map((page, index) => (
            <div
              key={page.id}
              className={`absolute w-full h-full p-4 transition-opacity duration-300 ${
                index === currentPage ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{ aspectRatio: "1 / 1.414" }}
            >
              {isEditing ? (
                <textarea
                  value={page.content}
                  onChange={handleContentChange}
                  className="w-full h-full bg-white text-black p-2 rounded-md text-xs resize-none"
                />
              ) : (
                <div
                  className="h-full overflow-auto prose prose-sm text-xs max-w-none"
                  ref={index === 0 ? contentRef : null}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {page.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors text-sm"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
              disabled={pages.every((page) => !page.content.trim())}
            >
              Download PDF
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handlePrevPage}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 text-sm"
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 text-sm"
              disabled={currentPage === pages.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
