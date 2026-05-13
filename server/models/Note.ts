import mongoose, {Document} from "mongoose";

export interface INote extends Document{
    userId : string;
    title : string;
    content : string;
    isShared: boolean;
    sharePermission: "read" | "edit";
    shareId: string | null;
}

const noteSchema = new mongoose.Schema<INote>({
    userId : {type : String, required : true},
    title : String,
    content : String,
    isShared: {
        type: Boolean,
        default: false,
    },
    sharePermission: {
        type: String,
        enum: ["read", "edit"],
        default: "read",
    },
    shareId: {
        type: String,
        default: null,
    },
},
{
    timestamps : true
}
)

export default mongoose.model<INote>("Note", noteSchema);