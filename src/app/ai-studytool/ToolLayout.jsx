"use client";

import React, { useEffect, useState } from "react";
import AddTopic from "./AddTopic";
import AiChat from "./AiChat";
import StudentNotebook from "../student-notebook/StudentNotebook";
import axios from "axios";

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
  const [video, setVideo] = useState(null);
   const [disabledIndexes, setDisabledIndexes] = useState([]);

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

    if (topics.length > 0) {
      messageToSend = topics[0].topic;
      setTopics((prev) => prev.slice(1));
    }

    const userMessage = {
      role: "user",
      content: messageToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

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
      console.log("Gemini API Response:", data); // Debug
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ No response from Gemini.";
      setMessages((prev) => {
        const newMessages = [...prev, { role: "assistant", content: aiText }];
        console.log("New Messages:", newMessages); // Debug
        return newMessages;
      });
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error getting response from Gemini." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendWithVideo = async () => {
    if (!input.trim()) return;

    const userInput = input;
    setInput("");
    await handleSend();

    const videoResult = await fetchYouTubeVideo(userInput);
    console.log("Video Result:", videoResult); // Debug
    if (videoResult) {
      const videoMarkdown = `🎥 **Recommended Video:** [${videoResult.title}](${videoResult.url})\n\n**Channel:** ${videoResult.channel}`;
      const videoMessage = {
        role: "assistant",
        content: videoMarkdown,
      };
      setMessages((prev) => [...prev, videoMessage]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ No relevant video found." },
      ]);
    }
  };

  const fetchYouTubeVideo = async (topic) => {
    const apiKey = "AIzaSyDnlqKMLVXtf3_JPMwZxHePYjWTwhovoJM";
    const baseUrl = "https://www.googleapis.com/youtube/v3/search";
    const reputableChannels = {
      "Traversy Media": "UC29ju8bIPH5as8OGnQzwJyA",
      "freeCodeCamp.org": "UC8butISFwT-Wl7EV0hUK0BQ",
      "The Net Ninja": "UCW5YeuERMmlnqo4oq8vwUpg",
      Academind: "UCSJbGtTlrDami-tDGPUV9-w",
    };

    try {
      const response = await axios.get(baseUrl, {
        params: {
          part: "snippet",
          q: `${topic} tutorial`,
          type: "video",
          maxResults: 10,
          order: "relevance",
          key: apiKey,
        },
      });

      console.log("YouTube API Response:", response.data); // Debug
      const videos = response.data.items;
      if (!videos || videos.length === 0) {
        console.log("No videos found"); // Debug
        return null;
      }

      const reputableVideos = videos.filter((video) =>
        Object.values(reputableChannels).includes(video.snippet.channelId)
      );
      const bestVideo =
        reputableVideos.length > 0 ? reputableVideos[0] : videos[0];

      return {
        title: bestVideo.snippet.title,
        url: `https://www.youtube.com/watch?v=${bestVideo.id.videoId}`,
        channel: bestVideo.snippet.channelTitle,
      };
    } catch (error) {
      console.error("Error fetching YouTube video:", error.message);
      return null;
    }
  };

  const handleClick = (index) => {
  if (index === 0 ) {
    const currentTopic = topics[0]?.topic; // Get the topic safely

    if (currentTopic) {
      handleSend();
     

      fetchYouTubeVideo(currentTopic).then((videoResult) => {
        if (videoResult) {
          const videoMarkdown = `🎥 **Recommended Video:** [${videoResult.title}](${videoResult.url})\n\n**Channel:** ${videoResult.channel}`;
          setMessages((prev) => [...prev, { role: "assistant", content: videoMarkdown }]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "⚠️ No relevant video found." },
          ]);
        }
      });
    }
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
          className={`w-full lg:w-[20%] max-lg:hidden h-[33rem] rounded-xl shadow-md p-4 ${cardTheme}`}
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
            disabledIndexes={disabledIndexes}
            setDisabledIndexes={setDisabledIndexes}
            handleClick={handleClick}
          />
        </div>

        {/* Middle Panel */}
        <div
          className={`w-full relative h-[33rem] max-lg:h-[89vh] rounded-xl shadow-md p-4 ${cardTheme}`}
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
              handleClick={handleClick}
              handleSendWithVideo={handleSendWithVideo}
              setDisabledIndexes={setDisabledIndexes}
            />
          ) : (
            <div
              className={`w-full absolute top-0 left-0 lg:w-full h-[33rem] rounded-xl`}
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
        {/* <div className="w-full lg:w-[25%] h-[33rem] flex flex-col gap-4">
          <div
            className={`h-auto lg:h-[30%] w-full rounded-xl shadow-md p-4 ${cardTheme}`}
          >
          
          </div>
          <div
            className={`h-auto lg:h-[70%] w-full rounded-xl shadow-md p-4 ${cardTheme}`}
          >
          
          </div>
        </div> */}
      </div>
    </section>
  );
}

export default ToolLayout;