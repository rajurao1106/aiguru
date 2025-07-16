import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function NotebookView({ downloadPDF, setShowNotebook, savedResponses }) {
  return (
    <>
   <div className="flex justify-between ">
      <h2 className="text-2xl font-bold ">
        📒 My Notebook
      </h2>
      <div className="flex justify-center items-center">
        <button
        onClick={downloadPDF}
        className="p-2 rounded"
      >
        📥
      </button>
      <button
        onClick={() => setShowNotebook(false)}
        className="ml-4 text-red-600"
      >
        ❌
      </button>
      </div>
   </div>


      <div id="notebook-content">
        {Object.entries(savedResponses).map(([chap, tops], chapIdx) => (
          <div key={chap}>
            <h3 className="text-2xl font-bold mb-4 border-b pb-1 ">
        Chapter {chapIdx + 1}: {chap}
      </h3>

            {Object.entries(tops).map(([tName, cont], idx) => (
              <div key={idx} className="pl-4 mt-2">
                <h4 className="text-lg font-semibold  mb-2">
              Topic {idx + 1}: {tName}
            </h4>

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
