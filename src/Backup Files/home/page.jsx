'use client';

import React, { useEffect } from 'react';
import Main from './Main';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setThemeLoaded } from '@/redux/themeSlice';

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
    <div className={`flex ${textTheme}`}>
      <Main isDark={isDark}/>
    </div>
  );
}
