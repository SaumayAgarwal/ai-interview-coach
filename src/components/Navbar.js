// src/components/Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("guestUser");
    navigate("/"); // back to landing page
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 w-full bg-black shadow-lg z-50"
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-white select-none cursor-pointer tracking-widest"
          onClick={() => navigate("/home")}
          whileHover={{ scale: 1.05 }}
        >
          AI Interview Coach
        </motion.h1>

        {/* Navbar Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/home")}
            className="text-white font-semibold hover:text-indigo-400 transition-colors duration-300"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/history")}
            className="text-white font-semibold hover:text-indigo-400 transition-colors duration-300"
          >
            Past Result
          </button>

          <button
            onClick={handleLogout}
            className="bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-300 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
