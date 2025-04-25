import React from 'react';

const page = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16 bg-gradient-to-br from-blue-50 to-pink-50">
      
      {/* Section Wrapper */}
      {[
        {
          title: "About Us",
          content: (
            <p className="text-lg text-gray-800">
              At <span className="font-semibold text-pink-600">AI Guru</span>, we are dedicated to revolutionizing education through artificial intelligence. Our platform empowers students with instant solutions, personalized learning experiences, and innovative tools designed to make learning more accessible and effective.
            </p>
          )
        },
        {
          title: "Why Choose Us",
          content: (
            <ul className="list-disc list-inside text-lg text-gray-800 space-y-2">
              <li>Instant doubt resolution with <span className="text-blue-600 font-medium">AI-powered</span> problem solvers.</li>
              <li>Interactive learning through image scanning and real-time answers.</li>
              <li>Personalized guidance with our <span className="text-pink-600 font-medium">AI Counselor Bot</span>.</li>
              <li>Comprehensive MCQ tests to assess and enhance understanding.</li>
            </ul>
          )
        },
        {
          title: "Services",
          content: (
            <ul className="list-disc list-inside text-lg text-gray-800 space-y-2">
              <li><strong className="text-blue-600">AI Math Problem Solver:</strong> Instantly solve mathematical queries with step-by-step explanations.</li>
              <li><strong className="text-pink-600">Image-Based Question Scanning:</strong> Upload or capture images of questions to receive immediate solutions.</li>
              <li><strong className="text-blue-600">AI Counselor Bot:</strong> Get personalized academic guidance and support.</li>
              <li><strong className="text-pink-600">MCQ Test Generator:</strong> Create and take multiple-choice quizzes to test your knowledge.</li>
            </ul>
          )
        },
        {
          title: "Benefits for Students",
          content: (
            <ul className="list-disc list-inside text-lg text-gray-800 space-y-2">
              <li>Enhanced understanding through interactive problem-solving.</li>
              <li>Personalized learning paths tailored to individual needs.</li>
              <li>Immediate feedback to foster continuous improvement.</li>
              <li>Accessible learning resources anytime, anywhere.</li>
            </ul>
          )
        },
        {
          title: "Features",
          content: (
            <ul className="list-disc list-inside text-lg text-gray-800 space-y-2">
              <li><strong className="text-blue-600">Camera Integration:</strong> Capture questions directly using your device's camera for instant solutions.</li>
              <li><strong className="text-pink-600">Image Upload:</strong> Upload images of questions to receive detailed answers.</li>
              <li><strong className="text-blue-600">AI Counselor Bot:</strong> Engage with our AI bot for academic counseling and support.</li>
              <li><strong className="text-pink-600">MCQ Test Creation:</strong> Generate and take customized multiple-choice quizzes to assess your knowledge.</li>
            </ul>
          )
        },
      ].map(({ title, content }, i) => (
        <section
          key={i}
          className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-400 hover:border-pink-400 transition duration-300"
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-4">{title}</h2>
          {content}
        </section>
      ))}

    </div>
  );
};

export default page;
