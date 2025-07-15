"use client";

import React from "react";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/themeSlice";
import { toggleAsidebar } from "@/redux/asidebarSlice"; // ✅ Import from slice

export default function Navbar() {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const isAsideOpen = useSelector((state) => state.asidebar.isAsideOpen); // ✅ Redux state

  const openSidebar = () => {
    dispatch(toggleAsidebar()); // ✅ Toggle via Redux
  };

  return (
    <div className={`px-2 duration-300 py-2 ${isDark?"bg-gray-900 ":""} flex justify-between items-center`}>
      <button className="text-2xl" onClick={openSidebar}>
        {isAsideOpen ? (
          <TbLayoutSidebarLeftCollapse />
        ) : (
          <TbLayoutSidebarRightCollapse />
        )}
      </button>

      <button
        onClick={() => dispatch(toggleTheme())}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
          isDark ? "bg-gray-700" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isDark ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
