import React from "react";

export default function AiStudyTool({ theme, themeHandle }) {
  return (
    <section
      className={`h-screen  ${
        theme
          ? "bg-[#ffffff00] duration-300 text-black"
          : " bg-gray-950 duration-300 text-white"
      } w-full`}
    ></section>
  );
}
