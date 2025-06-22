import React from "react";
import LaftPanel from "./LaftPanel";

export default function ToolLayout({ theme, themeHandle }) {
  const containerTheme = theme
    ? "bg-[#ececec] text-black duration-300"
    : "bg-gray-950 text-white duration-300";

  const cardTheme = theme
    ? "bg-white text-black duration-300"
    : "bg-gray-900 text-white duration-300";

  return (
    <section className={`w-full flex justify-center items-center ${containerTheme}`}>
      <div className="w-full max-w-[1450px] p-4 flex flex-col lg:flex-row gap-4">
        {/* Left Panel */}
        <div
          className={`w-full lg:w-[20%] h-auto lg:h-[36.3rem] rounded-xl shadow-md p-4 ${cardTheme}`}
        >
          <LaftPanel />
        </div>

        {/* Middle Panel */}
        <div
          className={`w-full lg:w-[55%] h-auto lg:h-[36.3rem] rounded-xl shadow-md p-4 ${cardTheme}`}
        >
          {/* Content here */}
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-[25%] h-auto lg:h-[36.3rem] flex flex-col gap-4">
          <div className={`h-auto lg:h-[40%] w-full rounded-xl shadow-md p-4 ${cardTheme}`}>
            {/* Content here */}
          </div>
          <div className={`h-auto lg:h-[60%] w-full rounded-xl shadow-md p-4 ${cardTheme}`}>
            {/* Content here */}
          </div>
        </div>
      </div>
    </section>
  );
}
