"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTasks, addTask, removeTask } from "@/redux/test";

export default function Button() {
  const input = useSelector((state) => state.todotasks.input);
  const tasks = useSelector((state) => state.todotasks.tasks);
  const dispatch = useDispatch();

  // Load from localStorage on first render
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      dispatch(setTasks(JSON.parse(savedTasks)));
    }
  }, [dispatch]);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTaskHandle = () => {
    if (input.trim()) {
      dispatch(addTask());
    }
  };

  const removeTaskHandle = (index) => {
    dispatch(removeTask(index));
  };

  return (
    <div>
      <button
        onClick={addTaskHandle}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Add
      </button>
      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="bg-purple-100 flex justify-between px-4 py-2 rounded-md shadow-sm hover:bg-purple-200 transition"
          >
            <span>{task}</span>
            <button
              onClick={() => removeTaskHandle(index)}
              className="ml-4 text-sm text-red-600 hover:text-red-800 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
