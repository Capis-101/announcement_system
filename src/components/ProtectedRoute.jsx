import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext); // Assuming AuthContext provides 'loading' state

  // Show loading while auth/role is being checked
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // Role mismatch - redirect to landing page or login
    return <Navigate to="/" />; // Or "/login" if you prefer
  }

  return children;
}