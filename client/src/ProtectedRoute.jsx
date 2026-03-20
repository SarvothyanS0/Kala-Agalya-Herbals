import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    return <Navigate to="/product" />;
  }

  return children;
}
