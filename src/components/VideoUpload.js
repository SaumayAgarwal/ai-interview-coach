import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle2, XCircle } from "lucide-react";

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  // Handle file input
  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
    setMessage("");
  };

  // Upload video to backend
  const handleUpload = async () => {
    if (!video) {
      setMessage("Please select a video first!");
      setStatus("error");
      return;
    }

    const formData = new FormData();
    formData.append("file", video);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:8080/api/video/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Video uploaded successfully!");
      setStatus("success");
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed!");
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800/60 p-10 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-lg text-center"
      >
        <h1 className="text-3xl font-bold mb-6 text-blue-400">
          Upload Your Interview Video
        </h1>

        {/* File Input */}
        <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 mb-6 hover:border-blue-400 transition">
          <label
            htmlFor="video-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <UploadCloud size={40} className="text-blue-400 mb-3" />
            <span className="text-gray-300 mb-2">
              {video ? video.name : "Click to select or drag a video here"}
            </span>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Upload Button */}
        <motion.button
          onClick={handleUpload}
          disabled={uploading}
          whileTap={{ scale: 0.95 }}
          className={`px-8 py-3 rounded-lg font-semibold text-lg transition ${
            uploading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </motion.button>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 flex items-center justify-center gap-2 text-lg ${
              status === "success"
                ? "text-green-400"
                : status === "error"
                ? "text-red-400"
                : "text-gray-300"
            }`}
          >
            {status === "success" && <CheckCircle2 size={22} />}
            {status === "error" && <XCircle size={22} />}
            <span>{message}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VideoUpload;
