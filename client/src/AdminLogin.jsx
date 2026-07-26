import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./Alert";
import { API_URL } from "./services/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(null); // null | "email" | "otp" | "newpass" | "done"
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpPassword, setFpPassword] = useState("");
  const [fpConfirm, setFpConfirm] = useState("");
  const [fpLoading, setFpLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setFpLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail }),
      });
      const data = await res.json();
      if (data.success) {
        addToast("OTP sent to your email!", "success");
        setForgotMode("otp");
      } else {
        addToast(data.message || "Failed to send OTP", "error");
      }
    } catch { addToast("Server error", "error"); }
    finally { setFpLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (fpPassword !== fpConfirm) {
      addToast("Passwords do not match", "error");
      return;
    }
    if (fpPassword.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }
    setFpLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp: fpOtp, password: fpPassword }),
      });
      const data = await res.json();
      if (data.success) {
        addToast("Password reset successful!", "success");
        setForgotMode("done");
      } else {
        addToast(data.message || "Reset failed", "error");
      }
    } catch { addToast("Server error", "error"); }
    finally { setFpLoading(false); }
  };

  const resetForgotState = () => {
    setForgotMode(null);
    setFpEmail("");
    setFpOtp("");
    setFpPassword("");
    setFpConfirm("");
  };

  // Shared input style
  const inputClass = "input-premium font-inter";
  const labelClass = "block text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1.5 font-grotesk";

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative bg-white border border-yellow-500/12 rounded-3xl shadow-card w-full max-w-md p-8 sm:p-10 z-10">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
             <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center p-2 mx-auto">
                <img src="/images/icons/logo.png" alt="Kala Agalya Herbals" className="w-full h-auto drop-shadow-md" />
             </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A16] font-soria tracking-wide mb-1">
            {forgotMode ? "Reset Password" : "Admin Access"}
          </h1>
          <p className="text-[#6C685F] text-xs font-grotesk tracking-wider uppercase">
            {forgotMode === "email" && "Enter your admin email"}
            {forgotMode === "otp" && "Enter the OTP sent to your email"}
            {forgotMode === "newpass" && "Set your new password"}
            {forgotMode === "done" && "Password updated successfully"}
            {!forgotMode && "Kala Agalya Herbals Secure Portal"}
          </p>
        </div>

        {/* ── LOGIN FORM ── */}
        {!forgotMode && (
          <>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={inputClass} placeholder="admin@kalaagalya.com" required />
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className={inputClass} placeholder="••••••••" required />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-xl font-bold font-grotesk tracking-wider uppercase shadow-gold hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 disabled:opacity-50 text-xs">
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Enter Dashboard
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => setForgotMode("email")}
                className="text-xs text-[#6C685F] hover:text-[#1C1A16] font-grotesk font-bold uppercase tracking-wider transition-colors underline">
                Forgot Password?
              </button>
            </div>
          </>
        )}

        {/* ── STEP 1: ENTER EMAIL ── */}
        {forgotMode === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-5 animate-fadeIn">
            <div>
              <label className={labelClass}>Admin Email</label>
              <input type="email" value={fpEmail} onChange={(e) => setFpEmail(e.target.value)}
                className={inputClass} placeholder="admin@kalaagalya.com" required autoFocus />
            </div>

            <button type="submit" disabled={fpLoading}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-xl font-bold font-grotesk uppercase tracking-wider shadow-gold hover:from-yellow-400 hover:to-amber-500 transition-all disabled:opacity-50 text-xs">
              <span className="flex items-center justify-center gap-2">
                {fpLoading ? "Sending OTP..." : "Send OTP"}
                {!fpLoading && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
              </span>
            </button>

            <div className="text-center font-grotesk">
              <button type="button" onClick={resetForgotState} className="text-xs text-[#6C685F] hover:text-[#1C1A16] font-bold uppercase tracking-wider transition-colors">
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 2: ENTER OTP ── */}
        {forgotMode === "otp" && (
          <div className="space-y-5 animate-fadeIn font-inter">
            <div className="bg-[#FDFBF7] border border-yellow-500/15 rounded-2xl p-4 text-center">
              <p className="text-xs text-[#6C685F]">OTP sent to <strong className="text-yellow-800 font-bold">{fpEmail}</strong></p>
              <p className="text-[11px] text-[#9A9690] mt-0.5">Check inbox & spam. Expires in 5 minutes.</p>
            </div>

            <div>
              <label className={labelClass}>Enter 6-Digit OTP</label>
              <input type="text" value={fpOtp} onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full text-center text-3xl tracking-[0.4em] py-3.5 bg-[#FDFBF7] text-yellow-800 border border-yellow-500/20 rounded-2xl focus:border-yellow-600 transition-all font-mono font-bold"
                placeholder="••••••" maxLength={6} required autoFocus />
            </div>

            <button onClick={() => { if (fpOtp.length === 6) setForgotMode("newpass"); else addToast("Enter a 6-digit OTP", "error"); }}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-xl font-bold font-grotesk uppercase tracking-wider shadow-gold hover:from-yellow-400 hover:to-amber-500 transition-all text-xs">
              <span className="flex items-center justify-center gap-2">
                Verify & Continue
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
            </button>

            <div className="flex justify-between font-grotesk">
              <button onClick={() => setForgotMode("email")} className="text-xs text-[#6C685F] hover:text-[#1C1A16] font-bold uppercase tracking-wider transition-colors">← Change Email</button>
              <button onClick={handleSendOtp} className="text-xs text-yellow-800 font-bold uppercase tracking-wider hover:underline transition-colors">Resend OTP</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: NEW PASSWORD ── */}
        {forgotMode === "newpass" && (
          <form onSubmit={handleResetPassword} className="space-y-5 animate-fadeIn">
            <div>
              <label className={labelClass}>New Password</label>
              <input type="password" value={fpPassword} onChange={(e) => setFpPassword(e.target.value)}
                className={inputClass} placeholder="Min 6 characters" required minLength={6} autoFocus />
            </div>

            <div>
              <label className={labelClass}>Confirm Password</label>
              <input type="password" value={fpConfirm} onChange={(e) => setFpConfirm(e.target.value)}
                className={inputClass} placeholder="Re-enter password" required minLength={6} />
            </div>

            <button type="submit" disabled={fpLoading}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold font-grotesk uppercase tracking-wider shadow-md hover:bg-emerald-500 transition-all disabled:opacity-50 text-xs">
              <span className="flex items-center justify-center gap-2">
                {fpLoading ? "Resetting..." : "Reset Password"}
                {!fpLoading && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
              </span>
            </button>

            <div className="text-center font-grotesk">
              <button type="button" onClick={() => setForgotMode("otp")} className="text-xs text-[#6C685F] hover:text-[#1C1A16] font-bold uppercase tracking-wider transition-colors">← Back to OTP</button>
            </div>
          </form>
        )}

        {/* ── SUCCESS STATE ── */}
        {forgotMode === "done" && (
          <div className="text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 mx-auto bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center border border-emerald-200">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[#6C685F] text-sm font-inter">Your admin password has been reset. You can now login.</p>
            <button onClick={resetForgotState}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-xl font-bold font-grotesk uppercase tracking-wider transition-all shadow-gold text-xs">
              Back to Login
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
