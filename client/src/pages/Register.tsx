import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronRight, User, Mail, Lock, Check } from "lucide-react";
import API from "../services/api";

interface FormData {
    name: string;
    email: string;
    password: string;
    username: string;
    gender: string;
    avatar: string;
}

export default function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState<FormData>({
        name: "",
        username: "",
        email: "",
        password: "",
        gender: "Man", // Default selection
        avatar: ""
    });

    const updateForm = (field: keyof FormData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (step === 1) {
            if (!form.name || !form.email || !form.password) {
                return alert("Please fill in all mandatory fields")
            }
        }
        setStep(prev => prev + 1);
    }

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await API.post("/auth/register", form);
            alert("Account created successfully!");
            navigate("/");
        } catch (error: any) {
            alert(error.response?.data?.msg || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    // Curated Avatar List for better gender accuracy
    const allAvatars = [
        // MAN SEEDS
        { id: 'm1', gender: 'Man', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&top[]=shortCurly&facialHairProbability=100' },
        { id: 'm2', gender: 'Man', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&top[]=turban' },
        { id: 'm3', gender: 'Man', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=George&top[]=sides' },

        // WOMAN SEEDS
        { id: 'w1', gender: 'Woman', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha&top[]=bob' },
        { id: 'w2', gender: 'Woman', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Willow&top[]=curvy' },
        { id: 'w3', gender: 'Woman', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abby&top[]=curly' },

        // OTHER / BOT SEEDS
        { id: 'o1', gender: 'Other', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dusty' },
        { id: 'o2', gender: 'Other', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Buck' },
        { id: 'o3', gender: 'Other', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gizmo' },
        { id: 'o4', gender: 'Other', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Zelda' },
    ];

    // Filter avatars based on selected gender
    const filteredAvatars = allAvatars.filter(av => av.gender === form.gender);

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0f1a] font-['Sora'] antialiased p-4">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');`}</style>

            {/* Decorative Orbs */}
            <div className="pointer-events-none absolute -right-[150px] -top-[150px] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)]" />
            <div className="pointer-events-none absolute -left-[100px] -bottom-[120px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)]" />

            <div className="relative z-10 flex h-[850px] w-full max-w-[1100px] overflow-hidden rounded-[40px] bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">

                {/* LEFT PANEL */}
                <div className="flex w-full flex-col p-12 lg:w-1/2 overflow-y-auto">

                    <div className="mb-8 flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">✦</div>
                        <span className="text-xl font-bold tracking-tight text-slate-800">NoteFlow</span>
                    </div>

                    <div className="flex-1">
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h1 className="text-3xl font-extrabold text-slate-900">Create Account</h1>
                                <p className="mt-2 text-slate-500">Step 1 — Let's start with the basics</p>

                                <div className="mt-8 space-y-4">
                                    {/* Name & Username Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                placeholder="Full Name"
                                                className="w-full rounded-2xl bg-slate-100 py-3.5 pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                onChange={(e) => updateForm('name', e.target.value)}
                                            />
                                        </div>
                                        <input
                                            placeholder="Username"
                                            className="w-full rounded-2xl bg-slate-100 px-5 py-3.5 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            onChange={(e) => updateForm('username', e.target.value)}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            className="w-full rounded-2xl bg-slate-100 py-3.5 pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            onChange={(e) => updateForm('email', e.target.value)}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="w-full rounded-2xl bg-slate-100 py-3.5 pl-12 pr-12 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            onChange={(e) => updateForm('password', e.target.value)}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {/* GENDER PICKER */}
                                    <div className="pt-2">
                                        <label className="text-[13px] font-bold uppercase tracking-wider text-slate-400">Identity</label>
                                        <div className="mt-3 flex gap-3">
                                            {['Man', 'Woman', 'Other'].map((g) => (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    onClick={() => {
                                                        // We update gender AND reset avatar so they have to pick from the new filtered list
                                                        setForm({ ...form, gender: g, avatar: "" });
                                                    }}
                                                    className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${form.gender === g
                                                            ? 'bg-slate-900 text-white shadow-lg'
                                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* FILTERED AVATAR PICKER */}
                                    <div className="pt-2">
                                        <label className="text-[13px] font-bold uppercase tracking-wider text-slate-400">Choose your Avatar</label>
                                        <div className="mt-3 flex flex-wrap gap-4">
                                            {filteredAvatars.map((av) => (
                                                <button
                                                    key={av.id}
                                                    type="button"
                                                    onClick={() => updateForm('avatar', av.url)}
                                                    className={`relative h-14 w-14 rounded-full border-2 transition-all p-0.5 ${form.avatar === av.url ? 'border-indigo-600 scale-110 shadow-md' : 'border-transparent bg-slate-100'
                                                        }`}
                                                >
                                                    <img src={av.url} alt="avatar" className="h-full w-full rounded-full" />
                                                    {form.avatar === av.url && (
                                                        <div className="absolute -right-1 -top-1 rounded-full bg-indigo-600 p-0.5 text-white">
                                                            <Check size={10} strokeWidth={4} />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={nextStep}
                                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-indigo-600 shadow-xl shadow-indigo-100"
                                >
                                    Next Step <ChevronRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* Step 2 & 3 content remains the same as your provided code */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h1 className="text-3xl font-extrabold text-slate-900">Tell us more</h1>
                                <p className="mt-2 text-slate-500">Step 2 of 3 — How will you use NoteFlow?</p>
                                <div className="mt-10 grid grid-cols-1 gap-4">
                                    {['Personal Use', 'Work/Business', 'Education'].map((option) => (
                                        <button
                                            key={option}
                                            className="w-full p-6 text-left rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all font-bold"
                                            onClick={nextStep}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={prevStep} className="mt-6 text-slate-400 font-medium">Go Back</button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
                                <h1 className="text-3xl font-extrabold text-slate-900">All set!</h1>
                                <p className="mt-2 text-slate-500">Ready to create your first note?</p>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="mt-10 w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200"
                                >
                                    {loading ? "Creating Account..." : "Finish & Start Flowing"}
                                </button>
                                <button onClick={prevStep} className="mt-4 block w-full text-slate-400">Wait, I missed something</button>
                            </div>
                        )}
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already have an account? <Link to="/" className="font-bold text-indigo-600">Sign in</Link>
                    </p>
                </div>

                {/* RIGHT PANEL */}
                <div className="relative hidden w-1/2 lg:block">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" className="h-full w-full object-cover" alt="Workspace" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-900/40 backdrop-blur-[2px]" />
                    <div className="absolute bottom-12 left-12 right-12 rounded-[32px] border border-white/20 bg-white/10 p-8 text-white backdrop-blur-xl">
                        <h3 className="text-2xl font-bold">"The best way to predict the future is to create it."</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}