"use client";

import { Home, Notebook, PlusCircle } from "lucide-react";
import React from "react";
import { MdAdd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/themeSlice";
import { toggleAsidebar } from "@/redux/asidebarSlice";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import Link from "next/link";

export default function Asidebar({ setActive, active }) {
  const dispatch = useDispatch(); // ✅ FIXED: added dispatch
  const isAsideOpen = useSelector((state) => state.asidebar.isAsideOpen);
  const { isDark } = useSelector((state) => state.theme);
  const openSidebar = () => {
    dispatch(toggleAsidebar());
  };
  return (
    <div className={` `}>
      <aside
        className={`h-[100vh] ${
          isAsideOpen
            ? "w-[16rem] max-lg:w-0 p-3 max-lg:p-0 "
            : "w-0 max-lg:w-[14rem] max-lg:p-3"
        } duration-300 border-r border-gray-600 overflow-hidden `}
      >
        <div className="flex flex-col text-base">
          <a href="/" className="text-2xl mb-4">
            DigiNote
          </a>

          <div className="text-md flex flex-col gap-2">
            <Link
              href={"/workspace"}
              onClick={() => setActive("home")}
              className={`flex items-center rounded w-full duration-200 ${
                active === "home" ? "bg-gray-500/20" : "hover:bg-gray-500/20"
              }`}
            >
              <div className="p-2 text-base">
                <Home />
              </div>
              <p className="w-full p-2 text-left">Home</p>
            </Link>

            <Link
              href={"/workspace/create"}
              onClick={() => setActive("create")}
              className={`flex items-center rounded w-full duration-200 ${
                active === "create" ? "bg-gray-500/20" : "hover:bg-gray-500/20"
              }`}
            >
              <div className="p-2 text-base">
                <PlusCircle />
              </div>
              <p className="w-full p-2 text-left">Create</p>
            </Link>

            <Link
              href={"/workspace/notes"}
              onClick={() => setActive("notes")}
              className={`flex items-center rounded w-full duration-200 ${
                active === "notes" ? "bg-gray-500/20" : "hover:bg-gray-500/20"
              }`}
            >
              <div className="p-2 text-base">
                <Notebook />
              </div>
              <p className="w-full p-2 text-left">My Notes</p>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
