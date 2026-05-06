import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef0f5] font-['Sora'] antialiased p-4">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');`}</style>
      
      {/* Background Decorative Orbs (Optional, kept subtle) */}
      <div className="pointer-events-none absolute -right-[150px] -top-[150px] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,transparent_70%)]" />

      {/* Main Container: Split Pane */}
      <div className="relative z-10 flex h-[750px] w-full max-w-[1000px] overflow-hidden rounded-[40px] bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
        
        {/* LEFT PANEL: Form logic */}
        <div className="flex w-full flex-col p-12 lg:w-1/2 justify-center">
          
          {/* Brand Logo */}
          <div className="mb-12 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200">✦</div>
            <span className="text-xl font-bold tracking-tight text-slate-800">NoteFlow</span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Welcome back</h1>
            <p className="mt-2 text-slate-500">Please enter your details to sign in.</p>

            <div className="mt-10 space-y-5">
              {/* Email Field */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email"
                  placeholder="Email address" 
                  className="w-full rounded-2xl bg-slate-100 py-4 pl-12 pr-4 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  onChange={(e) => setForm({...form, email: e.target.value})}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password" 
                  className="w-full rounded-2xl bg-slate-100 py-4 pl-12 pr-12 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  onChange={(e) => setForm({...form, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  Remember me
                </label>
                <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-indigo-100"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <><LogIn size={20} /> Sign In</>
              )}
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="font-bold text-indigo-600">Join NoteFlow</Link>
          </p>
        </div>

        {/* RIGHT PANEL: Visual representation */}
        <div className="relative hidden w-1/2 lg:block">
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" 
            className="h-full w-full object-cover" 
            alt="Workspace"
          />
          {/* Overlay Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 to-purple-900/60 backdrop-blur-[1px]" />
          
          <div className="absolute bottom-12 left-12 right-12 rounded-[32px] border border-white/20 bg-white/10 p-8 text-white backdrop-blur-xl shadow-2xl">
            <h3 className="text-2xl font-bold leading-tight">Focus on what matters, let us handle the flow.</h3>
            <div className="mt-6 flex items-center gap-4">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
                 ))}
               </div>
               <p className="text-sm font-medium opacity-80">Joined by 10k+ users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}