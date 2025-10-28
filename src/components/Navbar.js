import React from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full bg-[#0A1D37] backdrop-blur-md shadow-lg border-b border-[#133B5C]/40 z-50"
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-start">
        {/* 🌟 Elegant Text Logo */}
        <motion.h1
          className="text-2xl md:text-3xl font-serif tracking-widest text-white select-none"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#A5D7E8] font-bold">AI</span>{" "}
          <span className="text-white font-light">Interview Coach</span>
        </motion.h1>
      </div>
    </motion.nav>
  );
};

export default Navbar;









