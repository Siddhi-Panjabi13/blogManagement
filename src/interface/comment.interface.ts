import mongoose,{Document} from 'mongoose';

export interface ICOMMENT extends Document{
    userId:mongoose.Types.ObjectId,
    blogId:mongoose.Types.ObjectId,
    likes:number,
    dislikes:number,
    content:string
}