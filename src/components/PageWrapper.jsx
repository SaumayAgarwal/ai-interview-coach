import React from "react";
import { motion } from "framer-motion";

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
    className="pt-24"
  >
    {children}
  </motion.div>
);

export default PageWrapper;
