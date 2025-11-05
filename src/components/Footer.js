// src/Footer.js
import React from "react";
import { motion } from "framer-motion";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-12 px-6 relative overflow-hidden">
      
      {/* Decorative floating gradient circle */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-600 rounded-full opacity-20 blur-3xl animate-pulse-slow -z-10"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">

        {/* Logo & Name */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
          <motion.div
            className="text-3xl font-extrabold text-white"
            style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
          >
            AI Interview Coach
          </motion.div>
          <p className="text-gray-400 mt-2 md:mt-0">
            Your AI-powered interview companion
          </p>
        </div>

        {/* Contact Info */}
        <div className="text-gray-400 flex flex-col gap-2">
          <p>Email: support@aiinterviewcoach.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>© 2025 AI Interview Coach. All rights reserved.</p>
        </div>

        {/* Social Links */}
        <div className="flex gap-6 text-white text-2xl">
          {[
            { icon: FaTwitter, link: "https://twitter.com/" },
            { icon: FaLinkedin, link: "https://linkedin.com/" },
            { icon: FaGithub, link: "https://github.com/" }
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <a
                key={idx}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-500 transition-transform transform hover:scale-125 duration-300"
              >
                <Icon />
              </a>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        Designed & Built with ❤️ by Your Team
      </div>
    </footer>
  );
};

export default Footer;

