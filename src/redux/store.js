import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import asidebarReducer from "./asidebarSlice"; // ✅ Import
import subjectReducer from "./subjectSlice";
import todoReducer from "./test";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    asidebar: asidebarReducer, // ✅ Must match useSelector(state => state.asidebar)
    subject: subjectReducer,
    todotasks: todoReducer,
  },
});
