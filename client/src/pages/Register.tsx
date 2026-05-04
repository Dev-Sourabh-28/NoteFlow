import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

interface FormData {
    name : string;
    email : string,
    password : string
}

export default function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState<FormData>({
        name : "",
        email : "",
        password : ""
    })

    const handleSubmit = async() => {
        try {
            await API.post("/auth/register", form);
            alert("Registered Successfully");
            navigate('/login')
        } catch (error: any) {
           alert(error.response?.data?.msg || "Error");            
        }
    }
    return(
        <div className="h-screen flex items-center justify-center bg-slate-900">
            <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6">Register</h1>

                <input 
                className="w-full p-3 mb-3 rounded bg-slate-700" 
                placeholder="Name"
                onChange={(e) => setForm({...form, name: e.target.value})}
                />
                
                <input 
                className="w-full p-3 mb-3 rounded bg-slate-700" 
                placeholder="Email"
                onChange={(e) => setForm({...form, email: e.target.value})}
                />
                '<input 
                className="w-full p-3 mb-3 rounded bg-slate-700" 
                placeholder="Password"
                onChange={(e) => setForm({...form, password: e.target.value})}
                />'
                
                <button 
                onClick={handleSubmit}
                className="w-full bg-blue-600 p-3 rounded"
                >
                    Register
                    </button>

                <p className="mt-4 text-sm">
                    Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
                </p>
                
                </div>
        </div>
    )
}