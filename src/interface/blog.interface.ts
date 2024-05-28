import mongoose,{Document} from 'mongoose';

export interface IBLOG extends Document{
    title:string,
    userId:mongoose.Types.ObjectId,
    content:string,
    likes:number,
    dislikes:number
}