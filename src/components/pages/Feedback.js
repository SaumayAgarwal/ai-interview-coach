import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "../PageWrapper";

const Feedback = () => {
  return (
    <PageWrapper>
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-6 text-center">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-indigo-700 mb-4"
        >
          Your AI Interview Feedback
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 max-w-xl mb-8"
        >
          Based on your video analysis, here’s how you performed — communication, confidence, and body language.
        </motion.p>

        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
          <p className="text-left text-gray-700 mb-3">
            <strong>Confidence:</strong> 8/10 💪
          </p>
          <p className="text-left text-gray-700 mb-3">
            <strong>Body Language:</strong> 7.5/10 🧍
          </p>
          <p className="text-left text-gray-700">
            <strong>Communication Clarity:</strong> 9/10 🗣️
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Feedback;
