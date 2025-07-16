import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      q: "What is DigiNote?",
      a: "DigiNote is an AI-powered note-making tool that automatically generates summaries and structured notes from videos, audio, PDFs, and text content—designed to accelerate learning and boost retention.",
    },
    {
      q: "How does DigiNote work?",
      a: "DigiNote uses advanced natural language processing (NLP) to analyze your input content and generate concise, meaningful notes by extracting key points, highlights, and summaries.",
    },
    {
      q: "What types of content can I use with DigiNote?",
      a: "You can upload or paste content from YouTube videos, PDFs, audio files, Word documents, and web articles. Support for more formats is continuously being expanded.",
    },
    {
      q: "Can DigiNote summarize YouTube videos?",
      a: "Yes! You can paste a YouTube link and DigiNote will extract the transcript and create a clear, readable summary or structured notes.",
    },
    {
      q: "Is DigiNote free to use?",
      a: "Yes, DigiNote is free to use and offers core features like summarization, note generation, and keyword extraction at no cost.",
    },
    {
      q: "Do I need an account to use DigiNote?",
      a: "In most cases, you can start summarizing content without signing up. However, creating an account gives you access to saved notes, history, and more customization options.",
    },
    {
      q: "Is my uploaded data safe?",
      a: "Absolutely. All uploaded content is encrypted and processed securely. We don’t share or store your data beyond what's necessary to generate your notes.",
    },
    {
      q: "Can I use DigiNote during live meetings or classes?",
      a: "Live summarization is not yet available, but it’s in development. Currently, you can upload recorded sessions or transcripts to get instant notes.",
    },
    {
      q: "Can I customize how notes are generated?",
      a: "Yes, DigiNote lets you choose between formats like bullet points, paragraph summaries, or key takeaways. You can also adjust summary length.",
    },
    {
      q: "Which platforms or extensions are available?",
      a: "DigiNote is available via the web app and Chrome extension. The extension works with platforms like YouTube, Udemy, Coursera, and more.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 px-4 sm:px-8 lg:px-24 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }, idx) => (
            <Accordion
              key={idx}
              isOpen={openIndex === idx}
              question={q}
              answer={a}
              onClick={() => toggleFAQ(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Accordion({ question, answer, isOpen, onClick }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-lg font-medium text-gray-800">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="overflow-hidden transition-all duration-500 ease-in-out px-5"
      >
        <div className="pb-4 text-gray-600">{answer}</div>
      </div>
    </div>
  );
}
