"use client"

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AiStudyTool from './AiStudyTool';

export default function page() {
      const [theme, setTheme] = useState(true);
      
       const themeHandle = () => {
        setTheme((prev) => !prev);
      };
  return (
    <div>
     <Navbar theme={theme} themeHandle={themeHandle}/>
     <AiStudyTool theme={theme} themeHandle={themeHandle}/>
       <Footer/>
    </div>
  )
}
