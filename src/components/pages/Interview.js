// src/components/pages/Interview.js
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../PageWrapper";

const Interview = () => {
  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const chunksRef = useRef([]);
  const navigate = useNavigate();

  // Handle video upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Start webcam recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const file = new File([blob], "recorded_video.webm", { type: "video/webm" });
        setVideo(file);
        setPreviewUrl(URL.createObjectURL(blob));
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      alert("Camera access denied or not available.");
      console.error(err);
    }
  };

  // Stop webcam recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    const tracks = videoRef.current.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    setRecording(false);
  };

  // Upload to backend (Spring expects field name 'file')
  const handleUpload = async () => {
    if (!video) return alert("Please upload or record a video first!");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", video);

    try {
      const response = await fetch("http://localhost:8080/api/video/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoading(false);
      // Navigate with full analysis payload for Feedback page, or adapt as needed
      navigate("/feedback", { state: { feedback: data } });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Something went wrong. Please check backend connection.");
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-100 px-6 py-12 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center"
        >
          <h1 className="text-3xl font-bold text-black mb-6">AI Interview Practice</h1>
          <p className="text-gray-700 mb-8">
            Upload your interview video or record one using your webcam for instant AI feedback.
          </p>

          {/* Upload Option */}
          <div className="mb-6">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-gray-700 mb-4"
            />
          </div>

          {/* Record Option */}
          <div className="flex flex-col items-center mb-8">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-64 rounded-xl border border-gray-300 mb-4 bg-black"
            ></video>

            {!recording ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startRecording}
                className="bg-black text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300"
              >
                🎥 Start Recording
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopRecording}
                className="bg-red-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300"
              >
                ⏹ Stop Recording
              </motion.button>
            )}
          </div>

          {/* Preview of Uploaded/Recorded Video */}
          {previewUrl && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-black mb-3">Preview:</h2>
              <video
                src={previewUrl}
                controls
                className="w-full h-64 rounded-xl border border-gray-300"
              ></video>
            </div>
          )}

          {/* Upload Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            onClick={handleUpload}
            className="bg-black text-white font-semibold px-10 py-4 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Upload & Get AI Feedback"}
          </motion.button>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Interview;