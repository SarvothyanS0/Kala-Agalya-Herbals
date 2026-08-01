import { Navigate } from "react-router-dom";

export default function AuthRoute({ children }) {
  const token = localStorage.getItem("userToken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
