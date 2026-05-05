import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar(){
    const navigate = useNavigate();

    const [dark, setDark] = useState<boolean>(() => {
        return (
            typeof window !== "undefined" &&
            localStorage.getItem("theme") === "dark"
        );
    });

    useLayoutEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", dark);
        localStorage.setItem("theme", dark ? "dark" : "light");
    }, [dark]);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout ?");
        if(!confirmLogout) return;
        
        localStorage.removeItem("token");
        navigate("/");
    }

    return(
        <div className="flex h-14 items-center justify-between px-6 bg-white dark:bg-slate-800 border-b border-gray-300 dark:border-slate-700">
         
         <h1 className="text-xl font-bold">
            NoteFlow
         </h1>

         <div className="flex gap-3 items-center">
           <button
             onClick={() => setDark(!dark)}
             className="bg-gray-600 px-3 py-1 rounded mr-3"
           >
             {dark ? "Switch to Light" : "Switch to Dark"}
           </button>
           <button
             onClick={handleLogout}
             className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
           >
             Logout
           </button>
         </div>
        </div>
    )
}