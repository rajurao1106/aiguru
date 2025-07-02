"use client";
import Image from "next/image";

const features = [
  {
    title: "AI Topic Definition",
    image: "/images/homepage/feature3.jpg",
    bgColor: "bg-[#F5F9FF]",
    description:
      "AI Topic Definition is a smart tool that explains topics in a clear and simple way. It helps students learn and prepare for exams by making any subject easy to understand.",
    points: [
      "✅ Get topic explanations in simple, easy-to-understand language.",
      "✅ Useful for school, college, and competitive exam prep.",
      "✅ Works for any subject or concept.",
    ],
    button: "Explore Topic AI",
  },
  {
    title: "AI Notes Builder",
    image: "/images/homepage/feature2.jpg",
    bgColor: "bg-[#FFF8F3]",
    description:
      "AI Notes Builder helps you turn your thoughts or answers into well-organized notes. It makes studying easier by creating clear, easy-to-read summaries for any topic.",
    points: [
      "✅ Auto-generate study notes from any topic or text.",
      "✅ Manually edit and add your own points anytime.",
      "✅ Export to PDF or keep stored in your notebook.",
    ],
    button: "Try Notes Builder",
  },
  {
    title: "AI Smart Learning Path",
    image: "/images/homepage/feature4.jpg",
    bgColor: "bg-[#F3FFF8]",
    description:
      "AI Smart Learning Path creates a personalized study plan based on what you know and what you need to improve. It guides your learning step-by-step to help you progress faster.",
    points: [
      "✅ Automatically group topics into chapters and subjects.",
      "✅ Practice topic-based or full subject tests.",
      "✅ Perfect for smart exam revision and tracking progress.",
    ],
    button: "Start Smart Flow",
  },
  {
    title: "AI MCQ Practice",
    image: "/images/homepage/feature5.jpg",
    bgColor: "bg-[#F0F7FF]",
    description:
      "AI MCQ Practice gives you multiple-choice questions to test your knowledge. It adapts to your level and helps you learn better by showing the right answers with explanations.",
    points: [
      "✅ Practice unlimited MCQs generated from your topic.",
      "✅ Instant answer feedback with explanations.",
      "✅ Score tracking and retry options available.",
    ],
    button: "Start MCQ Practice",
  },
  {
    title: "YouTube Video Link",
    image: "/images/homepage/feature6.jpg",
    bgColor: "bg-[#FFF5F8]",
    description:
      "YouTube Video Link suggests helpful videos related to your topic. It lets you learn by watching trusted content, making hard concepts easier to understand through visual explanation.",
    points: [
      "✅ Get the best YouTube video based on your topic instantly.",
      "✅ Helps visual learners with real-world examples.",
      "✅ One click to watch — no distractions, no ads.",
    ],
    button: "Watch Video",
  },
];

export default function AiFeatures() {
  return (
    <section className="w-full py-12 px-4 bg-[#F5FBFF] flex flex-col items-center">
      {/* Section heading */}
      <div className="mb-8 bg-[#DDF2FF] px-6 py-2 rounded-xl text-2xl font-semibold text-[#222]">
        AI Learning Features
      </div>

      {/* Looping Features */}
      {features.map((feature, index) => {
        const isEven = index % 2 === 0;
        return (
          <div
            key={index}
            className={`w-full max-w-6xl ${
              feature.bgColor
            } rounded-2xl p-6 md:p-10 flex flex-col md:flex-row ${
              isEven ? "" : "md:flex-row-reverse"
            } gap-8 items-center justify-between mb-10`}
          >
            {/* Image Side */}
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src={feature.image}
                alt={feature.title}
                width={400}
                height={300}
                className="rounded-xl shadow-lg"
              />
            </div>

            {/* Text Side */}
            <div className="w-full md:w-1/2 text-left text-[#1A1A1A] space-y-5">
              <h2 className="text-2xl font-bold">{feature.title}</h2>
              <p className="text-[16px]">{feature.description}</p>
              <ul className="space-y-3 text-[17px]">
                {feature.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <a href="/ai-studytool">
                <button className="mt-6 px-6 py-2 rounded-md bg-[#00D084] text-white font-medium hover:bg-[#00b873] transition">
                  {feature.button}
                </button>
              </a>
            </div>
          </div>
        );
      })}
    </section>
  );
}
