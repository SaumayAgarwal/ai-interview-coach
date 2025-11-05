// src/components/pages/History.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../PageWrapper";

const History = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch results from backend or localStorage
    // Example using localStorage
    const storedResults = JSON.parse(localStorage.getItem("interviewResults")) || [];
    setResults(storedResults);
  }, []);

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-100 px-6 py-20 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-4xl w-full"
        >
          <h1 className="text-4xl font-bold text-black mb-6 text-center">Past Interview Results</h1>

          {results.length === 0 ? (
            <p className="text-black text-center text-lg">No results found.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((res, index) => (
                <div key={index} className="border border-gray-300 rounded-xl p-4 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-black">Interview #{index + 1}</p>
                    <p className="text-black text-sm">Date: {res.date}</p>
                  </div>
                  <div className="text-black font-bold">{res.score}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default History;
