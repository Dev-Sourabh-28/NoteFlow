import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ChevronRight, ArrowLeft } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) return toast.error("Please enter your email");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Please enter a valid email");
    
    try {
      setLoading(true);
      await API.post("auth/forgot-password", { email });
      toast.success("OTP sent to your email");
      navigate("/verify-otp", { state: { email } });
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || "Something went wrong";
      toast.error(errorMsg);
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef0f5] font-['Sora'] antialiased p-4">
      <div className="relative z-10 flex h-[700px] w-full max-w-[1000px] overflow-hidden rounded-[40px] bg-white shadow-2xl">
        
        {/* Left Panel */}
        <div className="flex w-full flex-col p-12 lg:w-1/2 justify-center">
          <Link to="/" className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back to Login
          </Link>

          <h1 className="text-3xl font-extrabold text-slate-900">Forgot Password</h1>
          <p className="mt-2 text-slate-500">No worries, we'll send you reset instructions.</p>

          <div className="mt-10 space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-2xl bg-slate-100 py-4 pl-12 pr-4 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-indigo-600 disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send OTP"} <ChevronRight size={18} />
          </button>
        </div>

        {/* Right Panel (Visual) */}
        <div className="relative hidden w-1/2 lg:block">
          <img src="https://images.unsplash.com/photo-1616628188502-413f2fe46e5e?q=80&w=1974&auto=format&fit=crop" className="h-full w-full object-cover" alt="Security" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 to-purple-900/60 backdrop-blur-[1px]" />
          <div className="absolute bottom-12 left-12 right-12 rounded-[32px] bg-white/10 p-8 text-white backdrop-blur-xl border border-white/20">
            <h3 className="text-2xl font-bold">Secure your flow.</h3>
            <p className="mt-2 opacity-80 text-sm">Your privacy and security are our top priorities.</p>
          </div>
        </div>
      </div>
    </div>
  );
}