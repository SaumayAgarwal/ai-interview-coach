// src/components/pages/Home.js
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../PageWrapper";

const Home = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-100 px-6 py-12 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl w-full text-center flex flex-col gap-8"
        >
          <h1 className="text-5xl font-extrabold text-black mb-4">
            Welcome Back!
          </h1>
          <p className="text-black text-lg mb-8">
            Choose an option below to start your AI interview journey.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            {/* Start Interview → goes directly to interview page */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/interview")}
              className="bg-black text-white font-semibold px-10 py-4 rounded-full shadow-lg transition-all duration-300"
            >
              Start Interview
            </motion.button>

            {/* Practice Questions → goes to Pre-Interview Form */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/pre-interview")}
              className="bg-black text-white font-semibold px-10 py-4 rounded-full shadow-lg transition-all duration-300"
            >
              Practice Questions
            </motion.button>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Home;

