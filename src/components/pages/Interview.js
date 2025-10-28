import React, { useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Video, Upload, StopCircle, Play, CheckCircle } from "lucide-react";

const Interview = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  // 📸 Start live recording
  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play();

      const recorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        setRecordedVideo(blob);
        recordedChunks.current = [];
      };

      recorder.start();
      setRecording(true);
      setMessage("Recording started...");
    } catch (err) {
      console.error("Error accessing camera:", err);
      setMessage("❌ Unable to access camera/mic!");
    }
  };

  // 🛑 Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
    setRecording(false);
    setMessage("Recording stopped. Preview your video below.");
  };

  // 📤 Upload video
  const handleUpload = async (file) => {
    if (!file) {
      setMessage("Please record or select a video first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await axios.post("http://localhost:8080/api/video/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Video uploaded successfully!");
    } catch (err) {
      setMessage("❌ Upload failed!");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // 📁 File selection
  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
    setRecordedVideo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex flex-col items-center justify-center p-6 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-6"
      >
        🎥 Record or Upload Your Interview Video
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-10 bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-white/20 max-w-4xl w-full items-center justify-center">
        
        {/* 🎤 Live Recording */}
        <div className="flex flex-col items-center gap-4">
          <video ref={videoRef} className="w-64 h-40 rounded-lg border border-blue-300" autoPlay muted />
          {recordedVideo && (
            <video
              controls
              className="w-64 h-40 rounded-lg border border-green-400"
              src={URL.createObjectURL(recordedVideo)}
            />
          )}

          {!recording ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={startRecording}
              className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition"
            >
              <Video size={18} /> Start Recording
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={stopRecording}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition"
            >
              <StopCircle size={18} /> Stop Recording
            </motion.button>
          )}
        </div>

        {/* 📁 File Upload */}
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleUpload(videoFile || recordedVideo)}
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
          >
            <Upload size={18} /> {uploading ? "Uploading..." : "Upload Video"}
          </motion.button>
        </div>
      </div>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-lg text-blue-100"
        >
          {message}
        </motion.p>
      )}

      {message.includes("✅") && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 mt-4 bg-green-500 text-white px-4 py-2 rounded-full"
        >
          <CheckCircle size={18} /> Video Ready for Analysis
        </motion.div>
      )}
    </div>
  );
};

export default Interview;
