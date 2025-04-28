import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    // if no token found, redirect to login page
    return <Navigate to="/" replace />;
  }

  // if token exists, allow access to the protected page
  return children;
}

export default ProtectedRoute;
