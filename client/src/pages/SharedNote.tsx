import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Editor from "../components/Editor";
import toast from "react-hot-toast";

export default function SharedNote(){
    const {shareId} = useParams();

    const [note, setNote] = useState<any>(null);
    const [content, setContent] = useState("");

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await API.get(
                    `/notes/shared/${shareId}`
                );
                setNote(res.data);
                setContent(res.data.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchNote();
    }, []);

    const handleSave = async () => {
        try {
            await API.put(`/notes/${note._id}`, {
                title: note.title,
                content,
            });
            toast.success("Note updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update note");
        }
    };

    if(!note){
        return <p>Loading...</p>
    }

    const canEdit = note.sharePermission === "edit";

    return(
        <div className="min-h-screen bg-slate-900 text-white p-10">
           <h1 className="text-4xl font-bold mb-6">
               {note.title}
           </h1>

           {canEdit ? (
               <div className="mb-4">
                   <Editor 
                       content={content} 
                       onChange={setContent} 
                       dark={true}
                       activeNote={note}
                   />
                   <button
                       onClick={handleSave}
                       className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                   >
                       Save Changes
                   </button>
               </div>
           ) : (
               <div
               className="prose prose-invert max-w-none"
               dangerouslySetInnerHTML={{
                __html: note.content,
               }}
               >

               </div>
           )}
        </div>
    )
}