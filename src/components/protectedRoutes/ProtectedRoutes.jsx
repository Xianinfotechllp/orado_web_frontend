// components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    // Not logged in? Back to login you go
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
