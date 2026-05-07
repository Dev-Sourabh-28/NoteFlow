import mongoose, {Document} from "mongoose";

export interface IUser extends Document{
    name : string,
    email : string,
    password : string,
    otp?: string,
    otpExpiry?: Date
}

const userSchema = new mongoose.Schema<IUser>({
    name : String,
    email :{ type : String,unique : true,},
    password :  String,
    otp: {type: String},
    otpExpiry: {type: Date}
},
{
    timestamps : true
});

export default mongoose.model<IUser>("User", userSchema);