import { Editor } from "@tiptap/react";

interface Props {
    editor: Editor | null;
}

export default function ColorPalette({editor}: Props){

    if(!editor) return null;

    const colors = [
    "#000000",
    "#ffffff",
    "#ef4444", 
    "#22c55e",
    "#BDB76B", 
    "#3b82f6",
    "#000080", 
    "#eab308", 
    "#a855f7", 
    "#f97316",
    "#808080",
    "#BC8F8F",
    "#8B4513" 
    ];

    return(
        <div className="flex gap-2 mb-2">
          {colors.map((color) => (
           <button
           key={color}
           onClick={() => editor.chain().focus().setColor(color).run()}
           className="w-5 h-5 rounded border"
           style={{backgroundColor: color}}
           />
          ))}

          <button
          onClick={() => editor.chain().focus().unsetColor().run()}
          >
            Reset
          </button>
        </div>
    )
}