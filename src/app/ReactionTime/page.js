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
      className={`flex flex-col items-center justify-center py-20 ${
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
        <h2 className="text-lg font-bold text-gray-800">Measurement Notice</h2>
        <p className="mt-2 text-gray-700">This test measures your brain’s reaction speed in milliseconds (ms).</p>
        <p className="mt-2 text-gray-700"><strong>⚡ 200-250 ms:</strong> Super Fast (Like a pro gamer or athlete!)</p>
        <p className="mt-2 text-gray-700"><strong>🏃‍♂️ 250-350 ms:</strong> Normal Speed (Most people fall here.)</p>
        <p className="mt-2 text-gray-700"><strong>🐢 350+ ms:</strong> Slow (You can improve with practice!)</p>
        <p className="mt-4 text-gray-700 font-bold">⚠️ Important Factors Affecting Reaction Time:</p>
        <p className="text-gray-700">✅ Sleep | ✅ Focus | ✅ Stress | ✅ Practice</p>
        <p className="mt-2 text-gray-700">🔄 Tip: Take multiple tests and try improving your score!</p>
      </div>
       
       <div className="mt-8 bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
        
        <h2 className="text-xl font-bold text-gray-800">Willpower & Reaction Time Test</h2>
        <p className="mt-4 text-gray-700">
          🧠 <strong>1. Builds Self-Control & Patience:</strong> You have to wait before clicking, which helps train self-control.
        </p>
        <p className="mt-2 text-gray-700">
          ⚡ <strong>2. Improves Thinking Speed:</strong> Helps you react faster, useful for gaming, sports, and driving.
        </p>
        <p className="mt-2 text-gray-700">
          🎯 <strong>3. Helps You Focus Better:</strong> Training attention improves performance in studies.
        </p>
        <p className="mt-2 text-gray-700">
          🏆 <strong>4. Strengthens Your Brain Like a Gym Workout:</strong> Each test boosts neuroplasticity.
        </p>
        <p className="mt-2 text-gray-700">
          🏁 <strong>5. Gives You a Challenge & Motivation:</strong> Compete with yourself and improve over time.
        </p>
        <p className="mt-2 text-gray-700">
          🚀 <strong>6. Helps You in Real Life:</strong> Fast reflexes benefit gaming, sports, and safe driving.
        </p>
        <p className="mt-4 text-gray-800 font-bold">🔥 Final Thoughts:</p>
        <p className="text-gray-700">A simple test that enhances focus, reaction speed, and mental agility!</p>
      </div>
      
      
    </div>
  );
}
