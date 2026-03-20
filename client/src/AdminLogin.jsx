import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./Alert";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminEmail", data.admin.email);
        localStorage.setItem("adminName", data.admin.name);
        addToast("Welcome back! Redirecting to dashboard...", "success");
        navigate("/admin/dashboard");
      } else {
        addToast(data.message || "Invalid credentials", "error");
      }
    } catch (err) {
      addToast("Server error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0b03] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative bg-[#15120a] border border-yellow-900/40 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md p-8 backdrop-blur-xl">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
             <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
             <div className="relative bg-gradient-to-br from-yellow-900 to-[#0d0b03] w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl border border-yellow-500/30 transform rotate-3 hover:rotate-6 transition-transform duration-500 p-4">
                <img src="/images/icons/logo.png" alt="Kala Agalya Herbals" className="w-full h-auto drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
             </div>
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 tracking-wide mb-2">
            Admin Access
          </h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Kala Agalya Herbals Secure Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="group">
              <label className="block text-xs font-semibold text-yellow-500/80 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-yellow-400 transition-colors">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#0d0b03] text-yellow-100 border border-yellow-900/50 rounded-xl focus:ring-0 focus:border-yellow-500 transition-all placeholder-gray-700 shadow-inner"
                  placeholder="admin@kalaagalya.com"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-yellow-700 group-focus-within:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-yellow-500/80 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-yellow-400 transition-colors">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#0d0b03] text-yellow-100 border border-yellow-900/50 rounded-xl focus:ring-0 focus:border-yellow-500 transition-all placeholder-gray-700 shadow-inner"
                  placeholder="••••••••"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-yellow-700 group-focus-within:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-yellow-600 to-amber-700 text-black rounded-xl font-bold tracking-wide uppercase shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  Enter Dashboard
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-yellow-900/30 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Protected • 256-bit Encryption • Secure Access
          </p>
        </div>
      </div>
    </div>
  );
}



