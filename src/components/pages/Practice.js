// src/components/pages/Practice.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../PageWrapper";

// Mock questions for now; replace with backend data
const mockQuestions = [
  { id: 1, text: "Tell me about a time you solved a difficult problem." },
  { id: 2, text: "Describe a challenging project you worked on." },
  { id: 3, text: "How do you handle tight deadlines?" },
];

const Practice = () => {
  const [recordingQuestionId, setRecordingQuestionId] = useState(null);
  const [videos, setVideos] = useState({});

  const handleRecord = (questionId) => {
    if (recordingQuestionId === questionId) {
      // Stop recording
      setRecordingQuestionId(null);
      setVideos({
        ...videos,
        [questionId]: "https://via.placeholder.com/400x300?text=Recorded+Video",
      });
    } else {
      // Start recording
      setRecordingQuestionId(questionId);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <h1 className="text-4xl md:text-5xl font-extrabold text-black text-center mb-12" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
          Practice Questions
        </h1>

        <div className="grid gap-10 max-w-5xl mx-auto">
          {mockQuestions.map((q) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              {/* Question Text */}
              <div className="flex-1">
                <p className="text-gray-800 text-lg md:text-xl">{q.text}</p>
              </div>

              {/* Video Preview */}
              {videos[q.id] && (
                <video
                  src={videos[q.id]}
                  controls
                  className="w-full md:w-64 h-40 rounded-xl object-cover shadow-md"
                />
              )}

              {/* Record Button */}
              <button
                onClick={() => handleRecord(q.id)}
                className={`w-48 py-3 rounded-full font-semibold text-white transition-all duration-300 shadow-lg ${
                  recordingQuestionId === q.id ? "bg-red-600 hover:bg-red-700" : "bg-black hover:bg-gray-900"
                }`}
              >
                {recordingQuestionId === q.id ? "Stop Recording" : "Record Video"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Practice;
