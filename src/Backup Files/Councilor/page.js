"use client"
import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { MdVolumeUp, MdVolumeOff } from "react-icons/md";
import ReactMarkdown from "react-markdown"; // Import react-markdown

export default function Councilor() {
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [voiceInput, setVoiceInput] = useState(false);
  const recognitionRef = useRef(null);

  const ELEVEN_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  const VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID;

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const speakWithElevenLabs = async (text) => {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": ELEVEN_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.75,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Voice generation failed:", error);
    }
  };

  const handleAskAI = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    setAiResponse("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a helpful, caring, and wise school counselor AI. A student says: "${userInput}". Give them emotional support, advice, and a solution like a mentor and psychologist.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiResponse(generatedText);

      if (voiceOutput && generatedText) {
        await speakWithElevenLabs(generatedText);
      }
    } catch (err) {
      console.error(err);
      setAiResponse("Sorry, something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (voiceInput) {
      recognitionRef.current?.stop();
      setVoiceInput(false);
    } else {
      recognitionRef.current?.start();
      setVoiceInput(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 rounded-xl shadow-lg bg-white space-y-4">
      <h2 className="text-3xl font-bold text-center text-blue-700">
        🎓 Student Counselor AI
      </h2>

      <div className="flex items-center justify-between space-x-4">
        <button
          className={`px-4 py-2 rounded font-medium text-white flex items-center gap-2 ${
            voiceOutput ? "bg-green-600" : "bg-gray-400"
          }`}
          onClick={() => setVoiceOutput(!voiceOutput)}
        >
          {voiceOutput ? <MdVolumeUp /> : <MdVolumeOff />}
          Voice Output: {voiceOutput ? "ON" : "OFF"}
        </button>

        <button
          className={`px-4 py-2 rounded font-medium text-white flex items-center gap-2 ${
            voiceInput ? "bg-green-600" : "bg-gray-400"
          }`}
          onClick={toggleVoiceInput}
        >
          {voiceInput ? <FaMicrophone /> : <FaMicrophoneSlash />}
          Voice Input: {voiceInput ? "ON" : "OFF"}
        </button>
      </div>

      <textarea
        className="w-full border rounded-lg p-3 text-sm"
        rows={4}
        placeholder="Tell me what's bothering you..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg w-full"
        onClick={handleAskAI}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Get Advice"}
      </button>

      {aiResponse && (
        <div className="bg-gray-100 p-4 rounded shadow-inner mt-4">
          <strong className="text-blue-700">Counselor says:</strong>
          <div className="mt-2 text-gray-800 text-sm whitespace-pre-wrap">
            <ReactMarkdown>{aiResponse}</ReactMarkdown> {/* Render markdown response */}
          </div>
        </div>
      )}
    </div>
  );
}
