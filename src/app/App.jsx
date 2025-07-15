"use client";

import { store } from "@/redux/store";
import { Provider, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Asidebar from "./components/Asidebar";

// Moved useSelector into a separate component to ensure client-only logic
function LayoutWrapper({ children }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const themeSelector = useSelector((state) => state.theme.isDark);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsDark(themeSelector);
    }
  }, [mounted, themeSelector]);

  useEffect(() => {
    if (!mounted) return;
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark, mounted]);

  if (!mounted) return null;

  return (
    <div className={`flex duration-300 ${isDark ? "bg-gray-900 text-white" : ""}`}>
      {/* Sidebar */}
      <div className="max-lg:absolute max-lg:bg-gray-900 z-50">
        <Asidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <LayoutWrapper>{children}</LayoutWrapper>
    </Provider>
  );
}
