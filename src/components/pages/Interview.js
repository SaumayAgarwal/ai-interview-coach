// src/components/pages/Interview.js
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../PageWrapper";

const Interview = () => {
  const videoRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);

  // Toggle recording (placeholder for actual MediaRecorder logic)
  const handleRecord = () => {
    if (!recording) {
      setRecording(true);
      // TODO: start webcam recording
    } else {
      setRecording(false);
      // TODO: stop recording and save video
      setVideoURL("https://via.placeholder.com/400x300?text=Recorded+Video");
    }
  };

  // Handle video upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoURL(URL.createObjectURL(file));
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 gap-10">

        {/* Video Preview */}
        <motion.video
          ref={videoRef}
          src={videoURL || ""}
          autoPlay
          controls
          className="w-full md:w-2/3 h-64 md:h-80 rounded-xl shadow-lg object-cover bg-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Your browser does not support the video tag.
        </motion.video>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          
          {/* Record Button */}
          <button
            onClick={handleRecord}
            className={`w-64 py-4 rounded-full font-semibold text-white transition-all duration-300 ${
              recording ? "bg-red-600 hover:bg-red-700" : "bg-black hover:bg-gray-900"
            } shadow-lg`}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </button>

          {/* Upload Button */}
          <label className="w-64 py-4 rounded-full bg-black text-white font-semibold text-center cursor-pointer shadow-lg hover:bg-gray-900 transition-all duration-300">
            Upload Video
            <input type="file" accept="video/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Interview;
