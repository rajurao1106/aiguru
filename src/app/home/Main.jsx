"use client"

import React, { useState } from "react";
import Asidebar from "./Asidebar";
import Home from "./Home";
import AddSubjectName from "./AddSubjectName";
import MyNotes from "./MyNotes";
import Navbar from "./Navbar";


export default function Layout() {
  const [active, setActive] = useState("home");

  return (
    <div className="flex w-full">
      <Asidebar setActive={setActive} active={active} />

      <div className="flex flex-col w-full">
        <Navbar/>
        <div className=" w-full border-t-[1px] border-gray-600 ">
          {active === "home" && <Home />}
        {active === "create" && <AddSubjectName />}
        {active === "notes" && <MyNotes />}
        </div>
      </div>
    </div>
  );
}
