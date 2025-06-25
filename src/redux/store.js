// src/redux/store.js
"use client";
import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "./messagesSlice";

export const store = configureStore({
  reducer: {
    messages: messagesReducer,
  },
});
