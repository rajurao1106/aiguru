"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [chapters, setChapters] = useState([]);
  const [chapterName, setChapterName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [activeChapterId, setActiveChapterId] = useState("");

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    const res = await axios.get("/api/chapters");
    setChapters(res.data);
  };

  const addChapter = async () => {
    const res = await axios.post("/api/chapters", { name: chapterName });
    setChapterName("");
    fetchChapters();
  };

  const addTopic = async (chapterId) => {
    await axios.post("/api/topics", { chapterId, topicName });
    setTopicName("");
    fetchChapters();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Notes Manager</h1>

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
        <div key={chapter._id} className="mb-4 p-2 border rounded">
          <h2 className="text-lg font-semibold">{chapter.name}</h2>

          {/* Topics */}
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
              onChange={(e) => setTopicName(e.target.value)}
              className="border px-2 py-1 mr-2"
            />
            <button
              onClick={() => addTopic(chapter._id)}
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
