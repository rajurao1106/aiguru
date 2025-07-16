import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

export default function NotebookView({
  downloadPDF,
  setShowNotebook,
  savedResponses,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponses, setEditedResponses] = useState(savedResponses);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleContentChange = (chapter, topic, newContent) => {
    setEditedResponses((prev) => ({
      ...prev,
      [chapter]: {
        ...prev[chapter],
        [topic]: newContent,
      },
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Optionally, you can pass editedResponses to a parent component or save it elsewhere
  };
  

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📒 My Notebook</h2>
        <div className="flex justify-between items-center">
          <button
            onClick={handleEditToggle}
            className="py-2 rounded text-white mr-2"
          >
            {isEditing ? (
              <>
                <button className="p-2 rounded text-white bg-blue-500">
                  Cancel
                </button>
              </>
            ) : (
              <div className="max-lg:-scale-x-100">✏️</div>
            )}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="p-2 rounded bg-green-500 text-white mr-2"
            >
              Save
            </button>
          )}
          <button onClick={downloadPDF} className="p-2 rounded">
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

      <div id="notebook-content" className="overflow-x-auto">
        {Object.entries(editedResponses).map(([chapter, topics], chapIdx) => (
          <div key={chapter}>
            <h3 className="text-2xl font-bold mb-4 border-b pb-1">
              Chapter {chapIdx + 1}: {chapter}
            </h3>

            {Object.entries(topics).map(([topic, content], idx) => (
              <div key={idx} className="mt-2">
                <h4 className="text-lg font-semibold mb-2">
                  Topic {idx + 1}: {topic}
                </h4>

                <div className="whitespace-pre-wrap text-sm">
                  {isEditing ? (
                    <textarea
                      className="w-full p-2 border rounded h-[100vh]"
                      value={content}
                      onChange={(e) =>
                        handleContentChange(chapter, topic, e.target.value)
                      }
                      rows={6}
                    />
                  ) : (
                    <ReactMarkdown>{content}</ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
