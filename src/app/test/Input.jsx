"use client";

import { useSelector, useDispatch } from "react-redux";
import { setInput } from "@/redux/test";

export default function Input() {
  const input = useSelector((state) => state.todotasks.input);

  const dispatch = useDispatch();

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => dispatch(setInput(e.target.value))}
        placeholder="Enter a new task..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
      />
    </div>
  );
}
