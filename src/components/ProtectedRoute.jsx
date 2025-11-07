// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true" ||
    localStorage.getItem("guestUser") === "true";

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;