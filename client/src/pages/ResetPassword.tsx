import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, CheckCircle, ChevronRight } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleReset = async () => {
        if (password !== confirmPassword) return toast.error("Passwords do not match");
        if (password.length < 6) return toast.error("Password too short");

        try {
            setLoading(true);
            await API.post("/auth/reset-password", { email, password });
            toast.success("Password updated");
            navigate("/");
        } catch (error: any) {
            toast.error(error.response?.data?.msg || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef0f5] font-['Sora'] antialiased p-4">
            <div className="relative z-10 flex h-[700px] w-full max-w-[1000px] overflow-hidden rounded-[40px] bg-white shadow-2xl">
                
                {/* Left Panel */}
                <div className="flex w-full flex-col p-12 lg:w-1/2 justify-center">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                        <Lock size={28} />
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-900">New Password</h1>
                    <p className="mt-2 text-slate-500">Almost there! Set a new password for your account.</p>

                    <div className="mt-10 space-y-4">
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full rounded-2xl bg-slate-100 py-4 px-5 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="w-full rounded-2xl bg-slate-100 py-4 px-5 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleReset}
                        disabled={loading}
                        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-bold text-white transition-all hover:bg-indigo-700 shadow-xl shadow-indigo-100"
                    >
                        {loading ? "Updating..." : "Update Password"} <CheckCircle size={18} />
                    </button>
                </div>

                {/* Right Panel: Visual */}
                <div className="relative hidden w-1/2 lg:block">
                    <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1470&auto=format&fit=crop" className="h-full w-full object-cover" alt="Protection" />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-indigo-900/40 backdrop-blur-[1px]" />
                    <div className="absolute bottom-12 left-12 right-12 rounded-[32px] bg-white/10 p-8 text-white backdrop-blur-xl border border-white/20">
                        <h3 className="text-2xl font-bold">Stronger than ever.</h3>
                        <p className="mt-2 opacity-80 text-sm">Once you reset, we'll keep your account protected with the latest encryption.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}