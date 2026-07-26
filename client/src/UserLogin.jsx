import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "./Alert";
import { GoogleLogin } from "@react-oauth/google";
import { API_URL } from "./services/api";
import { Helmet } from "react-helmet-async";

export default function UserLogin() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const [btnWidth, setBtnWidth] = useState(320);

  const navigate    = useNavigate();
  const { addToast } = useToast();

  /* ── Google button width ─────────────────────────────── */
  useEffect(() => {
    const handleResize = () => {
      const pad = window.innerWidth < 640 ? 64 : 96;
      setBtnWidth(Math.max(200, Math.min(400, window.innerWidth - pad)));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ── Email / password login ──────────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/users/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userToken",  data.token);
        localStorage.setItem("userEmail",  data.user.email);
        localStorage.setItem("userName",   data.user.name);
        if (data.user.avatar) localStorage.setItem("userAvatar", data.user.avatar);
        addToast("Welcome back! " + data.user.name, "success");
        document.dispatchEvent(new Event("profileUpdated"));
        const redirect = new URLSearchParams(window.location.search).get("redirect");
        navigate(redirect ? `/${redirect}` : "/");
      } else {
        addToast(data.message || "Invalid credentials", "error");
      }
    } catch {
      addToast("Server error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── Google OAuth success ────────────────────────────── */
  const handleGoogle = async (credentialResponse) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/users/google`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userToken",  data.token);
        localStorage.setItem("userEmail",  data.user.email);
        localStorage.setItem("userName",   data.user.name);
        if (data.user.avatar) localStorage.setItem("userAvatar", data.user.avatar);
        addToast("Welcome back! " + data.user.name, "success");
        document.dispatchEvent(new Event("profileUpdated"));
        const redirect = new URLSearchParams(window.location.search).get("redirect");
        navigate(redirect ? `/${redirect}` : "/");
      } else {
        addToast(data.message || "Google Login Failed", "error");
      }
    } catch {
      addToast("Server connection failed", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-5 relative overflow-hidden">
      <Helmet>
        <title>Login | Kala Agalya Herbals</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Ambient orbs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-yellow-500/6 blur-[120px] rounded-full pointer-events-none animate-blob" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-600/5 blur-[120px] rounded-full pointer-events-none animate-blob animation-delay-2000" />

      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-yellow-500/12 overflow-hidden"
        style={{ animation: "fadeInUp 0.5s ease-out both" }}
      >
        {/* Top accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

        <div className="p-7 sm:p-9">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex flex-col items-center gap-3 group" aria-label="Back to home">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-900 to-[#0d0b03] flex items-center justify-center shadow-xl border border-yellow-500/30 group-hover:scale-105 transition-transform duration-400 p-3.5">
                  <img src="/images/icons/logo.webp" alt="Kala Agalya Herbals" className="w-full h-auto" loading="eager" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-800 font-soria tracking-wide">
                  Welcome Back
                </h1>
                <p className="text-xs text-[#9A9690] mt-1 font-inter tracking-widest uppercase">Kala Agalya Herbals</p>
              </div>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            {/* Email */}
            <div className="group">
              <label htmlFor="login-email" className="block text-xs font-semibold text-[#6C685F] uppercase tracking-wider mb-1.5 group-focus-within:text-yellow-700 transition-colors font-grotesk">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-premium"
                placeholder="yourname@gmail.com"
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="group">
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-[#6C685F] uppercase tracking-wider group-focus-within:text-yellow-700 transition-colors font-grotesk">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-amber-700 hover:text-yellow-600 font-semibold transition-colors font-inter">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-premium pr-11"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9A9690] hover:text-yellow-600 transition-colors"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="ripple-container w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 shadow-gold hover:shadow-gold-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-grotesk tracking-wide relative overflow-hidden mt-2"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing In…
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-yellow-500/15" />
            <span className="text-[10px] text-[#9A9690] font-bold uppercase tracking-widest font-grotesk">or continue with</span>
            <div className="flex-1 h-px bg-yellow-500/15" />
          </div>

          {/* Google */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => addToast("Google Login Failed", "error")}
              theme="filled_black"
              shape="pill"
              size="large"
              width={btnWidth}
              text="continue_with"
            />
          </div>

          {/* Footer links */}
          <div className="mt-7 pt-6 border-t border-yellow-500/10 text-center">
            <p className="text-sm text-[#6C685F] font-inter">
              New here?{" "}
              <Link to={`/register${window.location.search}`} className="text-yellow-700 font-semibold hover:text-yellow-600 underline underline-offset-2 transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
