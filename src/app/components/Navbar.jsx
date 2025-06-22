"use client";

import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { FaSun } from "react-icons/fa";
import { IoIosMoon } from "react-icons/io";

export default function Navbar({ theme, themeHandle }) {
  return (
    <nav
      className={`w-full z-50 h-16 ${
        theme ? "bg-white duration-300 text-black shadow" : " bg-gray-950 border-b duration-300 text-white"
      } 
 flex justify-center items-center`}
    >
      <div className="w-full max-w-[1300px] flex justify-between items-center">
        <div className="flex gap-5">
          <div className="">
            <FiMenu size={30} />
          </div>
          <a href="/" className="text-2xl">AI Gurusdzfu</a>
        </div>
        <div className="">
          <button onClick={themeHandle}>
            {" "}
            {theme ? <FaSun size={30} /> : <IoIosMoon size={30} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
