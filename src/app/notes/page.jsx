"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Asidebar from "../components/Asidebar";
import Navbar from "../components/Navbar";


export default function page() {
  const isDark = useSelector((state) => state.theme.isDark);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Avoid hydration mismatch
    setMounted(true);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  if (!mounted) return null; // Prevent flash on load

  return (
    <div className={`flex duration-300 ${isDark?"bg-gray-900 text-white":" "}`}>
   
    </div>
  );
}

