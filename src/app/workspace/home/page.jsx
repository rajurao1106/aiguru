"use client";

import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setTheme, setThemeLoaded } from "@/redux/themeSlice";
import Homepage from "../../components/Homepage";

export default function Page() {
  const dispatch = useDispatch();
  const { isDark, isThemeLoaded } = useSelector((state) => state.theme);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme !== null) {
      dispatch(setTheme(storedTheme === "true"));
    }
    dispatch(setThemeLoaded(true));
  }, [dispatch]);

  const textTheme = isDark
    ? "bg-gray-900 text-white duration-300"
    : "bg-white text-black duration-300";

  if (!isThemeLoaded) return null;

  return (
    <div className="flex justify-center items-center w-full text-center">
      <div className="p-8 ">
        <h1 className="text-3xl font-bold mb-4">Welcome to DigiNote</h1>
        <p className="text-lg leading-relaxed max-w-2xl">
          The leading AI platform for educators and students. Experience
          personalized learning, instant solutions, and smart tools to save time
          and boost academic success.
        </p>
      </div>
      <Homepage />
    </div>
  );
}
