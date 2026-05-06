import { useState, useEffect } from "react";
import API from "../services/api";
import { Trash, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import Editor from "../components/Editor";

interface Note {
  _id: string;
  title: string;
  content: string;
}

// ─── Theme Toggle ───────────────────────────────────────────────────
function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className={`relative flex h-7 w-14 shrink-0 items-center rounded-full border px-1 transition-all duration-300 backdrop-blur-md ${
        dark 
          ? "border-white/15 bg-indigo-500/25" 
          : "border-black/10 bg-amber-400/20"
      }`}
    >
      <span className={`absolute left-[7px] text-[10px] transition-opacity duration-300 ${dark ? "opacity-100" : "opacity-0"}`}>🌙</span>
      <span className={`absolute right-[7px] text-[10px] transition-opacity duration-300 ${dark ? "opacity-0" : "opacity-100"}`}>☀️</span>
      
      <div
        className={`z-10 flex h-5 w-5 items-center justify-center rounded-full text-[10px] transition-all duration-300 cubic-bezier(.34,1.56,.64,1) ${
          dark 
            ? "translate-x-[26px] bg-gradient-to-br from-indigo-500 to-purple-500 shadow-[0_2px_8px_rgba(99,102,241,0.5)]" 
            : "translate-x-0 bg-gradient-to-br from-amber-500 to-yellow-400 shadow-[0_2px_8px_rgba(251,191,36,0.6)]"
        }`}
      >
        {dark ? "🌙" : "☀️"}
      </div>
    </button>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────
function Navbar({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  return (
    <nav className={`sticky top-0 z-[100] flex h-[60px] shrink-0 items-center justify-between px-7 backdrop-blur-xl transition-colors duration-300 ${
      dark ? "border-b border-white/10 bg-[#0b0f1a]/70" : "border-b border-black/5 bg-white/60"
    }`}>
      <div className={`flex items-center gap-2.5 font-['Sora'] text-lg font-bold tracking-tight transition-colors ${dark ? "text-white" : "text-neutral-900"}`}>
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 text-sm shadow-lg shadow-indigo-500/30">
          ✦
        </span>
        NoteFlow
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle dark={dark} onToggle={onToggleDark} />
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className={`rounded-xl border px-3.5 py-1.5 font-['Sora'] text-[13px] font-medium transition-all ${
            dark 
              ? "border-white/10 bg-white/5 text-white/70 hover:bg-white/10" 
              : "border-black/10 bg-black/5 text-neutral-600 hover:bg-black/10"
          }`}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────
export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [debouncedNote, setDebouncedNote] = useState<Note | null>(null);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchNotes = async () => {
    const res = await API.get("/notes");
    setNotes(res.data);
  };

  useEffect(() => { fetchNotes(); }, []);

  const createNote = async () => {
    const res = await API.post("/notes", {});
    setNotes([res.data, ...notes]);
    setActiveNote(res.data);
  };

  const handleChange = (field: "title" | "content", value: string) => {
    if (!activeNote) return;
    const updated = { ...activeNote, [field]: value };
    setActiveNote(updated);
    setDebouncedNote(updated);
  };

  useEffect(() => {
    if (!debouncedNote) return;
    const timer = setTimeout(async () => {
      try {
        setIsSaving(true);
        await API.put(`/notes/${debouncedNote._id}`, {
          title: debouncedNote.title,
          content: debouncedNote.content,
        });
        setTimeout(() => setIsSaving(false), 2000);
      } catch (err) {
        console.error("Auto-save failed", err);
        setIsSaving(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedNote]);

  const deleteNote = async (id: string) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
      if (activeNote?._id === id) setActiveNote(null);
      toast.success("Note deleted");
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative flex h-screen flex-col font-['Sora'] transition-colors duration-300 ${dark ? "bg-[#0b0f1a] text-white" : "bg-[#f0f2f8] text-neutral-900"}`}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Decorative Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className={`absolute -left-[100px] -top-[100px] h-[500px] w-[500px] rounded-full blur-[80px] transition-opacity duration-500 ${dark ? "bg-indigo-500/15" : "bg-indigo-500/10"}`} />
        <div className={`absolute -right-[80px] -bottom-[80px] h-[400px] w-[400px] rounded-full blur-[80px] transition-opacity duration-500 ${dark ? "bg-pink-500/10" : "bg-pink-500/5"}`} />
      </div>

      <Navbar dark={dark} onToggleDark={() => setDark(!dark)} />

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`flex w-[280px] shrink-0 flex-col gap-4 border-r p-5 transition-all duration-300 backdrop-blur-xl ${
          dark ? "border-white/5 bg-white/[0.02]" : "border-black/5 bg-white/40"
        }`}>
          {/* Search */}
          <div className="relative group">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-opacity ${dark ? "text-white/40" : "text-black/40"}`} />
            <input
              placeholder="Search notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full rounded-xl border-none py-2.5 pl-9 pr-4 text-[13px] outline-none transition-all placeholder:text-neutral-500 ${
                dark ? "bg-white/5 text-white focus:bg-white/10" : "bg-black/5 text-neutral-900 focus:bg-black/10"
              }`}
            />
          </div>

          <button
            onClick={createNote}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 py-3 text-[13px] font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/50"
          >
            <Plus size={14} /> New Note
          </button>

          {/* Notes List */}
          <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-500/20">
            {filteredNotes.length === 0 && (
              <div className="py-8 text-center text-[13px] opacity-40">
                No notes yet.<br />Create your first one ✦
              </div>
            )}
            {filteredNotes.map((note) => {
              const isActive = activeNote?._id === note._id;
              return (
                <div
                  key={note._id}
                  onClick={() => setActiveNote(note)}
                  className={`group flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? "border-indigo-500/40 bg-gradient-to-br from-indigo-500/30 to-purple-500/20 shadow-inner backdrop-blur-md" 
                      : `border-transparent ${dark ? "bg-white/[0.04] hover:bg-white/[0.08]" : "bg-black/[0.04] hover:bg-black/[0.07]"}`
                  }`}
                >
                  <span className={`truncate text-[13px] font-medium transition-colors ${isActive ? "text-white" : ""}`}>
                    {note.title || "Untitled"}
                  </span>
                  <button
                    className="opacity-0 transition-opacity group-hover:opacity-100 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note._id);
                    }}
                  >
                    <Trash size={14} className="text-red-400" />
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Editor Area */}
        <main className={`relative flex flex-1 flex-col p-8 transition-colors duration-300 backdrop-blur-sm ${dark ? "bg-white/[0.01]" : "bg-white/50"}`}>
           {isSaving && (
            <span className={`absolute top-4 right-6 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all ${
              dark ? "border-green-400/20 bg-green-400/10 text-green-400" : "border-green-600/20 bg-green-600/10 text-green-700"
            }`}>
              ● Saved
            </span>
          )} 

          {activeNote ? (
            <div className="flex h-full flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <input
                placeholder="Note title…"
                value={activeNote.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={`w-full shrink-0 rounded-2xl border-none bg-transparent px-4 py-3 text-[24px] font-bold tracking-tight outline-none transition-all placeholder:text-neutral-500/30 ${
                  dark ? "bg-white/[0.03] text-white focus:bg-white/[0.06]" : "bg-white/80 text-neutral-900 focus:bg-white shadow-sm"
                }`}
              />
              <Editor
                // placeholder="Start writing…"
                content={activeNote.content}
                onChange={(value) => handleChange("content", value)}
                // className={`w-full flex-1 resize-none rounded-2xl border-none bg-transparent px-5 py-5 text-sm leading-relaxed outline-none transition-all placeholder:text-neutral-500/30 ${
                //   dark ? "bg-white/[0.03] text-white focus:bg-white/[0.06]" : "bg-white/80 text-neutral-900 focus:bg-white shadow-sm"
                // }`}
                dark={dark}
              />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 opacity-30">
              <span className="text-5xl">✦</span>
              <span className="text-[15px] font-medium">Select or create a note</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}