import mongoose, {Document} from "mongoose";

export interface IUser extends Document{
    name : string,
    email : string,
    password : string,
}

const userSchema = new mongoose.Schema<IUser>({
    name : String,
    email :{ type : String,unique : true,},
    password :  String,
},
{
    timestamps : true
});

export default mongoose.model<IUser>("User", userSchema);