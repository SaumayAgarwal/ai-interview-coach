import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-background to-gray-100">
      <motion.h1
        className="text-5xl font-serif text-primary mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Master Your Next Interview with AI Precision
      </motion.h1>

      <motion.p
        className="text-gray-600 text-lg max-w-xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Upload your video, receive instant feedback, and enhance your communication skills with AI-powered insights.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Link
          to="/interview"
          className="bg-secondary text-white px-8 py-3 rounded-md hover:bg-primary transition text-lg font-medium shadow-lg"
        >
          Start Practice
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;




