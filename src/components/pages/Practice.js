// src/components/pages/Practice.js
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import PageWrapper from "../PageWrapper";

const defaultQuestions = [];

const Practice = () => {
  const [recordingQuestionId, setRecordingQuestionId] = useState(null);
  const [videos, setVideos] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState(defaultQuestions);
  const [form, setForm] = useState({
    company: "",
    branch: "",
    round: "technical",
    experience: "fresher",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateQuestions = async () => {
    if (!form.company || !form.branch) {
      setError("Please fill company and branch.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8080/api/questions/generate", form, { timeout: 120000 });
      const data = res?.data || {};
      const qs = Array.isArray(data.questions) ? data.questions : [];
      setQuestions(qs.map((q, idx) => ({ id: idx + 1, text: q })));
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.error || e?.message || "Failed to generate questions");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecord = (questionId) => {
    if (recordingQuestionId === questionId) {
      setRecordingQuestionId(null);
      setVideos({
        ...videos,
        [questionId]: "https://via.placeholder.com/400x300?text=Recorded+Video",
      });
    } else {
      setRecordingQuestionId(questionId);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <h1 className="text-4xl md:text-5xl font-extrabold text-black text-center mb-12" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
          Practice Questions
        </h1>

        {/* Question generation form */}
        <div className="max-w-5xl mx-auto mb-8 bg-white rounded-3xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input name="company" value={form.company} onChange={onChange} placeholder="Company (e.g., Google)" className="px-4 py-3 rounded-lg border border-gray-300" />
            <input name="branch" value={form.branch} onChange={onChange} placeholder="Branch / Role (e.g., SDE)" className="px-4 py-3 rounded-lg border border-gray-300" />
            <select name="round" value={form.round} onChange={onChange} className="px-4 py-3 rounded-lg border border-gray-300">
              <option value="technical">Technical</option>
              <option value="hr">HR</option>
              <option value="managerial">Managerial</option>
            </select>
            <select name="experience" value={form.experience} onChange={onChange} className="px-4 py-3 rounded-lg border border-gray-300">
              <option value="fresher">Fresher</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button onClick={generateQuestions} disabled={loading} className="bg-black text-white font-semibold px-6 py-3 rounded-full disabled:opacity-50">
              {loading ? "Generating..." : "Generate Questions"}
            </button>
            {error && <div className="text-red-600 text-sm">{error}</div>}
          </div>
        </div>

        <div className="grid gap-10 max-w-5xl mx-auto">
          {(questions.length ? questions : defaultQuestions).map((q) => (
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