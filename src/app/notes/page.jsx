"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [chapters, setChapters] = useState([]);
  const [chapterName, setChapterName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [activeTopicInputs, setActiveTopicInputs] = useState({}); // per chapter topic inputs

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("notes_data");
    if (stored) {
      setChapters(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever chapters change
  useEffect(() => {
    localStorage.setItem("notes_data", JSON.stringify(chapters));
  }, [chapters]);

  const addChapter = () => {
    if (!chapterName.trim()) return;
    const newChapter = {
      id: Date.now().toString(),
      name: chapterName.trim(),
      topics: [],
    };
    setChapters([...chapters, newChapter]);
    setChapterName("");
  };

  const addTopic = (chapterId) => {
    const name = activeTopicInputs[chapterId]?.trim();
    if (!name) return;

    const updatedChapters = chapters.map((ch) => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          topics: [...ch.topics, { name }],
        };
      }
      return ch;
    });
    setChapters(updatedChapters);
    setActiveTopicInputs({ ...activeTopicInputs, [chapterId]: "" });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Notes Manager (Local)</h1>

      {/* Add Chapter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter Chapter Name"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button onClick={addChapter} className="bg-blue-500 text-white px-4 py-1 rounded">
          Add Notes
        </button>
      </div>

      {/* Chapters List */}
      {chapters.map((chapter) => (
        <div key={chapter.id} className="mb-4 p-2 border rounded">
          <h2 className="text-lg font-semibold">{chapter.name}</h2>

          {/* Topics List */}
          <ul className="ml-4 mt-2">
            {chapter.topics.map((topic, idx) => (
              <li key={idx} className="text-sm list-disc">{topic.name}</li>
            ))}
          </ul>

          {/* Add Topic */}
          <div className="mt-2">
            <input
              type="text"
              placeholder="Enter Topic"
              value={activeTopicInputs[chapter.id] || ""}
              onChange={(e) =>
                setActiveTopicInputs({ ...activeTopicInputs, [chapter.id]: e.target.value })
              }
              className="border px-2 py-1 mr-2"
            />
            <button
              onClick={() => addTopic(chapter.id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Add Topic
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
