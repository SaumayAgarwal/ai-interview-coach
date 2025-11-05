// src/components/pages/Landing.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../PageWrapper";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-xl w-full text-center"
        >
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold text-black mb-6"
            style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
          >
            Welcome to <span className="text-indigo-600">AI Interview Coach</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-black text-lg mb-12"
          >
            Get personalized, AI-powered feedback to boost your confidence, improve your interview skills, and land your dream job.
          </motion.p>

          {/* Start Learning Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/signup")}
            className="bg-black hover:bg-gray-900 text-white font-semibold text-lg px-12 py-4 rounded-full shadow-lg transition-all duration-300"
          >
            Start Learning 🚀
          </motion.button>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Landing;
