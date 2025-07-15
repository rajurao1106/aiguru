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
    <div className="flex w-full ">
     

      <div className="flex flex-col w-full">
        {/* <Navbar/> */}
        <div className=" w-full  ">
          {active === "home" && <Home />}
        {active === "create" && <AddSubjectName />}
        {active === "notes" && <MyNotes />}
        </div>
      </div>
    </div>
  );
}
