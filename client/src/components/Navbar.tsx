import { Menu, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavbarProps{
    dark: boolean;
    onToggleDark: () => void;
    onOpenMenu: () => void;
}

export default function Navbar({dark, onToggleDark, onOpenMenu}: NavbarProps){
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout ?");
        if(!confirmLogout) return;
        
        localStorage.removeItem("token");
        navigate("/");
    }

    return(
        <nav className="flex h-14 items-center justify-between px-4 sm:px-6 bg-white dark:bg-slate-800 border-b border-gray-300 dark:border-slate-700">
         
<div className="flex items-center justify-between w-full">
    <div className="flex items-center gap-3">
        <button
            onClick={onOpenMenu}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white transition-colors"
            title="Open Menu"
        >
            <Menu size={24}/>
        </button>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">✦</span>
            NoteFlow
        </h1>
    </div>

    <div className="flex items-center gap-2 sm:gap-3">
        <button
            onClick={onToggleDark}
            className="flex h-9 items-center gap-2 px-3 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-sm font-medium"
        >
            {dark ? <Sun size={16}/> : <Moon size={16}/>}
            <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
        </button>
        
        <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm transition-colors"
        >
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">→</span>
        </button>
    </div>
</div>
         
         {/* <div className="flex w-1/3 justify-center">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">✦</span>
          NoteFlow
        </h1>
         </div> */}

         {/* <div className="flex items-center gap-4">
          <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`lg:hidden p-2 rounded-xl ${dark ? "bg-white/5 text-white" : "bg-black/5 text-black"}`}
          >
           <Search size={20}/>
          </button>
         </div> */}

         {/* <div className="flex w-1/3 justify-end items-center gap-3">
           <button
             onClick={onToggleDark}
             className="flex h-9 items-center gap-2 px-3 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-sm font-medium"
           >
             {dark ? <Sun size={16}/> : <Moon size={16}/>}
             <span className="hidden md:inline">{dark ? "Light" : "Dark"}</span>
           </button>
           
           <button
             onClick={handleLogout}
             className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
           >
             Logout
           </button>
         </div> */}
        </nav>
    )
}