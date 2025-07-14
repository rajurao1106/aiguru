import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import asidebarReducer from "./asidebarSlice"; // ✅ Import
import subjectReducer from "./subjectSlice";
import todoReducer from "./test";
import subjectbarReducer from "./subjectbar"
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    asidebar: asidebarReducer, 
    subjectbar: subjectbarReducer,
    subject: subjectReducer,
    todotasks: todoReducer,
  },
});
