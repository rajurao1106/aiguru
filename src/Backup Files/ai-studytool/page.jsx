"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../app/workspace/components/Navbar";
import Footer from "../../app/workspace/components/Footer";
import ToolLayout from "./ToolLayout";
import MCQApp from "./MCQ";
import { FaSun } from "react-icons/fa6";
import { IoIosMoon } from "react-icons/io";

export default function Page() {
  const [theme, setTheme] = useState(true); // default light
  const [isThemeLoaded, setIsThemeLoaded] = useState(false); // ⛔ prevent early render

  const themeHandle = () => {
    setTheme((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme !== null) {
      setTheme(storedTheme === "true");
    }
    setIsThemeLoaded(true); // ✅ Ready to render
  }, []);

  const textTheme = theme
    ? "bg-white text-black duration-300"
    : "bg-gray-900 text-white duration-300";

  // ⛔ Don't render anything until theme is loaded
  if (!isThemeLoaded) return null;

  return (
    <div className={` ${textTheme} relative  `}>
      {/* <div className="max-lg:hidden">
        <Navbar theme={theme} themeHandle={themeHandle} />
      </div> */}
      <ToolLayout theme={theme} themeHandle={themeHandle} />
      {/* <MCQApp /> */}
      {/* <Footer /> */}
    </div>
  );
}
