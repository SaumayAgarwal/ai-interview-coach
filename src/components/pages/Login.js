// src/components/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../PageWrapper";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your normal login logic here (API call)
    localStorage.setItem("isLoggedIn", "true"); // simple auth simulation
    navigate("/home");
  };

  const handleGuestLogin = () => {
    // Log in as guest
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("guestUser", "true"); // optional, to know it's a guest
    navigate("/home");
  };

  return (
    <PageWrapper>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">Login</h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-full transition-all duration-300"
            >
              Login
            </button>
          </form>

          {/* Login as Guest */}
          <button
            onClick={handleGuestLogin}
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-black font-semibold py-3 rounded-full w-full transition-all duration-300"
          >
            Login as Guest
          </button>

          <p className="mt-4 text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-indigo-600 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;
