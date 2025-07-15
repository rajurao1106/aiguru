"use client";

import { store } from "@/redux/store";
import { Provider } from "react-redux";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Asidebar from "./components/Asidebar";

function LayoutWrapper({ children }) {
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
      {/* Sidebar */}
      <div className="max-lg:absolute max-lg:bg-gray-900 z-50">
        <Asidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full">
        <Navbar />
        <main className="">{children}</main>
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
