import React from "react";

const features = [
  "User Authentication (Login / Register)",
  "Avatar & Cover Image Upload",
  "Secure Password Hashing",
  "Video Upload System (Coming Soon)",
  "Like & Subscribe Feature (Planned)",
  "Responsive Dark UI",
];

const techStack = [
  "React + Tailwind CSS",
  "Node.js + Express",
  "MongoDB",
  "Multer (File Upload)",
  "Cloudinary (Image Storage)",
  "JWT Authentication",
];

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold text-red-600 mb-6">YouTube Clone</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          A full-stack video streaming platform built with modern web
          technologies. This project focuses on authentication, media upload,
          and scalable backend architecture.
        </p>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold text-red-500 mb-8 text-center">
          🚀 Features
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#121212] p-6 rounded-2xl border border-red-900/40 hover:border-red-600 transition duration-300 shadow-lg hover:shadow-red-900/20"
            >
              <p className="text-gray-300">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold text-red-500 mb-8 text-center">
          🛠 Tech Stack
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="bg-[#121212] p-6 rounded-2xl border border-gray-800 hover:border-red-600 transition duration-300 text-center"
            >
              <p className="text-gray-300 font-medium">{tech}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Future Plans */}
      <div className="max-w-4xl mx-auto text-center bg-[#121212] p-10 rounded-3xl border border-red-900/40 shadow-xl">
        <h2 className="text-3xl font-semibold text-red-500 mb-6">
          🔥 Future Improvements
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Upcoming features include video streaming functionality, real-time
          comments, subscription system, channel dashboard, and advanced
          recommendation algorithms.
        </p>
      </div>
    </div>
  );
};

export default Home;
