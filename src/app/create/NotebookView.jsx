import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function NotebookView({ downloadPDF, setShowNotebook, savedResponses }) {
  return (
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
            <h3 className="text-xl font-semibold mt-4">{chap}</h3>
            {Object.entries(tops).map(([tName, cont], idx) => (
              <div key={idx} className="pl-4 mt-2">
                <h4 className="font-medium">📌 {tName}</h4>
                <div className="p-3 whitespace-pre-wrap">
                  <ReactMarkdown>{cont}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
