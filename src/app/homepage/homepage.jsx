import React from "react";

export default function homepage({ theme }) {
  return (
    <div
      className={`h-screen w-full  ${
        theme
          ? "bg-[#ffffff00] duration-300 text-black"
          : " bg-gray-950 duration-300 text-white"
      } flex justify-center items-center`}
    >
      <a href="/ai-studytool">
        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
          📚 Start Studying
        </button>
      </a>
    </div>
  );
}
