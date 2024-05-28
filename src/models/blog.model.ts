import mongoose, { Model, Schema } from 'mongoose'
import { IBLOG } from '../interface'

const blogSchema:Schema<IBLOG> = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        likes: {
            type: Number,
            required: true,
            default: 0
        },
        dislikes: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true
    });
type blogModel=Model<IBLOG>;
const Blog:blogModel=mongoose.model<IBLOG>('Blog',blogSchema)

export {Blog};