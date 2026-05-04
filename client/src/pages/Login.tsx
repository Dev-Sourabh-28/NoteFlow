import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

interface LoginData{
    email : string,
    password : string
}

export default function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState<LoginData>({
        email : "",
        password : "",
    });

    const handleSubmit = async() => {
        try {
            const res = await API.post("/auth/login", form);

            localStorage.setItem("token", res.data.token);

            navigate("/dashboard");
        } catch (error: any) {
            alert(error.response?.data?.msg || "Error");
        }
    }
    return(
        <div className="h-screen flex items-center justify-center bg-slate-900">
            <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6">Login</h1>

                <input 
                className="w-full p-3 mb-3 rounded bg-red text-black" 
                placeholder="Email"
                onChange={(e) => setForm({...form, email: e.target.value})}
                />
                
                <input 
                className="w-full p-3 mb-3 rounded bg-slate-700" 
                placeholder="Password"
                onChange={(e) => setForm({...form, password: e.target.value})}
                />
                
                <button 
                onClick={handleSubmit}
                className="w-full bg-blue-600 p-3 rounded"
                >
                    Login
                    </button>

                <p className="mt-4 text-sm">
                    Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
                </p>
                
                </div>
        </div>
    )
}