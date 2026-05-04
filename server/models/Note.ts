import mongoose, {Document} from "mongoose";

export interface INote extends Document{
    userId : string;
    title : string;
    content : string;
}

const noteSchema = new mongoose.Schema<INote>({
    userId : {type : String, required : true},
    title : String,
    content : String,
},
{
    timestamps : true
}
)

export default mongoose.model<INote>("Note", noteSchema);