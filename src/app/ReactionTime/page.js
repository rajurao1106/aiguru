"use client";
import { useState, useEffect } from "react";

export default function WillpowerMonitor() {
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [message, setMessage] = useState("Click to start test");

  const startTest = () => {
    setMessage("Wait for Red Light...");
    const delay = Math.random() * 3000 + 2000; // Random delay between 2-5 sec
    setTimeout(() => {
      setStartTime(Date.now());
      setMessage("Click NOW!");
    }, delay);
  };

  const endTest = () => {
    if (!startTime) return;
    const timeTaken = Date.now() - startTime;
    setReactionTime(timeTaken);
    setStartTime(null);
    setMessage("Click to start test");
  };

  return (
    <div
    onClick={startTime ? endTest : startTest}
      className={`flex flex-col items-center justify-center h-screen ${
        startTime ? "bg-red-500" : "bg-green-500"
      }`}
    >
      <h1 className="text-2xl font-bold">Willpower & Reaction Time Test</h1>
      <p className="mt-4">{message}</p>
      <button
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
        onClick={startTime ? endTest : startTest}
      >
        {startTime ? "Click!" : "Start"}
      </button>
      {reactionTime && (
        <p className="mt-4 text-lg">Reaction Time: {reactionTime} ms</p>
      )}
       <div className="mt-6 bg-white p-4 rounded-lg shadow-lg text-center max-w-sm">
        <strong className="text-lg">Reaction Time Comparison</strong>
        <p className="mt-2 text-gray-700">
          <strong className="text-green-600">200-250 ms:</strong> Super Fast (Pro gamers, athletes) <br />
          <strong className="text-yellow-600">250-350 ms:</strong> Average (Normal adults) <br />
          <strong className="text-red-600">350+ ms:</strong> Slow (Needs more practice)
        </p>
      </div>
    </div>
  );
}
