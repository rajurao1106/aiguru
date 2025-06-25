"use client";
import React, { useEffect, useState } from "react";
import AddTopic from "./AddTopic";
import AiChat from "./AiChat";
import StudentNotebook from "../student-notebook/StudentNotebook";

function ToolLayout({ theme, themeHandle }) {
  const [messages, setMessages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lastChapterName, setLastChapterName] = useState("");
  const [topicClick, setTopicClick] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState(true);

  const handleNotes = () => {
    setNotes((prev) => !prev);
  };

  const clickEvent = () => {
    if (topics.length > 0) {
      setTopicClick(topics[0].topic);
    }
  };

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
      const originalDate = updated[selectedIndex].date;
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

  const handleSend = async () => {
    let messageToSend = input;

    // If topic[0] exists and not used yet, use it and remove from array
    if (topics.length > 0) {
      messageToSend = topics[0].topic;

      // Remove first topic after use
      setTopics((prev) => prev.slice(1));
    }

    const userMessage = {
      role: "user",
      content: messageToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // clear input if user typed

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: userMessage.content }] },
            ],
          }),
        }
      );

      const data = await response.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ No response from Gemini.";
      setMessages((prev) => [...prev, { role: "ai", content: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "❌ Error getting response from Gemini." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const containerTheme = theme
    ? "bg-[#ececec] text-black duration-300"
    : "bg-gray-950 text-white duration-300";

  const cardTheme = theme
    ? "bg-white text-black duration-300"
    : "bg-gray-900 text-white duration-300";

  return (
    <section
      className={`w-full flex justify-center flex-col pt-16 items-center ${containerTheme}`}
    >
      <div className="w-full max-w-[1450px] p-4 flex flex-col lg:flex-row gap-4">
        {/* Left Panel */}
        <div
          className={`w-full lg:w-[20%] h-[33rem] rounded-xl shadow-md p-4 ${cardTheme}`}
        >
          <AddTopic
            theme={theme}
            themeHandle={themeHandle}
            textTheme={theme ? "text-black" : "text-white"}
            clickEvent={clickEvent}
            topicClick={topicClick}
            handleAdd={handleAdd}
            handleUpdate={handleUpdate}
            openFormToEdit={openFormToEdit}
            showForm={showForm}
            setShowForm={setShowForm}
            chapterName={chapterName}
            setChapterName={setChapterName}
            topicName={topicName}
            setTopicName={setTopicName}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            topics={topics}
            selectedIndex={selectedIndex}
            lastChapterName={lastChapterName}
            handleSend={handleSend}
            handleNotes={handleNotes}
            notes={notes}
          />
        </div>

        {/* Middle Panel */}
        <div
          className={`w-full relative lg:w-[55%] h-[33rem] rounded-xl shadow-md p-4 ${cardTheme}`}
        >
          {notes ? (
            <AiChat
              theme={theme}
              themeHandle={themeHandle}
              textTheme={theme ? "text-black" : "text-white"}
              clickEvent={clickEvent}
              topicClick={topicClick}
              handleAdd={handleAdd}
              handleUpdate={handleUpdate}
              openFormToEdit={openFormToEdit}
              showForm={showForm}
              setShowForm={setShowForm}
              chapterName={chapterName}
              setChapterName={setChapterName}
              topicName={topicName}
              setTopicName={setTopicName}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              topics={topics}
              selectedIndex={selectedIndex}
              lastChapterName={lastChapterName}
              input={input}
              setInput={setInput}
              messages={messages}
              setMessages={setMessages}
              isLoading={isLoading}
              handleSend={handleSend}
            />
          ) : (
            <div
              className={`w-full absolute  top-0 left-0 lg:w-full  h-[33rem] rounded-xl  `}
            >
              <StudentNotebook
                theme={theme}
                themeHandle={themeHandle}
                textTheme={theme ? "text-black" : "text-white"}
                messages={messages}
                setMessages={setMessages}
              />
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-[25%] h-[33rem] flex flex-col gap-4">
          <div
            className={`h-auto lg:h-[30%] w-full rounded-xl shadow-md p-4 ${cardTheme}`}
          >
            {/* Future Content */}
          </div>
          <div
            className={`h-auto lg:h-[70%] w-full rounded-xl shadow-md p-4 ${cardTheme}`}
          >
            {/* Future Content */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ToolLayout;
