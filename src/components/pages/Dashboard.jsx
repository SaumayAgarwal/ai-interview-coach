import React from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full"
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Welcome, {user.email || "Guest"} 👋
        </h1>
        <p className="text-gray-600">
          This is your dashboard. You’re now logged in successfully!
        </p>
        <div className="mt-6">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-all"
          >
            Log Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
