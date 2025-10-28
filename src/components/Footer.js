import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-gray-200 py-10 px-6 mt-20">
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-2xl font-serif text-white mb-3">AI Interview Coach</h2>
          <p className="text-gray-300">
            Helping candidates refine their skills with AI-driven feedback and insights.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Contact</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-secondary" /> support@aiinterviewcoach.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-secondary" /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" /> Mumbai, India
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-5 mt-3">
            <a href="#" className="hover:text-secondary transition"><Github className="w-6 h-6" /></a>
            <a href="#" className="hover:text-secondary transition"><Linkedin className="w-6 h-6" /></a>
            <a href="#" className="hover:text-secondary transition"><Twitter className="w-6 h-6" /></a>
          </div>
        </div>
      </motion.div>
      <div className="text-center mt-10 text-sm text-gray-400">
        © {new Date().getFullYear()} AI Interview Coach. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;



