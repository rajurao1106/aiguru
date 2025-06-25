"use client"

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ToolLayout from "./ToolLayout";

export default function Page() {
  const [theme, setTheme] = useState(true);


  const themeHandle = () => {
    setTheme((prev) => !prev);
  };

  const textTheme = theme
    ? "bg-white text-black duration-300"
    : "bg-gray-900 text-white duration-300";

  return (
    <div>
      <Navbar theme={theme} themeHandle={themeHandle} />
      <ToolLayout
        theme={theme}
        themeHandle={themeHandle}
      />
      {/* <Footer /> */}
    </div>
  );
}
