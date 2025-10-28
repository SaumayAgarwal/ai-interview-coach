import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold text-blue-800 mb-6"
        >
          Welcome to Your <span className="text-indigo-600">AI Interview Coach</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-gray-600 text-lg mb-10"
        >
          Get personalized, AI-powered feedback to boost your confidence and improve your interview performance.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-4 rounded-full shadow-lg transition"
        >
          Start Learning 🚀
        </motion.button>
      </div>
    </PageWrapper>
  );
};

export default Landing;
