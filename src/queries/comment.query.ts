import { Comment } from "../models";
import { ICOMMENT } from "../interface";
import { ErrorHandler } from "../handlers/errorHandler";
import { errorCodes } from "../constants/error.codes";

export class CommentQuery{
    async createCommentQuery(userId:string,blogId:string,likes:number,dislikes:number,content:string):Promise<ICOMMENT>{
        const comment=await Comment.create({userId,blogId,likes,dislikes,content})
        return comment
    }
    async editCommentQuery(id:string,obj:object):Promise<ICOMMENT|null>{
     const comment:ICOMMENT|null=await Comment.findByIdAndUpdate(id,obj,{new:true});
     return comment   
    }
    async deleteCommentQuery(id:string){
        const comment=await Comment.findByIdAndDelete(id)
        return comment;
    }
    async getCommentQuery():Promise<ICOMMENT[]>{
        const comments:ICOMMENT[]=await Comment.find({});
        return comments
        
    }
    async getCommentById(id:string):Promise<ICOMMENT|null>{
        const comment:ICOMMENT|null=await Comment.findOne({_id:id});
        return comment;

    }
}