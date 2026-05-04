import { useState, useEffect } from "react";
import API from "../services/api";

interface Note{
    _id: string;
    title: string;
    content: string;
}

export default function Dashboard() {

    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [debouncedNote, setDebouncedNote] = useState<Note | null>(null);

    const fetchNotes = async() => {
        const res = await API.get("/notes");
        setNotes(res.data);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const createNote = async() => {
        const res = await API.post("/notes", {});
        setNotes([res.data, ...notes]);
        setActiveNote(res.data);
    };

    const handleChange = (field: "title" | "content", value: string) => {
        if(!activeNote) return;

        const updated = {...activeNote, [field]: value};
        setActiveNote(updated);
        setDebouncedNote(updated);
    };

    useEffect(() => {
        if(!debouncedNote) return;

        const timer = setTimeout(async () => {
            await API.put(`/notes/${debouncedNote._id}`, {
                title: debouncedNote.title,
                content: debouncedNote.content,
            })
            fetchNotes();
        }, 500);

        return () => clearTimeout(timer);
    }, [debouncedNote]);

    const updateNote = async(updated : Note) => {
        setActiveNote(updated);

        await API.put(`/notes/${updated._id}`,{
            title: updated.title,
            content: updated.content,
        })

        fetchNotes();
    }
    return(
        <div className="h-screen flex">

            <div className="w-72 bg-slate-800 p-4">
              <button 
              onClick={createNote}
              className="bg-blue-600 w-full p-2 rounded mb-4"
              >
                + New Note
              </button>

              {notes.map((note) => (
                <div
                key={note._id}
                onClick={() => setActiveNote(note)}
                className="p-2 bg-slate-700 rounded mb-2 cursor-pointer"
                >
                    {note.title}
                    </div>
              ))}
            </div>

            <div className="flex-1 p-6">
               {activeNote ? (
                <>
                <input
                className="w-full bg-slate-800 p-4 rounded text-2xl mb-4"
                value={activeNote.title}
                onChange={(e) => 
                    updateNote({...activeNote, title: e.target.value})
                }
                />

                <textarea
                className="w-full h-[80%] bg-slate-800 p-4 rounded"
                value={activeNote.content}
                onChange={(e) =>
                    updateNote({...activeNote, content: e.target.value})
                }
                />
                </>
               ) : (
                <p>Select or create a note</p>
               )}
            </div>
        </div>
        
    );
}
