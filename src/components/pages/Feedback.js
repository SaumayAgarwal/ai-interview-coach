import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Smile, TrendingUp, AlertCircle, Mic } from "lucide-react";
import PageWrapper from "../PageWrapper";

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.feedback ?? null;

  const pct = (v) => {
    const n = Number(v);
    if (!isFinite(n) || n <= 0) return 0;
    const percent = n <= 1 ? n * 100 : n;
    return Math.round(Math.min(percent, 100));
  };

  const barWidth = (value) => {
    const n = Number(value);
    if (!isFinite(n) || n <= 0) return "0%";
    const percent = n <= 1 ? n * 100 : n;
    return `${Math.min(100, Math.round(percent))}%`;
  };

  const formatScore = (value) => {
    const n = Number(value);
    if (!isFinite(n)) return "0.00";
    return n.toFixed(2);
  };

  const StatCard = ({ icon, title, value, colorClass, barColorClass }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-md ${colorClass}`}>{icon}</div>
        <h3 className="text-lg font-semibold text-black">{title}</h3>
      </div>
      <div className="text-3xl font-bold text-black mb-2">{value}%</div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`${barColorClass} h-3 rounded-full transition-all`}
          style={{ width: barWidth(value) }}
        />
      </div>
    </div>
  );

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
            <h1 className="text-3xl font-bold text-black mb-6">
              Your AI Interview Feedback
            </h1>
            <p className="text-gray-700 mb-8">
              No feedback received yet. Please record or upload an interview to
              get analysis.
            </p>
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

  const eyeScore = pct(analysis.eye_contact_score);
  const smileScore = pct(analysis.smile_engagement_score);
  const overall = pct(
    analysis.final_confidence ?? analysis.ai_confidence_score ?? 0
  );
  const dominantEmotion = analysis.dominant_emotion ?? "neutral";

  const textAnalysis =
    analysis.text_analysis && typeof analysis.text_analysis === "object"
      ? analysis.text_analysis
      : {};

  const wordCount = analysis.word_count ?? textAnalysis.word_count;
  const fillerCount = analysis.filler_count ?? textAnalysis.filler_count;
  const textSentiment = analysis.text_sentiment ?? textAnalysis.sentiment;
  const textEmotion = analysis.text_emotion ?? textAnalysis.dominant_emotion;
  const fluencyScore = analysis.fluency_score ?? textAnalysis.fluency_score;
  const textAiConfidence =
    analysis.text_ai_confidence ?? textAnalysis.ai_confidence;
  const textFinalConfidence =
    analysis.text_confidence ?? textAnalysis.final_confidence;
  const textAiFeedback =
    analysis.text_ai_feedback ?? textAnalysis.ai_feedback;
  const textError = analysis.text_analysis_error ?? textAnalysis.error;
  const combinedConfidence =
    analysis.combined_confidence ?? textAnalysis.combined_confidence;

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
          {/* Scores */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-gray-100 rounded-full px-8 py-6">
                <div className="text-5xl font-bold text-black">{overall}%</div>
                <div className="text-sm text-gray-600 mt-1">
                  Overall Confidence Score
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <div className="text-sm text-gray-600">AI Confidence</div>
                  <div className="text-2xl font-bold text-black">
                    {pct(analysis.ai_confidence_score ?? 0)}%
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <div className="text-sm text-gray-600">
                    Rule-Based Confidence
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {pct(analysis.rule_based_confidence ?? 0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Eye & Smile Stats */}
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
                <h3 className="text-lg font-semibold text-black">
                  Dominant Emotion
                </h3>
              </div>
              <div className="text-3xl font-bold text-black capitalize">
                {dominantEmotion}
              </div>
            </div>
          </div>

          {/* Emotion Timeline */}
          {analysis.emotion_timeline_image && (
            <div className="mb-8 bg-white rounded-xl p-6 border shadow-sm">
              <h3 className="text-xl font-semibold text-black mb-4">
                Emotion Timeline
              </h3>
              <img
                src={`data:image/png;base64,${analysis.emotion_timeline_image}`}
                alt="Emotion Timeline"
                className="w-full rounded-lg border"
              />
            </div>
          )}

          {/* Speech Analysis Section */}
          {(wordCount ||
            fillerCount ||
            textSentiment ||
            textEmotion ||
            fluencyScore ||
            textAiConfidence ||
            textFinalConfidence ||
            textAiFeedback) && (
            <div className="bg-white rounded-xl p-6 border shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Mic className="text-black" size={24} />
                <h2 className="text-2xl font-bold text-black">
                  🎤 Speech Analysis
                </h2>
              </div>

              {textError ? (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-sm font-semibold text-red-700 mb-2">
                    ⚠ Text Analysis Error:
                  </div>
                  <div className="text-red-600 text-sm">{textError}</div>
                </div>
              ) : (
                <>
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {wordCount && (
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="text-sm text-gray-600 mb-1">
                          Word Count
                        </div>
                        <div className="text-2xl font-bold text-black">
                          {wordCount}
                        </div>
                      </div>
                    )}
                    {fillerCount && (
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="text-sm text-gray-600 mb-1">
                          Filler Words
                        </div>
                        <div className="text-2xl font-bold text-black">
                          {fillerCount}
                        </div>
                      </div>
                    )}
                    {textSentiment && (
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="text-sm text-gray-600 mb-1">
                          Sentiment
                        </div>
                        <div className="text-2xl font-bold text-black capitalize">
                          {textSentiment}
                        </div>
                      </div>
                    )}
                    {textEmotion && (
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="text-sm text-gray-600 mb-1">
                          Dominant Emotion
                        </div>
                        <div className="text-2xl font-bold text-black capitalize">
                          {textEmotion}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fluency Bar */}
                  {fluencyScore && (
                    <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-gray-700">
                          Fluency Score
                        </div>
                        <div className="text-lg font-bold text-blue-700">
                          {formatScore(fluencyScore)}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all"
                          style={{ width: barWidth(fluencyScore) }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Combined Confidence */}
          {combinedConfidence && (
            <div className="bg-gradient-to-r from-black to-gray-700 rounded-xl p-6 text-white mb-6">
              <h3 className="text-xl font-semibold mb-2">
                🎯 Combined Confidence Score
              </h3>
              <div className="text-4xl font-bold mb-2">
                {formatScore(combinedConfidence)}%
              </div>
              <div className="text-sm opacity-90">
                Weighted average of Face & Voice AI analysis
              </div>
            </div>
          )}

          {/* Raw JSON */}
          <details className="text-sm text-gray-600">
            <summary className="cursor-pointer">Show raw analysis (JSON)</summary>
            <pre className="whitespace-pre-wrap mt-3 bg-gray-50 p-4 rounded text-xs">
              {JSON.stringify(analysis, null, 2)}
            </pre>
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
