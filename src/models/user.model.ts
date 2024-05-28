import mongoose,{Model, Schema} from 'mongoose';
import { IUSER } from '../interface';

const userSchema:Schema<IUSER>=new Schema(
    {
        userName:{
            type:String,
            required:true
        },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:['User','Author','Admin'],
        default:'User'
    }
    },
    
    {
        timestamps:true
    })
type userModel=Model<IUSER>;
const User:userModel=mongoose.model<IUSER>('User',userSchema)

export {User}