import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authToken = localStorage.getItem("authToken");
  return authToken ? <>{children}</> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
