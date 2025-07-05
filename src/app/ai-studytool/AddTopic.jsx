"use client";
import React, { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { SlNotebook } from "react-icons/sl";

export default function AddTopic({
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
  handleSend,
  handleNotes,
  notes,
  disabledIndexes,
  setDisabledIndexes,
  handleClick,
}) {
  const resetForm = () => {
    setShowForm(false);
    setChapterName("");
    setTopicName("");
    setIsEditing(false);
  };

 

 

  return (
    <div className="flex justify-between flex-col h-full">
      <div className={`${textTheme} h-full overflow-hidden`}>
        <div className="flex justify-start gap-2 text-xl items-center mb-4">
          <SlNotebook />
          <p>Notebook Topics</p>
        </div>

        <button
          className="w-full py-3 rounded-lg duration-300 border border-gray-600 text-3xl hover:bg-gray-200 hover:text-gray-900 transition"
          onClick={() => {
            setIsEditing(false);
            setChapterName(lastChapterName); // auto-fill last used chapter
            setTopicName(""); // new topic input
            setShowForm(true);
          }}
        >
          +
        </button>

        {/* Chapter Title */}
        {/* {Array.isArray(topics) && topics.length > 0 && (
          <div className="text-sm font-semibold my-2">
            Chapter Name :<p className="font-normal">{topics[0].chapter}</p>
          </div>
        )} */}

        {/* Topics List */}
        <div className="mt-4 space-y-2 overflow-auto hide-scrollbar max-h-[calc(100vh-200px)] rounded-lg">
          {Array.isArray(topics) &&
            topics.map((item, index) => (
              <div
                key={index}
                tabIndex={0}
                className={`p-3 relative border border-gray-400 rounded-lg flex w-full justify-between items-end
           
          `}
              >
                <div>
                  <p
                    className="text-lg cursor-pointer"
                    onClick={() => handleClick(index)}
                  >
                    {item.topic}
                  </p>
                  <p className="text-xs ">{item.chapter}</p>
                </div>
                <p
                  className="text-sm text-blue-600 cursor-pointer absolute bottom-1 right-1"
                  onClick={() => openFormToEdit(index)}
                >
                  <FaPencilAlt />

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
              <h2 className="text-xl font-semibold mb-4 text-white">
                {isEditing ? "Edit Topic" : "Enter Chapter and Topic"}
              </h2>

              <input
                type="text"
                placeholder="Chapter Name"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded border text-white border-gray-300 dark:border-gray-700 bg-transparent outline-none"
              />

              <input
                type="text"
                placeholder="Topic Name"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded border text-white border-gray-300 dark:border-gray-700 bg-transparent outline-none"
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
                onClick={resetForm}
                className="mt-4 text-sm text-gray-500 hover:text-red-500 w-full text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <div
      
        onClick={handleNotes}
        className="bg-blue-600 rounded-md py-2 px-2 text-center text-white"
      >
        <button> {notes?"Open Notes":"Close Notes"}</button>
      </div>
    </div>
  );
}
