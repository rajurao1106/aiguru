"use client"
import React, { useState } from "react";
import { FaArrowUp, FaMicrophone } from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import StudentNotebook from "../student-notebook/StudentNotebook";

export default function AiChat({
  theme,
  themeHandle,
  textTheme,
  clickEvent,
  topicClick,
  handleAdd,
  handleUpdate,
  openFormToEdit,
  showForm,
  setShowForm,
  chapterName,
  setChapterName,
  topicName,
  setTopicName,
  isEditing,
  setIsEditing,
  topics,
  selectedIndex,
  lastChapterName,

  // 👇 AI chat related
  input,
  setInput,
  messages,
  setMessages,
  isLoading,
  handleSend,
}) {



  return (
    <section className={`w-full h-full ${textTheme} flex duration-300 flex-col justify-end`}>
      <div className="max-w-2xl mx-auto flex flex-col w-full  ">
        {/* Chat History */}
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[27rem] px-4 ">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl text-sm w-fit max-w-[90%] duration-300 ${
                msg.role === "user"
                  ? "ml-auto bg-blue-600 text-white duration-300"
                  : theme
                  ? " text-black duration-300"
                  : "bg-gray-800 text-white duration-300"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
             
            </div>
          ))}
        </div>

        {/* Input Field */}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a Topic or Doubt..."
            className={`w-full p-4 pr-14 rounded-full ${
              theme ? "bg-gray-200" : "bg-gray-950"
            } placeholder-gray-400 outline-none transition-all`}
          />
          <button
            onClick={handleSend}
         
            className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white text-black border border-gray-400 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
             <FaArrowUp size={16} />
          </button>
        </div>
        
      </div>
      
    </section>
  );
}
