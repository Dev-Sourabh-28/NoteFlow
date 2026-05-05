import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<FormData>({ name: "", email: "", password: "" });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await API.post("/auth/register", form);
      alert("Registered Successfully");
      navigate("/");
    } catch (error: any) {
      alert(error.response?.data?.msg || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Ensure the font is imported */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');`}</style>

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0f1a] font-['Sora'] antialiased">
        {/* Background Decorative Orbs */}
        <div className="pointer-events-none absolute -right-[150px] -top-[150px] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.22)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -left-[100px] -bottom-[120px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.18)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute left-[10%] top-[40%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.1)_0%,transparent_70%)]" />

        {/* Glass Card */}
        <div className="relative z-10 w-full max-w-[420px] animate-[slideUp_0.5s_cubic-bezier(.22,.68,0,1.2)_both] rounded-[24px] border border-white/10 bg-white/5 p-10 md:p-12 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[24px]">
          
          {/* Logo Mark */}
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#ec4899] to-[#6366f1] text-[22px] shadow-[0_4px_20px_rgba(236,72,153,0.4)]">
            ✦
          </div>

          <h1 className="mb-1.5 text-[28px] font-bold tracking-tight">Create account</h1>
          <p className="mb-8 text-sm text-white/45">Join us — it only takes a minute</p>

          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.6px] text-white/50">Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-[13px] font-['Sora'] text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#ec4899]/60 focus:bg-white/10 focus:ring-4 focus:ring-[#ec4899]/15"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.6px] text-white/50">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-[13px] font-['Sora'] text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#ec4899]/60 focus:bg-white/10 focus:ring-4 focus:ring-[#ec4899]/15"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.6px] text-white/50">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/12 bg-white/5 py-[13px] pl-4 pr-11 font-['Sora'] text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#ec4899]/60 focus:bg-white/10 focus:ring-4 focus:ring-[#ec4899]/15"
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

              {/* Strength Bar */}
              {form.password && (
                <div className="mt-3 flex gap-1">
                  {[1, 2, 3, 4].map((i) => {
                    const isActive = form.password.length >= i * 3;
                    const colors = ["#f87171", "#fb923c", "#facc15", "#4ade80"];
                    return (
                      <div
                        key={i}
                        className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                        style={{ background: isActive ? colors[i - 1] : "rgba(255,255,255,0.1)" }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#ec4899] to-[#8b5cf6] py-3.5 font-['Sora'] text-[15px] font-semibold text-white shadow-[0_4px_20px_rgba(236,72,153,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(236,72,153,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="mt-6 text-center text-[13px] text-white/40">
            Already have an account?{" "}
            <Link to="/" className="font-medium text-[#f472b6] hover:text-[#fb7185]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}