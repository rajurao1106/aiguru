"use client"
import { useState } from "react";
import { FaMicrophone, FaArrowUp } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import { motion } from "framer-motion";

export default function InputWithMic() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchDefinition = () => {
    setIsLoading(true);
    // simulate fetch delay
    setTimeout(() => setIsLoading(false), 2000);
  };

  const startVoiceRecognition = () => {
    console.log("Voice recognition started..."); // implement later
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or use mic..."
        className="border px-4 py-2 rounded-full"
      />

      {input.trim() === "" ? (
        <motion.button
          onClick={startVoiceRecognition}
          className="p-3 border border-gray-500 bg-white text-black rounded-full"
        >
          <FaMicrophone />
        </motion.button>
      ) : (
        <motion.button
          onClick={fetchDefinition}
          disabled={isLoading}
          className="p-3 border border-gray-500 bg-white text-black rounded-full font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? <IoCreateOutline /> : <FaArrowUp />}
        </motion.button>
      )}
    </div>
  );
}
