import mongoose,{Model,Schema} from 'mongoose'
import { ICOMMENT } from '../interface'

const commentSchema:Schema<ICOMMENT>=new Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog',
        required:true

    },
    likes:{
        type:Number,
        required:true,
        default:0
    },
    dislikes:{
        type:Number,
        required:true,
        default:0
    },
    content:{
        type:String,
        required:true
    }
    },
    
    {
        timestamps:true
    })

type commentModel=Model<ICOMMENT>;
const Comment:commentModel=mongoose.model<ICOMMENT>('Comment',commentSchema);
export {Comment}