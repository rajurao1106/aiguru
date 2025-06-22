"use client";
import React, { useState, useEffect } from "react";
import { SlNotebook } from "react-icons/sl";

export default function LeftPanel({ theme, themeHandle, textTheme }) {
  const [showForm, setShowForm] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lastChapterName, setLastChapterName] = useState("");

  const handleAdd = () => {
    if (chapterName.trim() && topicName.trim()) {
      const today = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const newTopic = {
        chapter: chapterName,
        topic: topicName,
        date: today,
      };
      setTopics((prev) => [...prev, newTopic]);
      setLastChapterName(chapterName);
    }
    resetForm(false);
  };

  const handleUpdate = () => {
    if (selectedIndex !== null && chapterName.trim() && topicName.trim()) {
      const updated = [...topics];
      const originalDate = updated[selectedIndex].date; // keep old date
      updated[selectedIndex] = {
        chapter: chapterName,
        topic: topicName,
        date: originalDate,
      };
      setTopics(updated);
    }
    resetForm();
  };

  const resetForm = (clearChapter = true) => {
    setShowForm(false);
    if (clearChapter) setChapterName("");
    setTopicName("");
    setIsEditing(false);
    setSelectedIndex(null);
  };

  const openFormToEdit = (index) => {
    const item = topics[index];
    setChapterName(item.chapter);
    setTopicName(item.topic);
    setSelectedIndex(index);
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className={`${textTheme} h-full overflow-hidden`}>
      <div className="flex justify-start gap-2 text-xl items-center mb-4">
        <SlNotebook />
        <p>Notebook Topics</p>
      </div>

      <button
        className="w-full py-3 rounded-lg border text-3xl hover:bg-gray-200 hover:text-gray-900 transition"
        onClick={() => {
          setIsEditing(false);
          setChapterName(lastChapterName); // auto-fill last used chapter
          setTopicName(""); // new topic input
          setShowForm(true);
        }}
      >
        +
      </button>

      {/* Topics List */}
    {/* Chapter Title (only show if topics exist) */}
{topics.length > 0 && (
  <div className="text-sm font-semibold my-2">
    Chapter Name : <br />
    <p className=" font-normal">{topics[0].chapter}</p>
  </div>
)}

<div className="mt-4 space-y-2 overflow-auto hide-scrollbar max-h-[calc(100vh-200px)] rounded-lg">
  {topics.map((item, index) => (
    <div
      key={index}
      tabIndex={0}
      className={`p-3 border rounded-lg flex w-full justify-between items-end ${
        selectedIndex === index ? "" : ""
      }`}
    >
      <div>
        <p className="text-lg">{item.topic}</p>
        <p className="text-xs text-gray-500">{item.date}</p>
      </div>
      <p
        className="text-sm text-blue-600 cursor-pointer"
        onClick={() => openFormToEdit(index)}
      >
        Update
      </p>
    </div>
  ))}
</div>


      {/* Modal Form */}
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full text-white bg-black/40 flex justify-center items-center z-50">
          <div
            className={`bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-[90%] max-w-md ${textTheme}`}
          >
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Topic" : "Enter Chapter and Topic"}
            </h2>

            <input
              type="text"
              placeholder="Chapter Name"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              className="w-full mb-3 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent outline-none"
            />

            <input
              type="text"
              placeholder="Topic Name"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent outline-none"
            />

            <div className="flex justify-between gap-2">
              {!isEditing && (
                <button
                  onClick={handleAdd}
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Topic
                </button>
              )}
              {isEditing && (
                <button
                  onClick={handleUpdate}
                  className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Update
                </button>
              )}
            </div>

            <button
              onClick={() => resetForm()}
              className="mt-4 text-sm text-gray-500 hover:text-red-500 w-full text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
