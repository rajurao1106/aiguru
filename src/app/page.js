"use client"

import React, { useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Homepage from "./homepage/homepage";

export default function page() {
  const [theme, setTheme] = useState(true);
  
   const themeHandle = () => {
    setTheme((prev) => !prev);
  };
  return (
    <div>
      <Navbar theme={theme} themeHandle={themeHandle}/>
      <Homepage theme={theme} themeHandle={themeHandle}/>
      <Footer />
    </div>
  );
}
