// src/redux/todoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todotasks",
  initialState: {
    tasks: [],
    input: "",
  },
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },

    addTask: (state) => {
      const newTask = state.input.trim();
      if (newTask) {
        state.tasks = [...state.tasks, newTask]; // ✅ correct usage
        state.input = "";
      }
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter((_, i) => i !== action.payload);
    },
  },
});

export const { setInput, setTasks, addTask, removeTask } = todoSlice.actions;
export default todoSlice.reducer;
