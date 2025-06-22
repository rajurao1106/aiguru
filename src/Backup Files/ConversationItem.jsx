import React from "react";
import { motion } from "framer-motion";
import { formatText } from "./utils";
import { downloadDefinitionAsWord } from "./api";

const ConversationItem = ({ item, index, video, setConversationHistory, mcq, selectedOption, setSelectedOption, isCheckingAnswer, setIsCheckingAnswer, setError, speakText }) => {
  const checkMCQAnswer = () => {
    if (!mcq) {
      setError("⚠️ No MCQ available to check.");
      return;
    }
    if (!selectedOption) {
      setError("⚠️ Please select an option before submitting.");
      return;
    }

    setIsCheckingAnswer(true);
    setError(null);

    try {
      const isCorrect = selectedOption === mcq.correctAnswer;
      const responseText = isCorrect ? "Correct! Well done!" : `Incorrect. The correct answer is ${mcq.correctAnswer}: ${mcq.options[mcq.correctAnswer]}`;

      setConversationHistory((prev) => [
        ...prev,
        { type: "mcq_answer", text: `You selected: ${selectedOption}) ${mcq.options[selectedOption]}` },
        { type: "response", text: responseText },
      ]);
      speakText(responseText);
      setSelectedOption("");
    } catch (error) {
      setError(`⚠️ Error checking answer: ${error.message}`);
    } finally {
      setIsCheckingAnswer(false);
    }
  };

  let content;
  switch (item.type) {
    case "definition":
      content = (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-6 max-lg:p-4 rounded-2xl shadow-lg w-full">
          <div dangerouslySetInnerHTML={{ __html: formatText(item.text) }} />
          <motion.button onClick={() => downloadDefinitionAsWord([item])} whileTap={{ scale: 0.9 }} className="mt-4 p-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
            Download as Word
          </motion.button>
          {video && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="py-6 w-full">
              <p>Recommended Video:</p>
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{video.title}</a>
              <p className="text-gray-400">by {video.channel}</p>
            </motion.div>
          )}
        </motion.div>
      );
      break;
    case "question":
      content = <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-700 m-4 p-3 rounded-lg text-white" dangerouslySetInnerHTML={{ __html: formatText(item.text) }} />;
      break;
    case "answer":
      content = <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-left w-full p-3 rounded-lg text-white" dangerouslySetInnerHTML={{ __html: formatText(item.text) }} />;
      break;
    case "response":
      content = <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-700 m-4 p-3 rounded-lg text-white" dangerouslySetInnerHTML={{ __html: formatText(item.text) }} />;
      break;
    case "mcq":
      content = (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-700 m-4 p-3 rounded-lg text-white">
          <p dangerouslySetInnerHTML={{ __html: formatText(item.text.question) }} />
          <form>
            <ul className="list-none mt-2">
              {Object.entries(item.text.options).map(([key, value]) => (
                <li key={key} className="my-1">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`mcq-${index}`}
                      value={key}
                      checked={selectedOption === key}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="mr-2"
                    />
                    {key}) {value}
                  </label>
                </li>
              ))}
            </ul>
          </form>
          <motion.button onClick={checkMCQAnswer} whileTap={{ scale: 0.9 }} disabled={isCheckingAnswer} className="mt-4 p-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
            {isCheckingAnswer ? "Checking..." : "Submit MCQ Answer"}
          </motion.button>
        </motion.div>
      );
      break;
    case "mcq_answer":
      content = <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-left w-full p-3 rounded-lg text-white" dangerouslySetInnerHTML={{ __html: formatText(item.text) }} />;
      break;
    default:
      content = null;
  }
  return <div>{content}</div>;
};

export default ConversationItem;