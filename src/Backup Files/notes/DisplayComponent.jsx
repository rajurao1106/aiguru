"use client"

// DisplayComponent.jsx
import React from "react";
import { useSelector } from "react-redux";

export default function DisplayComponent() {
  const text = useSelector((state) => state.input.text);

  return (
    <div>
      <h2>Text from Redux:</h2>
      <p>{text}</p>
    </div>
  );
}
