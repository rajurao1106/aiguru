"use client";

import React, { useState } from "react";
import StudentNotebook from "./StudentNotebook";
import Navbar from "../../app/workspace/components/Navbar";
import Footer from "../../app/workspace/components/Footer";

export default function page() {
  const [theme, setTheme] = useState(true);

  const themeHandle = () => {
    setTheme((prev) => !prev);
  };

  const textTheme = theme
    ? "bg-white text-black duration-300"
    : "bg-gray-900 text-white duration-300";

  return (
    <div>
      <Navbar textTheme={textTheme} theme={theme} themeHandle={themeHandle} />
      <StudentNotebook
        textTheme={textTheme}
        theme={theme}
        themeHandle={themeHandle}
      />
      <Footer />
    </div>
  );
}
