import { useState, useEffect } from "react";
import API from "../services/api";
import { Trash, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import Editor from "../components/Editor";
import Navbar from "../components/Navbar";
import * as SubnoteTypes from "../types/subnote";
import { subnoteAPI } from "../services/api";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";

interface Note {
    _id: string;
    title: string;
    content: string;
}


// ─── Dashboard ───────────────────────────────────────────────────────
export default function Dashboard() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
        const [search, setSearch] = useState("");
    const [dark, setDark] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
    const [showSubnoteForm, setShowSubnoteForm] = useState<string | null>(null);
    const [subnotes, setSubnotes] = useState<Record<string, SubnoteTypes.Subnote[]>>({});
    const [activeSubnote, setActiveSubnote] = useState<SubnoteTypes.Subnote | null>(null);
const [newSubnote, setNewSubnote] = useState<SubnoteTypes.CreateSubnoteDto>({
    title: "",
    content: "",
    noteId: ""
});

    const fetchSubnotes = async (noteId: string) => {
        try {
            const res = await subnoteAPI.getByNote(noteId);

            const subnotesArray = Array.isArray(res.data.data) ? res.data.data : [];
            setSubnotes(prev => ({
                ...prev,
                [noteId]: subnotesArray
            }));
        } catch (error) {
            console.error("Failed to fetch subnotes", error);

            setSubnotes(prev => ({
                ...prev,
                [noteId]: []
            }));
        }
    };

    const createSubnote = async (noteId: string) => {
        try {
            const res = await subnoteAPI.create({
                ...newSubnote,
                noteId
            });

            if(!subnotes[noteId]){
                setSubnotes(prev => ({...prev, [noteId]: []}));
            }

            setSubnotes(prev => ({
                ...prev,
                [noteId]: [...(prev[noteId] || []), res.data.data]
            }));

            setNewSubnote({title: "", content: "", noteId: ""});
            setShowSubnoteForm(null);
            toast.success("Subnote created");
        } catch (error) {
            toast.error("Failed to create subnote");
        }
    };

    const deleteSubnote = async(noteId: string, subnoteId: string) => {
        try {
            await subnoteAPI.delete(subnoteId);

            setSubnotes(prev => ({
                ...prev,
                [noteId]: prev[noteId].filter(s => s._id !== subnoteId)
            }));
            toast.success("Subnote deleted");
        } catch (error) {
            toast.error("Failed to delete subnote");
        }
    };

    const toggleNoteExpansion = (noteId: string) => {
        const newExpanded = new Set(expandedNotes);

        if(newExpanded.has(noteId)){
            newExpanded.delete(noteId);
        }else{
            newExpanded.add(noteId);
            fetchSubnotes(noteId);
        }
        setExpandedNotes(newExpanded);
    }


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
        if(activeSubnote){
            const updated = {...activeSubnote, [field]: value};
            setActiveSubnote(updated);
        }else if (activeNote){
            const updated = {...activeNote, [field]: value};
            setActiveNote(updated);
        }
    };

    useEffect(() => {
        if (!activeSubnote) return;
        const timer = setTimeout(async () => {
            try {
                await subnoteAPI.update(activeSubnote._id, {
                    title: activeSubnote.title,
                    content: activeSubnote.content,
                })
                setSubnotes(prev => ({
                    ...prev,
                    [activeSubnote.noteId]: prev[activeSubnote.noteId].map(s => 
                        s._id === activeSubnote._id ? activeSubnote : s
                    )
                }))

            } catch (err) {
                console.error("Auto-save failed", err);
                setIsSaving(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [activeSubnote]);

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

            <Navbar
                dark={dark}
                onToggleDark={() => setDark(!dark)}
                onOpenMenu={() => setIsMobileMenuOpen(true)}
            />

            <div className="relative z-10 flex flex-1 overflow-hidden">
                {/* Sidebar */}

                <aside className={`
    fixed inset-y-0 left-0 z-[150] w-[280px] sm:w-[320px] shrink-0 flex-col gap-4 border-r pt-16 p-5 transition-all duration-300 backdrop-blur-xl lg:relative lg:translate-x-0 lg:flex lg:pt-5
    ${isMobileMenuOpen ? "translate-x-0 flex" : "-translate-x-full hidden lg:flex"}
    ${dark ? "border-white/5 bg-[#0b0f1a]" : "border-black/5 bg-[#f0f2f8]"}
`}>

                    <button
                        className="lg:hidden absolute right-4 top-14 z-[160] p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/10 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="relative group">
                        <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-opacity ${dark ? "text-white/40" : "text-black/40"}`} />
                        <input
                            placeholder="Search notes…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full rounded-xl border-none py-2.5 pl-9 pr-4 text-[13px] outline-none transition-all placeholder:text-neutral-500 ${dark ? "bg-white/5 text-white focus:bg-white/10" : "bg-black/5 text-neutral-900 focus:bg-black/10"
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
    const isExpanded = expandedNotes.has(note._id);
    const noteSubnotes = Array.isArray(subnotes[note._id]) ? subnotes[note._id] : [];
    
    return (
        <div key={note._id}>
            <div
                onClick={() => setActiveNote(note)}
                className={`group flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all duration-200 ${isActive
                    ? "border-indigo-500/40 bg-gradient-to-br from-indigo-500/30 to-purple-500/20 shadow-inner backdrop-blur-md"
                    : `border-transparent ${dark ? "bg-white/[0.04] hover:bg-white/[0.08]" : "bg-black/[0.04] hover:bg-black/[0.07]"}`
                    }`}
            >
                <div className="flex items-center gap-2 flex-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleNoteExpansion(note._id);
                        }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>
                    <span className={`truncate text-[13px] font-medium transition-colors ${isActive ? "text-white" : ""}`}>
                        {note.title || "Untitled"}
                    </span>
                </div>
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
            
            {/* Subnotes Section */}
            {isExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                    <button
                        onClick={() => setShowSubnoteForm(note._id)}
                        className="w-full flex items-center gap-2 p-2 rounded-lg border border-dashed border-white/20 hover:border-white/40 transition-colors"
                    >
                        <Plus size={12} />
                        <span className="text-xs opacity-60">Add subnote</span>
                    </button>
                    
                    {showSubnoteForm === note._id && (
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                            <input
                                placeholder="Subnote title..."
                                value={newSubnote.title}
                                onChange={(e) => setNewSubnote(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full p-2 rounded bg-white/10 text-xs mb-2"
                            />
                            <textarea
                                placeholder="Subnote content..."
                                value={newSubnote.content}
                                onChange={(e) => setNewSubnote(prev => ({ ...prev, content: e.target.value }))}
                                className="w-full p-2 rounded bg-white/10 text-xs mb-2 resize-none"
                                rows={2}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => createSubnote(note._id)}
                                    className="px-3 py-1 rounded bg-indigo-500 text-xs"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setShowSubnoteForm(null);
                                        setNewSubnote({ title: "", content: "", noteId: "" });
                                    }}
                                    className="px-3 py-1 rounded bg-white/10 text-xs"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {noteSubnotes.map((subnote, index) => (
                        <div
                            key={subnote._id || `subnote-${index}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveNote(null);
                                setActiveSubnote(subnote);
                            }}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors group ${
            activeSubnote?._id === subnote._id ? "bg-indigo-500/20" : "bg-white/[0.02] hover:bg-white/[0.05]"
        }`}
                        >
                            <FileText size={12} className="opacity-40" />
                            <span className="text-xs truncate flex-1">{subnote.title}</span>
                            <button
                                onClick={() => deleteSubnote(note._id, subnote._id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash size={10} className="text-red-400" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
})}
                    </div>
                </aside>

                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-[140] bg-black/50 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
                {/* Editor Area */}
                <main className={`relative flex flex-1 flex-col p-3 sm:p-4 md:p-6 lg:p-8 transition-all duration-300 ${dark ? "bg-[#0b0f1a]/50" : "bg-white/50"
                    }`}>
                    {isSaving && (
                        <span className={`absolute top-4 right-6 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all ${dark ? "border-green-400/20 bg-green-400/10 text-green-400" : "border-green-600/20 bg-green-600/10 text-green-700"
                            }`}>
                            ● Saved
                        </span>
                    )}

                    {activeNote || activeSubnote ? (
                        <div className="flex h-full flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <input
                                placeholder="Note title…"
                                value={activeNote?.title || activeSubnote?.title || ""}
                                onChange={(e) => handleChange("title", e.target.value)}
                                className={`w-full shrink-0 rounded-2xl border-none bg-transparent px-4 py-3 text-[24px] font-bold tracking-tight outline-none transition-all placeholder:text-neutral-500/30 ${dark ? "bg-white/[0.03] text-white focus:bg-white/[0.06]" : "bg-white/80 text-neutral-900 focus:bg-white shadow-sm"
                                    }`}
                            />
                            <Editor
                                // placeholder="Start writing…"
                                content={activeNote?.content || activeSubnote?.content || ""}
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