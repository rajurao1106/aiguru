"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSubject } from "@/redux/subjectSlice";
import SubjectDetailViewer from "./SubjectDetailViewer";
import { MdOutlineDeleteForever } from "react-icons/md";

export default function AddSubjectName() {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [openSubjectForm, setOpenSubjectForm] = useState(false);
  const [addtodo, setAddtodo] = useState([]);
  const [addtask, setAddtask] = useState("");

  const selectedSubject = useSelector((state) => state.subject.selectedSubject);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedTodos = JSON.parse(localStorage.getItem("addtodo")) || [];
      setAddtodo(savedTodos);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("addtodo", JSON.stringify(addtodo));
    }
  }, [addtodo, isClient]);

  useEffect(() => {
    if (isClient && selectedSubject) {
      localStorage.setItem("selectedSubject", selectedSubject);
    }
  }, [selectedSubject, isClient]);

  const addSubjectName = (e) => {
    e.preventDefault();
    if (addtask.trim()) {
      const updated = [...addtodo, addtask];
      setAddtodo(updated);
      setAddtask("");
      setOpenSubjectForm(false);

      const allTopics = JSON.parse(
        localStorage.getItem("chapterTopics") || "{}"
      );
      const allResponses = JSON.parse(
        localStorage.getItem("savedResponses") || "{}"
      );
      allTopics[addtask] = {};
      allResponses[addtask] = {};
      localStorage.setItem("chapterTopics", JSON.stringify(allTopics));
      localStorage.setItem("savedResponses", JSON.stringify(allResponses));
    }
  };

  const removeSubjectName = (index) => {
    const subjectToRemove = addtodo[index];
    const updated = addtodo.filter((_, i) => i !== index);
    setAddtodo(updated);

    if (selectedSubject === subjectToRemove) {
      dispatch(setSelectedSubject(""));
      localStorage.removeItem("selectedSubject");
    }
  };

  const subjecthandle = () => setOpenSubjectForm((prev) => !prev);
  const handleClickSubject = (subject) => {
    dispatch(setSelectedSubject(subject));
  };

  if (!isClient) return null;

  // ✅ If subject is clicked, show viewer only
  if (selectedSubject) {
    return (
      <div className="w-full">
        <SubjectDetailViewer
          selectedSubject={selectedSubject}
          setSelectedSubject={(value) => dispatch(setSelectedSubject(value))}
        />
      </div>
    );
  }

  // ✅ Show subject UI by default (even if no subjects yet)
  return (
    <div className="relative w-full h-[90vh] flex flex-col items-center custom-scrollbar">
      {/* Empty state if no subjects */}
      {addtodo.length === 0 && (
        <div className=" w-full h-full flex justify-center items-center">
          <div className="flex flex-col items-center ">
            <div className="mb-4">
              <Image
                src="/images/box.png"
                alt="no notes"
                width={100}
                height={100}
              />
            </div>
            <p className="mb-4">Oops, no notes saved yet.</p>
            <button
              onClick={subjecthandle}
              className="px-22 py-4 rounded-lg text-3xl border border-gray-600 hover:bg-gray-200 hover:text-gray-900 transition"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Subject input form */}
      {openSubjectForm && (
        <form
          onSubmit={addSubjectName}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-80 space-y-4 z-50"
        >
          <div
            onClick={subjecthandle}
            className="absolute right-2 top-2 text-2xl cursor-pointer text-gray-600 hover:text-black"
          >
            <IoClose />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white text-center">
            Add Subject Name
          </h1>
          <input
            type="text"
            value={addtask}
            onChange={(e) => setAddtask(e.target.value)}
            placeholder="Enter subject name"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 
              text-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium 
              py-2 rounded-lg transition duration-300"
          >
            Add Subject
          </button>
        </form>
      )}

      {/* Subject list UI */}
      {addtodo.length > 0 && (
        <div className="py-10">
          <h1 className="text-2xl sm:text-3xl font-semibold  mb-6 tracking-tight">
            Select Your Subject
          </h1>

          <div className="grid grid-cols-3 max-lg:grid-cols-1 justify-center items-center gap-6 ">
            {addtodo.map((subject, index) => (
              <div
                key={index}
                onClick={() => handleClickSubject(subject)}
                className="relative bg-blue-700 text-white px-8 py-6 rounded-lg shadow-sm min-w-[200px] text-center cursor-pointer hover:ring-2 ring-blue-400"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSubjectName(index);
                  }}
                  className="absolute top-1 right-1 text-xl text-red-500 hover:text-red-700"
                >
                  <MdOutlineDeleteForever />
                </button>
                <span className="">
                  {subject
                    .toLowerCase()
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              </div>
            ))}
            <button
              onClick={subjecthandle}
              className="text-3xl border border-gray-600 px-22 py-4 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
