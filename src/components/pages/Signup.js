// src/components/pages/Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../PageWrapper";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add your backend registration logic here
    console.log("Registering user:", form);
    navigate("/login"); // redirect to login after successful registration
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 px-6">
        <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md">
          {/* Heading */}
          <h1 className="text-4xl font-extrabold mb-6 text-black text-center" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
            Register
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Create your account and start your AI interview journey.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none transition"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none transition"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none transition"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 shadow-lg mt-4"
            >
              Register
            </button>
          </form>

          {/* Link to Login */}
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <span
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Signup;
