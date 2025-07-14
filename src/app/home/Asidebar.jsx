"use client";

import { Home, Notebook } from "lucide-react";
import React from "react";
import { MdAdd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/themeSlice";
import { toggleAsidebar } from "@/redux/asidebarSlice"; 
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from "react-icons/tb";

export default function Asidebar({ setActive, active }) {
  const dispatch = useDispatch(); // ✅ FIXED: added dispatch
  const isAsideOpen = useSelector((state) => state.asidebar.isAsideOpen);

  const openSidebar = () => {
    dispatch(toggleAsidebar());
  };
  return (
    <aside
      className={`h-[100vh] ${
        isAsideOpen ? "w-[16rem] p-3 bg-gray-900" : "w-0"
      } duration-300 border-r border-gray-600 overflow-hidden `}
    >
    <div onClick={openSidebar} className={`absolute w-[100vw] left-0 h-full -z-10 ${
        isAsideOpen ? "max-lg:bg-gray-900/80" : "hidden"
      }  top-0 `}></div>
  <button className="text-2xl" onClick={openSidebar}>
        {isAsideOpen ? (
          <TbLayoutSidebarLeftCollapse />
        ) : (
          <TbLayoutSidebarRightCollapse />
        )}
      </button>
      <div className="flex flex-col text-base">
        <a href="/" className="text-2xl mb-4">
          AI Guru
        </a>

        <div className="text-md flex flex-col gap-2">
          <button
            onClick={() => setActive("home")}
            className={`flex items-center rounded w-full duration-200 ${
              active === "home" ? "bg-gray-500/20" : "hover:bg-gray-500/20"
            }`}
          >
            <div className="p-2 text-2xl">
              <Home />
            </div>
            <p className="w-full p-2 text-left">Home</p>
          </button>

          <button
            onClick={() => setActive("create")}
            className={`flex items-center rounded w-full duration-200 ${
              active === "create" ? "bg-gray-500/20" : "hover:bg-gray-500/20"
            }`}
          >
            <div className="p-2 text-2xl">
              <MdAdd />
            </div>
            <p className="w-full p-2 text-left">Create</p>
          </button>

          <button
            onClick={() => setActive("notes")}
            className={`flex items-center rounded w-full duration-200 ${
              active === "notes" ? "bg-gray-500/20" : "hover:bg-gray-500/20"
            }`}
          >
            <div className="p-2 text-2xl">
              <Notebook />
            </div>
            <p className="w-full p-2 text-left">My Notes</p>
          </button>
        </div>
      </div>
    </aside>
  );
}
