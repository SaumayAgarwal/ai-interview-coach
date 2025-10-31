import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, Smile, TrendingUp, AlertCircle } from "lucide-react";

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      // Don't set Content-Type header - let axios set it automatically with boundary
      const response = await axios.post("http://localhost:8080/api/video/upload", formData, {
        headers: {
          // Axios will automatically set Content-Type with boundary for FormData
        },
        // Add timeout for large files (5 minutes)
        timeout: 300000,
      });
      setAnalysis(response.data);
      setMessage("✅ Analysis complete");
    } catch (error) {
      console.error("Error uploading video:", error);
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Upload failed";
      setMessage("Upload failed: " + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex flex-col items-center justify-center p-6 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-6"
      >
        🎥 Upload Interview Video
      </motion.h1>

      <div className="bg-white/10 rounded-2xl p-8 shadow-lg backdrop-blur-md border border-white/20 max-w-2xl w-full">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 mb-4"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleUpload}
          disabled={uploading || !file}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading & Analyzing..." : "Upload & Analyze Video"}
        </motion.button>

        {message && (
          <p className={mt-4 text-center ${message.includes("✅") ? "text-green-300" : "text-red-300"}}>
            {message}
          </p>
        )}
      </div>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 w-full max-w-5xl bg-white/10 rounded-2xl p-8 border border-white/20 backdrop-blur-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">📊 Analysis Results</h2>

          {/* Overall Confidence Score */}
          <div className="mb-8 text-center">
            <div className="inline-block bg-gradient-to-r from-green-400 to-blue-500 rounded-full px-8 py-4">
              <div className="text-5xl font-bold">{analysis.final_confidence || analysis.ai_confidence_score || 0}</div>
              <div className="text-lg mt-2">Overall Confidence Score</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Eye Contact */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="text-blue-400" size={24} />
                <h3 className="text-xl font-semibold">Eye Contact</h3>
              </div>
              <div className="text-3xl font-bold mb-2">{analysis.eye_contact_score || 0}%</div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: ${analysis.eye_contact_score || 0}% }}
                ></div>
              </div>
            </div>

            {/* Smile Engagement */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Smile className="text-yellow-400" size={24} />
                <h3 className="text-xl font-semibold">Smile Engagement</h3>
              </div>
              <div className="text-3xl font-bold mb-2">{analysis.smile_engagement_score || 0}%</div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full transition-all"
                  style={{ width: ${analysis.smile_engagement_score || 0}% }}
                ></div>
              </div>
            </div>

            {/* Dominant Emotion */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-purple-400" size={24} />
                <h3 className="text-xl font-semibold">Emotion</h3>
              </div>
              <div className="text-3xl font-bold capitalize">
                {analysis.dominant_emotion || "Neutral"}
              </div>
              {analysis.smile_feedback && (
                <div className="text-sm text-blue-200 mt-2">{analysis.smile_feedback}</div>
              )}
            </div>
          </div>

          {/* Emotion Timeline Image */}
          {analysis.emotion_timeline_image && (
            <div className="mb-8 bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Emotion Timeline</h3>
              <img
                src={data:image/png;base64,${analysis.emotion_timeline_image}}
                alt="Emotion Timeline"
                className="w-full rounded-lg border border-white/20"
              />
            </div>
          )}

          {/* AI Feedback */}
          {analysis.ai_overall_feedback && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-green-400" size={24} />
                <h3 className="text-xl font-semibold">AI Feedback</h3>
              </div>
              <div className="text-blue-100 leading-relaxed">
                {typeof analysis.ai_overall_feedback === 'string' ? (
                  <p>{analysis.ai_overall_feedback}</p>
                ) : analysis.ai_overall_feedback.summary ? (
                  <p>{analysis.ai_overall_feedback.summary}</p>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(analysis.ai_overall_feedback, null, 2)}</pre>
                )}
              </div>
            </div>
          )}

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-sm text-blue-200">AI Confidence</div>
              <div className="text-2xl font-bold">{analysis.ai_confidence_score || 0}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-sm text-blue-200">Rule-Based Confidence</div>
              <div className="text-2xl font-bold">{analysis.rule_based_confidence || 0}</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VideoUpload;