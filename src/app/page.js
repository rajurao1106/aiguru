"use client"

import React, { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Homepage from "./homepage/homepage";

export default function Page() {
  
  
   const [theme, setTheme] = useState(true); // default light
   const [isThemeLoaded, setIsThemeLoaded] = useState(true); // ⛔ prevent early render
 
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
    <div>
      <div className="flex justify-center items-center w-full text-center">
      <div className="p-8 ">
        <h1 className="text-3xl font-bold mb-4">Welcome to AI Guru</h1>
        <p className="text-lg leading-relaxed max-w-2xl">
          The leading AI platform for educators and students. Experience
          personalized learning, instant solutions, and smart tools to save time
          and boost academic success.
        </p>
      </div>
    </div>
    </div>
  );
}
