import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white relative overflow-hidden">

      {/* Background animation circles */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute w-64 h-64 bg-blue-400 opacity-20 rounded-full top-10 left-10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-72 h-72 bg-indigo-500 opacity-20 rounded-full bottom-10 right-10 blur-3xl"
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center px-6"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Your Personal <span className="text-blue-300">AI Interview Coach</span>
        </h1>

        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
          Practice real-world interview scenarios powered by AI.  
          Get instant feedback, improve your responses, and build confidence.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-white text-blue-800 font-semibold rounded-full shadow-lg hover:bg-blue-100 transition-all"
        >
          Start Learning →
        </motion.button>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm text-blue-200">
        © {new Date().getFullYear()} AI Interview Coach. All rights reserved.
      </footer>
    </div>
  );
}
;



