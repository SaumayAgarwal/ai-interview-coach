import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (form.name && form.email && form.password) {
        navigate("/login");
      } else {
        setError("Please fill all fields!");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-10 w-[90%] sm:w-[400px] text-white"
      >
        <h1 className="text-3xl font-bold text-center mb-8">Create Account ✨</h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <div className="flex items-center bg-white/10 rounded-xl px-4 py-2 border border-white/20 focus-within:ring-2 focus-within:ring-blue-400">
            <User className="text-blue-300 mr-3" />
            <input
              type="text"
              placeholder="Full Name"
              className="bg-transparent outline-none w-full text-white placeholder-gray-300"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center bg-white/10 rounded-xl px-4 py-2 border border-white/20 focus-within:ring-2 focus-within:ring-blue-400">
            <Mail className="text-blue-300 mr-3" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent outline-none w-full text-white placeholder-gray-300"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center bg-white/10 rounded-xl px-4 py-2 border border-white/20 focus-within:ring-2 focus-within:ring-blue-400">
            <Lock className="text-blue-300 mr-3" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none w-full text-white placeholder-gray-300"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="mt-3 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-xl py-2 w-full"
          >
            {loading ? "Creating..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-300 hover:text-blue-200 cursor-pointer font-medium"
          >
            Log in
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
