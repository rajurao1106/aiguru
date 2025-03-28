export const speakText = (text) => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    synth.speak(speech);
  };
  
  export const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-white'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='italic text-gray-200'>$1</em>")
      .replace(/__([^_]+)__/g, "<u class='underline'>$1</u>")
      .replace(/~~(.*?)~~/g, "<del class='line-through text-gray-400'>$1</del>")
      .replace(/`([^`]+)`/g, "<code class='bg-gray-800 text-yellow-200 px-2 py-0.5 rounded-md font-mono text-sm shadow-sm border border-gray-700'>$1</code>")
      .replace(/### (.*?)(?:\n|$)/g, "<h3 class='text-xl font-semibold text-white mt-4 mb-2'>$1</h3>")
      .replace(/## (.*?)(?:\n|$)/g, "<h2 class='text-2xl font-bold text-white mb-3'>$1</h2>")
      .replace(/# (.*?)(?:\n|$)/g, "<h1 class='text-3xl font-extrabold text-white mt-8 mb-4'>$1</h1>")
      .replace(/(?:\n|^)- (.*?)(?=\n|$)/g, (match, p1) => "<ul class='list-disc ml-6 text-gray-200'><li>$1</li></ul>")
      .replace(/\n>\s(.*?)(?=\n|$)/g, "<blockquote class='border-l-4 border-blue-500 pl-4 italic text-gray-300 my-2'>$1</blockquote>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' class='text-blue-400 underline hover:text-blue-300 transition-colors'>$1</a>")
      .replace(/\n/g, "<br>")
      .replace(/(<\/ul><ul class='list-disc ml-6 text-gray-200'>)+/g, "")
      .replace(/(<\/ol><ol class='list-decimal ml-6 text-gray-200'>)+/g, "");
  };