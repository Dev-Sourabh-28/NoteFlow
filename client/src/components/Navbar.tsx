import { useNavigate } from "react-router-dom";

export default function Navbar(){
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout ?");
        if(!confirmLogout) return;
        
        localStorage.removeItem("token");
        navigate("/");
    }

    return(
        <div className="h-14 bg-slate-800 flex items-center justify-between px-6 border-b border-slate-700">
         
         <h1 className="text-xl font-bold text-white">
            NoteFlow
         </h1>

         <button 
         onClick={handleLogout}
         className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
         >
            Logout
         </button>
        </div>
    )
}