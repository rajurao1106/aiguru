"use client";

import React, { useState, useEffect } from "react";

export default function Page() {
  const [name, setName] = useState("");

  // Load saved value on component mount
  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  // Save value to localStorage when input changes
  const handleChange = (e) => {
    setName(e.target.value);
    localStorage.setItem("username", e.target.value);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Enter your name:</h2>
      <input
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="Type here"
      />
      <p style={{ marginTop: "1rem" }}>Stored name: <strong>{name}</strong></p>
    </div>
  );
}
