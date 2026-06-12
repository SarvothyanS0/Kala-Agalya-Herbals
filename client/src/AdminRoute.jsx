import { Navigate } from "react-router-dom";

/**
 * AdminRoute – protects all /admin/* pages.
 * If no adminToken is found in localStorage, the user is
 * redirected to /admin/login immediately.
 */
export default function AdminRoute({ children }) {
  const isAdminLoggedIn = !!localStorage.getItem("adminToken");

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
