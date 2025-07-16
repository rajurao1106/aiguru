"use client";

import { store } from "@/redux/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { toggleAsidebar } from "@/redux/asidebarSlice";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Asidebar from "./components/Asidebar";

// Moved useSelector into a separate component to ensure client-only logic
function LayoutWrapper({ children }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dispatch = useDispatch();
  const themeSelector = useSelector((state) => state.theme.isDark);
  const isAsideOpen = useSelector((state) => state.asidebar.isAsideOpen);

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

  const openSidebar = () => {
    dispatch(toggleAsidebar());
  };

  return (
    <div
      className={`flex duration-300 h-full w-full ${
        isDark ? "bg-gray-900 text-white" : ""
      }`}
    >
      {/* Sidebar */}
      <div
        className={`max-lg:absolute ${
          isDark ? "bg-gray-900 text-white" : "bg-white"
        } z-50`}
      >
        <Asidebar />
      </div>
      <div
        onClick={openSidebar}
        className={`w-full z-40 h-[100vh] bg-gray-900/90 absolute ${
          isAsideOpen ? "hidden" : ""
        }`}
      ></div>
      {/* Main Content */}
      <div className="flex flex-col w-full h-[100vh]">
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
