'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const EditorJS = dynamic(() => import('@editorjs/editorjs'), { ssr: false });
let html2pdf = null;

export default function NotebookEditor() {
  const [currentPage, setCurrentPage] = useState(0);
  const [editors, setEditors] = useState([]);
  const pageHoldersRef = useRef([]);

  const totalPages = 5; // 👈 change to any number of pages

  useEffect(() => {
    const load = async () => {
      html2pdf = (await import('html2pdf.js')).default;
      const EditorJSModule = (await import('@editorjs/editorjs')).default;

      const newEditors = [];

      for (let i = 0; i < totalPages; i++) {
        const editor = new EditorJSModule({
          holder: `editor-holder-${i}`,
          placeholder: `✍️ Page ${i + 1}: Start writing...`,
          data: {
            blocks: [
              {
                type: 'paragraph',
                data: {
                  text: `This is page ${i + 1}`,
                },
              },
            ],
          },
        });
        newEditors.push(editor);
      }

      setEditors(newEditors);
    };

    load();
  }, []);

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleDownloadPDF = async () => {
    const allHTML = [];

    for (let i = 0; i < totalPages; i++) {
      const data = await editors[i].save();
      const html = data.blocks
        .map((block) => {
          if (block.type === 'paragraph') {
            return `<p>${block.data.text}</p>`;
          }
          return '';
        })
        .join('');
      allHTML.push(`<div style="page-break-after: always;"><h3>Page ${i + 1}</h3>${html}</div>`);
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = allHTML.join('');

    html2pdf()
      .set({
        margin: 0.5,
        filename: 'student-notebook.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      })
      .from(wrapper)
      .save();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📒 My Notebook</h1>

      {/* Arrows to navigate */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevPage}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          disabled={currentPage === 0}
        >
          ⬅️ Prev Page
        </button>
        <span className="font-semibold text-lg">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          disabled={currentPage === totalPages - 1}
        >
          Next Page ➡️
        </button>
      </div>

      {/* Editors */}
      {Array.from({ length: totalPages }).map((_, index) => (
        <div
          key={index}
          id={`editor-holder-${index}`}
          className={`bg-white border p-4 rounded shadow ${index === currentPage ? '' : 'hidden'}`}
          ref={(el) => (pageHoldersRef.current[index] = el)}
        />
      ))}

      <button
        onClick={handleDownloadPDF}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        📥 Download Notebook as PDF
      </button>
    </div>
  );
}
