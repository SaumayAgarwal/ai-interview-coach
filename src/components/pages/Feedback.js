// src/components/pages/Feedback.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Smile, TrendingUp, AlertCircle } from "lucide-react";
import PageWrapper from "../PageWrapper";

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.feedback ?? null;

  // Helper to safely render percent values (0-100)
  const pct = (v) => {
    const n = Number(v);
    if (!isFinite(n) || n <= 0) return 0;
    if (n > 100) return 100;
    return Math.round(n);
  };

  // Small card used multiple times
  const StatCard = ({ icon, title, value, colorClass, barColorClass }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-md ${colorClass}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-black">{title}</h3>
      </div>

      <div className="text-3xl font-bold text-black mb-2">{value}</div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`${barColorClass} h-3 rounded-full transition-all`}
          style={{ width: `${value}%` }}
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );

  // No analysis available
  if (!analysis || typeof analysis !== "object") {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center"
          >
            <h1 className="text-3xl font-bold text-black mb-6">Your AI Interview Feedback</h1>
            <p className="text-gray-700 mb-8">No feedback received yet. Please record or upload an interview to get analysis.</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/home")}
              className="bg-black text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-gray-900 transition"
            >
              Back to Home
            </motion.button>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  // Pull safe values
  const eyeScore = pct(analysis.eye_contact_score);
  const smileScore = pct(analysis.smile_engagement_score);
  const overall = pct(analysis.final_confidence ?? analysis.ai_confidence_score ?? 0);
  const dominantEmotion = analysis.dominant_emotion ?? "neutral";

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-100 px-6 py-12 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold text-black mb-6 text-center"
        >
          📊 Your AI Interview Feedback
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="w-full max-w-6xl bg-white rounded-3xl p-8 shadow-2xl border"
        >
          {/* Top: Overall score */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-gray-100 rounded-full px-8 py-6">
                <div className="text-5xl font-bold text-black">{overall}</div>
                <div className="text-sm text-gray-600 mt-1">Overall Confidence Score</div>
              </div>
            </div>

            {/* quick summary */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <div className="text-sm text-gray-600">AI Confidence</div>
                  <div className="text-2xl font-bold text-black">{pct(analysis.ai_confidence_score ?? 0)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <div className="text-sm text-gray-600">Rule-Based Confidence</div>
                  <div className="text-2xl font-bold text-black">{pct(analysis.rule_based_confidence ?? 0)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={<Eye size={20} className="text-black" />}
              title="Eye Contact"
              value={eyeScore}
              colorClass="bg-gray-100"
              barColorClass="bg-black"
            />

            <StatCard
              icon={<Smile size={20} className="text-black" />}
              title="Smile Engagement"
              value={smileScore}
              colorClass="bg-gray-100"
              barColorClass="bg-black"
            />

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-black" size={20} />
                <h3 className="text-lg font-semibold text-black">Dominant Emotion</h3>
              </div>
              <div className="text-3xl font-bold text-black capitalize">{dominantEmotion}</div>
              {analysis.smile_feedback && <div className="text-sm text-gray-600 mt-2">{analysis.smile_feedback}</div>}
            </div>
          </div>

          {/* Emotion timeline image (if present) */}
          {analysis.emotion_timeline_image && (
            <div className="mb-8 bg-white rounded-xl p-6 border shadow-sm">
              <h3 className="text-xl font-semibold text-black mb-4">Emotion Timeline</h3>
              <img
                src={`data:image/png;base64,${analysis.emotion_timeline_image}`}
                alt="Emotion Timeline"
                className="w-full rounded-lg border"
              />
            </div>
          )}

          {/* AI Feedback block */}
          {analysis.ai_overall_feedback && (
            <div className="bg-white rounded-xl p-6 border shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-black" size={20} />
                <h3 className="text-xl font-semibold text-black">AI Feedback</h3>
              </div>

              <div className="text-black leading-relaxed">
                {typeof analysis.ai_overall_feedback === "string" ? (
                  <p>{analysis.ai_overall_feedback}</p>
                ) : analysis.ai_overall_feedback?.summary ? (
                  <p>{analysis.ai_overall_feedback.summary}</p>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">{JSON.stringify(analysis.ai_overall_feedback, null, 2)}</pre>
                )}
              </div>
            </div>
          )}

          {/* Optional: Raw JSON (for debugging) */}
          <details className="text-sm text-gray-600">
            <summary className="cursor-pointer">Show raw analysis (JSON)</summary>
            <pre className="whitespace-pre-wrap mt-3 bg-gray-50 p-4 rounded text-xs">{JSON.stringify(analysis, null, 2)}</pre>
          </details>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/home")}
          className="mt-8 bg-black text-white px-10 py-3 rounded-full font-semibold shadow-md hover:bg-gray-900 transition"
        >
          Back to Home
        </motion.button>
      </div>
    </PageWrapper>
  );
};

export default Feedback;
