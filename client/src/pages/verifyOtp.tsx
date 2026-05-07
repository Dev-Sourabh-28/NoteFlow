import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, ChevronRight } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleVerify = async () => {
        if (!otp) return toast.error("Please enter the OTP");
        try {
            setLoading(true);
            await API.post("/auth/verify-otp", { email, otp });
            toast.success("OTP verified");
            navigate("/reset-password", { state: { email } });
        } catch (error: any) {
            toast.error(error.response?.data?.msg || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef0f5] font-['Sora'] antialiased p-4">
            <div className="relative z-10 flex h-[700px] w-full max-w-[1000px] overflow-hidden rounded-[40px] bg-white shadow-2xl">
                
                {/* Left Panel */}
                <div className="flex w-full flex-col p-12 lg:w-1/2 justify-center">
                    <Link to="/" className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>

                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <ShieldCheck size={28} />
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-900">Verify OTP</h1>
                    <p className="mt-2 text-slate-500">We've sent a code to <span className="text-indigo-600 font-medium">{email}</span></p>

                    <div className="mt-10">
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="0 0 0 0 0 0"
                            className="w-full rounded-2xl bg-slate-100 py-5 text-center text-2xl font-bold tracking-[10px] outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>

                    <button 
                        onClick={handleVerify}
                        disabled={loading}
                        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-indigo-600 disabled:opacity-70"
                    >
                        {loading ? "Verifying..." : "Verify OTP"} <ChevronRight size={18} />
                    </button>
                </div>

                {/* Right Panel: Visual */}
                <div className="relative hidden w-1/2 lg:block">
                    <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop" className="h-full w-full object-cover" alt="Verification" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 to-purple-900/60 backdrop-blur-[1px]" />
                    <div className="absolute bottom-12 left-12 right-12 rounded-[32px] bg-white/10 p-8 text-white backdrop-blur-xl border border-white/20">
                        <h3 className="text-2xl font-bold">Safe & Secure.</h3>
                        <p className="mt-2 opacity-80 text-sm">Two-step verification ensures your notes stay yours alone.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}