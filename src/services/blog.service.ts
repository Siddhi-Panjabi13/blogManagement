import { PipelineStage } from "mongoose";
import { errorCodes } from "../constants/error.codes";
import { ErrorHandler } from "../handlers/errorHandler";
import { IBLOG,ICOMMENT,IUSER } from "../interface";
import { BlogQuery } from "../queries";
import { pipeline } from "stream";
import { Blog,Comment } from "../models";
export class BlogService{
    private blogQuery;
    constructor(blogQuery:BlogQuery){
        this.blogQuery=blogQuery
    }
    async createBlogService(title:string,userId:string,content:string, likes:string, dislikes:string){
        
        const blog:IBLOG=await this.blogQuery.createBlogQuery(title,userId,content, likes, dislikes)
        return blog;
    }

    async getBlogService(page:number,limit:number,search:string,{...filters}):Promise<IBLOG[]>{
        const Pipeline:PipelineStage[]=[{
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'blog_author'
            }
          },
          {
            $unwind: {
              path: '$blog_author'
            }
          },
           {
             $addFields: {
               authorName:'$blog_author.userName',
               authorEmail:'$blog_author.email'
             }
           }
          ]
        const matchCriteria=Object.keys(filters).filter(key=>filters[key]!==null && filters[key]!==undefined).map(key=>({[key]:filters[key]}));
        if(search){
            const searchFields=['authorName','authorEmail','content','title'];
            const searchCriteria={$or:searchFields.map(field=>({[field]:{$regex:search,$options:'i'}}))}
            matchCriteria.push(searchCriteria);
        }
        if(matchCriteria.length>0){
               const stage=({$match:{$and:matchCriteria}});
               Pipeline.push(stage)
        }
        if(page<1){
            page=1
        }
        const skip=(page-1)*limit
        Pipeline.push({$skip:skip})
        Pipeline.push({$limit:limit})
        Pipeline.push({
            $project:{
                'title':1,
                'content':1,
                'likes':1,
                'dislikes':1,
                'authorName':1,
                'authorEmail':1
            }
        })
        const blogs=await Blog.aggregate(Pipeline);
        return blogs
    }
    async updateBlogService(id:string,title:string,userId:string,content:string,likes:string,dislikes:string,user:IUSER):Promise<IBLOG|object>{
        const uid=user._id as string
        const getBlog:IBLOG|null=await this.blogQuery.findBlogById(id)
        if(!getBlog){
            return (new ErrorHandler('Blog not found',errorCodes.NOT_FOUND))
        }
        else{
            if(((getBlog.userId).toString()===uid)){
                const obj={title,userId,content,likes,dislikes}
                const blog:IBLOG|null=await this.blogQuery.updateBlogQuery(id,obj);
                if(!blog){
                    return (new ErrorHandler('Blog not found',errorCodes.NOT_FOUND))
                }
                else{
                    return blog
                }
                
            }
            else{
                return new ErrorHandler('You cannot update blog of other user',errorCodes.FORBIDDEN)
            }
        }
    }
    async deleteBlogService(id:string,user:IUSER):Promise<object>{
        let session;
        const uid=user._id as string
        const getBlog:IBLOG|null=await this.blogQuery.findBlogById(id)
        if(!getBlog){
            return (new ErrorHandler('Blog not found',errorCodes.NOT_FOUND))
        }
        else{
            try{
                if(((getBlog.userId).toString()===uid)||(user.role==='Admin')){
                    session = await Blog.startSession();
            session.startTransaction();
            const comments: ICOMMENT[] = await Comment.find({ blogId: id });
            if(comments.length==0){
                await this.blogQuery.deleteBlog(id);
                await session.commitTransaction();
                session.endSession();
                return {'message':'Blog deleted successfully...'}
            }
            else{
                await Comment.deleteMany({blogId:id});
                await this.blogQuery.deleteBlog(id)
                await session.commitTransaction();
                session.endSession()
                return {'message':'Blog along with it comments deleted successfully...'}
            }
                    
                }
                else{
                    return new ErrorHandler('You cannot delete blog of other user',errorCodes.FORBIDDEN)
                }
            }
            catch(error:any){
                if(session){

                    await session.abortTransaction();
                    session.endSession
                }
                return new ErrorHandler(error.message,errorCodes.INTERNAL_SERVER_ERROR)
            }
           
        }
    }
}