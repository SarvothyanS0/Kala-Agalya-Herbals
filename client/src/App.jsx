import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./Landing";
import Product from "./Product";
import Navbar from "./Navbar";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Payment from "./Payment";
import Success from "./Success";
import ProtectedRoute from "./ProtectedRoute";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminOrders from "./AdminOrders";
import AdminOrderDetail from "./AdminOrderDetail";
import AdminProducts from "./AdminProducts";
import UserLogin from "./UserLogin";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import UserProfile from "./UserProfile";
import MyOrders from "./MyOrders";
import ResetPassword from "./ResetPassword";
import AuthRoute from "./AuthRoute";
import AdminRoute from "./AdminRoute";
import AdminReports from "./AdminReports";
import AdminUsers from "./AdminUsers";
import AdminReviews from "./AdminReviews";
import { ToastProvider } from "./Alert";
import Footer from "./Footer.jsx";
import Contact from "./Contact";
import PrivacyPolicy from "./PrivacyPolicy";
import RefundPolicy from "./RefundPolicy";
import ShippingPolicy from "./ShippingPolicy";
import TermsOfService from "./TermsOfService";
import { HelmetProvider } from "react-helmet-async";
import { ReactLenis } from "@studio-freight/react-lenis";
import useScrollAnimation from "./useScrollAnimation";


function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthenticated = !!localStorage.getItem("userToken");
  const isAuthRoute = ["/login", "/register", "/forgot-password"].includes(location.pathname) || location.pathname.startsWith("/reset-password");

  // Global scroll animations
  useScrollAnimation();

  return (
    <>
      {(!isAdminRoute && !isAuthRoute) && <Navbar />}
      <main>
        <Routes>
          {/* Public Pages */}
          <Route 
            path="/" 
            element={<Landing />} 
          />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* User Protected Pages */}
          <Route
            path="/profile"
            element={
              <AuthRoute>
                <UserProfile />
              </AuthRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <AuthRoute>
                <MyOrders />
              </AuthRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <AuthRoute>
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              </AuthRoute>
            }
          />

          <Route path="/success" element={<Success />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
        </Routes>
      </main>
      {(!isAdminRoute && !isAuthRoute) && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothTouch: true }}>
        <ToastProvider>
          <Router>
            <Layout />
          </Router>
        </ToastProvider>
      </ReactLenis>
    </HelmetProvider>
  );
}
