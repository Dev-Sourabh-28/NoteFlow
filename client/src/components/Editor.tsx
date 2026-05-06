import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Bold, Italic, List, Heading1, Underline as UnderlineIcon, ListOrdered, Palette } from "lucide-react";
import {TextStyle} from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import ColorPalette from "./ColorPaletter";

interface Props{
    content : string;
    onChange: (value: string) => void;
    dark: boolean;
}

export default function Editor({ content, onChange, dark}: Props){
    const [showColors, setShowColors] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Underline,
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] max-w-full'
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        }
    })

    useEffect(() => {
        if(editor && content !== editor.getHTML()){
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    const btnClass = (active: boolean) => `
    p-2 rounded-lg transition-all
    ${active
        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
        : dark ? 'text-white/60 hover:bg-white/10' : 'text-neutral-600 hover:bg-black/5'
    }
    `;
return (
    <div className={`flex flex-1 flex-col rounded-2xl border transition-all overflow-hidden ${
      dark ? "bg-white/[0.03] border-white/10" : "bg-white/80 border-black/5 shadow-sm"
    }`}>
      {/* Toolbar */}
      <div className={`flex gap-1 p-2 border-b ${dark ? "border-white/10" : "border-black/5"}`}>
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
        ><Bold size={18} /></button>
        
        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
        ><Italic size={18} /></button>

        <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        ><UnderlineIcon size={18}/></button>

        <div className={`w-px h-6 mx-1 self-center ${dark ? "bg-white/10" : "bg-black/10"}`} />

        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={btnClass(editor.isActive('heading', { level: 1 }))}
        ><Heading1 size={18} /></button>

        {/* <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive('heading', { level: 2 }))}
        ><Heading2 size={18} /></button> */}

        <button 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
        ><List size={18} /></button>

        <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        ><ListOrdered/></button>

        <div className={`w-px h-6 mx-1 self-center ${dark ? "bg-white/10" : "bg-black/10"}`} />

         <div className="relative">
         <button
         onClick={() => setShowColors(!showColors)}
         className={btnClass(showColors)}
         >
          <Palette size={18}/>
         </button>

         {showColors && (
            <div className={`absolute top-full left-0 mt-2 z-50 p-2 rounded-xl border shadow-xl animate-in fade-in zoom-in duration-200 ${
                dark ? "bg-neutral-900 border-white/10" : "bg-white border-black/5"
            }`}>
              <ColorPalette editor={editor}/>
            </div>
         )}
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-5 custom-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}