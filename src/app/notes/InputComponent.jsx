"use client"

// InputComponent.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setText } from "@/redux/themeSlice";

export default function InputComponent() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const handleSend = () => {
    dispatch(setText(value)); // Send to Redux store
  };

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
