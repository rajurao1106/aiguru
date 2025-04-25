import React from 'react';

const page = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16 bg-gradient-to-br from-blue-50 to-pink-50">
      
      {/* About Us */}
      <section className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-400 hover:border-pink-400 transition">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">About AI Guru</h2>
        <p className="text-lg text-gray-800">
          <strong>AI Guru</strong> is a next-generation <strong>AI-powered education platform</strong> focused on transforming how students learn and grow. We use cutting-edge artificial intelligence to deliver <strong>instant doubt solving</strong>, <strong>smart learning paths</strong>, and <strong>personalized academic guidance</strong>. Our mission is to make education faster, smarter, and more accessible to every learner.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-400 hover:border-pink-400 transition">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Why Choose AI Guru?</h2>
        <ul className="list-disc list-inside text-lg text-gray-800 space-y-2">
          <li>Experience <strong>real-time doubt resolution</strong> with our AI-powered problem-solving engine.</li>
          <li>Scan questions instantly using image recognition for accurate answers.</li>
          <li>Get <strong>1:1 personalized academic guidance</strong> through our AI Counselor Bot.</li>
          <li>Take smart quizzes with our AI-generated <strong>MCQ test system</strong>.</li>
        </ul>
      </section>

      {/* Our Services */}
      <section className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-400 hover:border-pink-400 transition">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Our AI-Based Learning Services</h2>
        <ul className="list-disc list-inside text-lg text-gray-800 space-y-2">
          <li><strong className="text-blue-600">AI Math Problem Solver:</strong> Instantly solve complex math problems with step-by-step explanations.</li>
          <li><strong className="text-pink-600">Image-Based Question Scanning:</strong> Snap or upload a question image to get instant answers.</li>
          <li><strong className="text-blue-600">AI Counselor Bot:</strong> Academic counseling to guide you through your learning journey.</li>
          <li><strong className="text-pink-600">MCQ Test Generator:</strong> AI-generated quizzes to help you prepare and perform better.</li>
        </ul>
      </section>

      {/* Student Benefits */}
      <section className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-400 hover:border-pink-400 transition">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Key Benefits for Students</h2>
        <ul className="list-disc list-inside text-lg text-gray-800 space-y-2">
          <li>Interactive and intelligent learning experiences tailored to your pace.</li>
          <li>Instant academic support 24/7 with <strong>AI-based doubt clearing</strong>.</li>
          <li>Personalized learning journeys based on student performance.</li>
          <li>Access smart tools and resources from anywhere, anytime.</li>
        </ul>
      </section>

      {/* AI-Powered Features */}
      <section className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-400 hover:border-pink-400 transition">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">AI Guru Features</h2>
        <ul className="list-disc list-inside text-lg text-gray-800 space-y-2">
          <li><strong className="text-blue-600">Camera Integration:</strong> Capture any academic query directly using your phone’s camera.</li>
          <li><strong className="text-pink-600">Image Upload:</strong> Upload your questions and get solutions within seconds.</li>
          <li><strong className="text-blue-600">AI Counseling:</strong> Our smart bot offers ongoing guidance tailored to your needs.</li>
          <li><strong className="text-pink-600">Test Creation:</strong> Build personalized multiple-choice tests with automatic scoring.</li>
        </ul>
      </section>

    </div>
  );
};

export default page;
