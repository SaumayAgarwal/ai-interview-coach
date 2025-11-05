// src/components/pages/PreInterviewForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../PageWrapper";

const PreInterviewForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jobRole: "",
    company: "",
    difficulty: "medium",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("preInterviewData", JSON.stringify(formData));
    navigate("/practice"); // or "/interview" if needed
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full"
        >
          <h1 className="text-3xl font-bold text-black mb-6 text-center">
            Tell us about yourself
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Job Role */}
            <div className="flex flex-col">
              <label className="text-black font-semibold mb-1">Job Role</label>
              <input
                type="text"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Company */}
            <div className="flex flex-col">
              <label className="text-black font-semibold mb-1">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., Google"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Difficulty Level */}
            <div className="flex flex-col">
              <label className="text-black font-semibold mb-1">Difficulty Level</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-black text-white font-semibold px-10 py-4 rounded-full shadow-lg transition-all duration-300 mt-4"
            >
              Start Practice
            </motion.button>
          </form>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default PreInterviewForm;
