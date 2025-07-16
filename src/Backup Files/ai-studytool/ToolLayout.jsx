"use client";

import React, { useEffect, useState } from "react";
import AddTopic from "./AddTopic";
import AiChat from "./AiChat";
import StudentNotebook from "../student-notebook/StudentNotebook";
import axios from "axios";
import { FaSun } from "react-icons/fa6";
import { IoIosMoon } from "react-icons/io";

function ToolLayout({ theme, themeHandle }) {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [chapterName, setChapterName] = useState(() => {
    return localStorage.getItem("chapterName") || "";
  });
  const [topicName, setTopicName] = useState(() => {
    return localStorage.getItem("topicName") || "";
  });
  const [topics, setTopics] = useState(() => {
    const savedTopics = localStorage.getItem("topics");
    return savedTopics ? JSON.parse(savedTopics) : [];
  });
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const savedIndex = localStorage.getItem("selectedIndex");
    return savedIndex ? JSON.parse(savedIndex) : null;
  });
  const [isEditing, setIsEditing] = useState(() => {
    return localStorage.getItem("isEditing") === "true";
  });
  const [lastChapterName, setLastChapterName] = useState(() => {
    return localStorage.getItem("lastChapterName") || "";
  });
  const [topicClick, setTopicClick] = useState(() => {
    return localStorage.getItem("topicClick") || "";
  });
  const [input, setInput] = useState(() => {
    return localStorage.getItem("input") || "";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem("notes") === "true";
  });
  const [video, setVideo] = useState(null);
  const [disabledIndexes, setDisabledIndexes] = useState(() => {
    const savedIndexes = localStorage.getItem("disabledIndexes");
    return savedIndexes ? JSON.parse(savedIndexes) : [];
  });
  const [someCondition, setSomeCondition] = useState(true);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chapterName", chapterName);
  }, [chapterName]);

  useEffect(() => {
    localStorage.setItem("topicName", topicName);
  }, [topicName]);

  useEffect(() => {
    localStorage.setItem("topics", JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem("selectedIndex", JSON.stringify(selectedIndex));
  }, [selectedIndex]);

  useEffect(() => {
    localStorage.setItem("isEditing", isEditing);
  }, [isEditing]);

  useEffect(() => {
    localStorage.setItem("lastChapterName", lastChapterName);
  }, [lastChapterName]);

  useEffect(() => {
    localStorage.setItem("topicClick", topicClick);
  }, [topicClick]);

  useEffect(() => {
    localStorage.setItem("input", input);
  }, [input]);

  useEffect(() => {
    localStorage.setItem("notes", notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("disabledIndexes", JSON.stringify(disabledIndexes));
  }, [disabledIndexes]);

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
    let chapterName = input;

    if (topics.length > 0) {
      chapterName = topics[0].chapter;
      messageToSend = topics[0].topic;

      // Remove the first topic from the list
      setTopics((prev) => prev.slice(1));
    }

    const userMessage = {
      role: "user",
      content: {
        chapter: chapterName,
        topic: messageToSend,
      },
    };

    // Add user message to the UI
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // 🧠 Create a meaningful prompt for the AI
    const prompt = `Chapter Name: ${chapterName}
  Topic: ${messageToSend}

  👉 First, understand the chapter context based on its name.
  👉 Then, answer the topic mentioned clearly and in simple words. If needed, give examples.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ No response from Gemini.";

      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Error getting response from Gemini.",
        },
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

      const videos = response.data.items;
      if (!videos || videos.length === 0) {
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
    if (index === 0) {
      const currentTopic = topics[0]?.topic;

      if (currentTopic) {
        handleSend();

        fetchYouTubeVideo(currentTopic).then((videoResult) => {
          if (videoResult) {
            const videoMarkdown = `🎥 **Recommended Video:** [${videoResult.title}](${videoResult.url})\n\n**Channel:** ${videoResult.channel}`;
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: videoMarkdown },
            ]);
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

  const handleTopicClick = () => {
    if (someCondition) {
      handleClick(0);
    } else {
      handleClick(1);
    }
  };

  const containerTheme = theme
    ? "bg-[#ececec] text-black duration-300"
    : "bg-gray-950 text-white duration-300";

  const cardTheme = theme
    ? "bg-white text-black duration-300"
    : "bg-gray-900 max-lg:bg-gray-900 text-white duration-300";

  return (
    <section
      className={`w-full flex justify-center overflow-auto flex-col items-center ${containerTheme}`}
    >
      <div className="w-full h-[100vh] max-w-[1450px] flex flex-col lg:flex-row gap-4">
        {/* Left Panel */}
        <div
          className={`w-full lg:w-[20%] max-lg:hidden h-full rounded-xl shadow-md p-4 ${cardTheme}`}
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
          className={`w-full relative max-lg:h-[100vh] rounded-xl shadow-md ${cardTheme}`}
        >
          <div className="flex lg:hidden absolute w-[100%] justify-between items-center p-4">
            <h1 className="text-xl font-bold">DigiNote</h1>
            <button className="" onClick={themeHandle}>
              {theme ? <FaSun size={30} /> : <IoIosMoon size={30} />}
            </button>
          </div>
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
              handleNotes={handleNotes}
              handleTopicClick={handleTopicClick}
            />
          ) : (
            <div
              className={`w-full absolute top-0 left-0 lg:w-full h-full rounded-xl`}
            >
              <StudentNotebook
                theme={theme}
                themeHandle={themeHandle}
                textTheme={theme ? "text-black" : "text-white"}
                messages={messages}
                setMessages={setMessages}
                handleNotes={handleNotes}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ToolLayout;
