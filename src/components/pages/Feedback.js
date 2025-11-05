// src/components/pages/Feedback.js
import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "../PageWrapper";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Mock feedback data
const mockData = [
  { name: "Communication", score: 80 },
  { name: "Confidence", score: 70 },
  { name: "Clarity", score: 90 },
  { name: "Body Language", score: 75 },
];

const Feedback = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-black mb-12 text-center"
          style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
        >
          Your Feedback
        </motion.h1>

        {/* Grid for Score + Strengths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">

          {/* Score Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center"
          >
            <h2 className="text-2xl font-bold text-black mb-6">Scores</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#1f2937" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Strengths & Weaknesses */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-black mb-6">Strengths</h2>
            <ul className="list-disc list-inside text-gray-700 mb-8">
              <li>Clear communication</li>
              <li>Strong confidence</li>
              <li>Structured answers</li>
            </ul>

            <h2 className="text-2xl font-bold text-black mb-6">Weaknesses</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Some filler words</li>
              <li>Improve body language</li>
            </ul>
          </motion.div>

        </div>

        {/* Optional: Try Again Button */}
        <div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
            className="bg-black hover:bg-gray-900 text-white font-semibold px-10 py-4 rounded-full shadow-lg transition-all duration-300"
            onClick={() => window.location.href = "/interview"}
          >
            Try Another Interview
          </motion.button>
        </div>

      </div>
    </PageWrapper>
  );
};

export default Feedback;
