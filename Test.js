'use client'
import React, { useState, useRef } from 'react';

export default function Home() {
  const [listening, setListening] = useState(false);
  const [conversations, setConversations] = useState([]);
  const recognitionRef = useRef(null);

  const handleVoiceClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support Speech Recognition');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setConversations((prev) => [...prev, transcript]);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <button
        onClick={handleVoiceClick}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        {listening ? 'Listening...' : 'Start Voice Mode'}
      </button>

      <div className="mt-8 w-full max-w-md space-y-4">
        {conversations.map((text, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-100">
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
