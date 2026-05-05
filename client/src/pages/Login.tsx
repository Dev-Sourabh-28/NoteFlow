import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<LoginData>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.msg || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Keeping the font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');`}</style>

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0f1a] font-['Sora'] antialiased">
        {/* Background Decorative Orbs */}
        <div className="pointer-events-none absolute -left-[150px] -top-[150px] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.25)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -right-[100px] -bottom-[120px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.18)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute left-[60%] top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.12)_0%,transparent_70%)]" />

        {/* Glass Card */}
        <div className="relative z-10 w-full max-w-[420px] animate-[slideUp_0.5s_cubic-bezier(.22,.68,0,1.2)_both] rounded-[24px] border border-white/10 bg-white/5 p-10 md:p-12 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[24px]">
          
          {/* Logo Mark */}
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#6366f1] to-[#ec4899] text-[22px] shadow-[0_4px_20px_rgba(99,102,241,0.4)]">
            ✦
          </div>

          <h1 className="mb-1.5 text-[28px] font-bold tracking-tight">Welcome back</h1>
          <p className="mb-8 text-sm text-white/45">Sign in to your account to continue</p>

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.6px] text-white/50">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-[13px] font-['Sora'] text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-indigo-500/60 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/15"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.6px] text-white/50">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/12 bg-white/5 py-[13px] pl-4 pr-11 font-['Sora'] text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-indigo-500/60 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/15"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg text-white/40 transition-colors hover:text-white/70"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] py-3.5 font-['Sora'] text-[15px] font-semibold text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(99,102,241,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Signing in...</>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="mt-6 text-center text-[13px] text-white/40">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-[#818cf8] hover:text-[#a5b4fc]">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}