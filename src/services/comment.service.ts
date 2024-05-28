import { PipelineStage } from "mongoose";
import { errorCodes } from "../constants/error.codes";
import { ErrorHandler } from "../handlers/errorHandler";
import { ICOMMENT } from "../interface";
import { CommentQuery,BlogQuery } from "../queries";
import { Comment } from "../models";

export class CommentService {
  private commentQuery;
  private blogQuery;
  constructor(commentQuery: CommentQuery, blogQuery: BlogQuery) {
    this.commentQuery = commentQuery;
    this.blogQuery = blogQuery;
  }
  async getCommentService(page:number,limit:number,search:string,{...filters}):Promise<ICOMMENT[]> {
   
    const pipeline:PipelineStage[]=[
      {
        "$lookup": {
          "from": "users",
          "localField": "userId",
          "foreignField": "_id",
          "as": "user_comment"
        }
      },
      {
        "$unwind": {
          "path": "$user_comment"
        }
      },
      {
        "$lookup": {
          "from": "blogs",
          "localField": "blogId",
          "foreignField": "_id",
          "as": "blog_comment"
        }
      },
      {
        "$unwind": {
          "path": "$blog_comment"
        }
      },
      {
        "$lookup": {
          "from": "users",
          "localField": "blog_comment.userId",
          "foreignField": "_id",
          "as": "blog_author"
        }
      },
      {
        $unwind: {
          path: '$blog_author'
        }
      },
      {
        "$addFields": {
          "userEmail": "$user_comment.email",
          "userName": "$user_comment.userName",
          "userRole": "$user_comment.role",
          "blogTitle": "$blog_comment.title",
          "blogLikes": "$blog_comment.likes",
          "blogDislikes": "$blog_comment.dislikes",
          "blogContent": "$blog_comment.content",
          "authorName":"$blog_author.userName"
        }
      }
    ]
    
    const matchCriteria=Object.keys(filters).filter(key=> filters[key]!==null && filters[key]!==undefined).map(key=>({[key]:filters[key]}))
    if(search){
      const searchFields=['userRole', 'blogContent', 'userName', 'blogTitle','userEmail','content','authorName'];
      const searchCriteria=
      {
        $or: searchFields.map(field => ({ [field]: { $regex: search, $options: 'i' } }))
      };
      matchCriteria.push(searchCriteria)
    }
    if ((matchCriteria).length > 0) {
      const stage=({ $match:{$and: matchCriteria }});
      pipeline.push(stage)
  }
  
  
  if(page<1){
    page=1;
  }
  const skip=(page-1)*limit;
  pipeline.push({$skip:skip});
  pipeline.push({$limit:limit});
  pipeline.push({
    $project:{
      userRole:1, 
      blogContent:1, 
      userName:1, 
      blogTitle:1,
      userEmail:1,
      content:1,
      likes:1,
      dislikes:1,
      authorName:1
    }
  })
  
  const comment:ICOMMENT[]=await Comment.aggregate(pipeline);
  return comment
    
  }
  async createCommentService(
    userId: string,
    blogId: string,
    likes: number,
    dislikes: number,
    content: string
  ): Promise<ICOMMENT> {
    const comment = await this.commentQuery.createCommentQuery(
      userId,
      blogId,
      likes,
      dislikes,
      content
    );
    return comment;
  }
  async editCommentService(
    id: string,
    blogId: string,
    likes: number,
    dislikes: number,
    content: string,
    userid: string,
    role: string
  ): Promise<ICOMMENT | object> {
    const getComment = await this.commentQuery.getCommentById(id);
    if (!getComment) {
      return new ErrorHandler(
        "Comment with this id doesnot exist",
        errorCodes.NOT_FOUND
      );
    } else {
      if (userid.toString() === getComment.userId.toString()) {
        const comment: ICOMMENT | null =
          await this.commentQuery.editCommentQuery(id, { content });
        if (!comment) {
          return new ErrorHandler(
            "Comment with this id doesnot exist...",
            errorCodes.NOT_FOUND
          );
        } else {
          return comment;
        }
      } else {
        return new ErrorHandler(
          "You cannot edit other user's comment",
          errorCodes.FORBIDDEN
        );
      }
    }
  }
  async deleteCommentService(
    id: string,
    userid: string,
    role: string
  ): Promise<object> {
    const getComment = await this.commentQuery.getCommentById(id);
    if (!getComment) {
      return new ErrorHandler(
        "Comment with this id doesnot exist",
        errorCodes.NOT_FOUND
      );
    } else {
      const blogId = getComment.blogId.toString();
      const getBlog = await this.blogQuery.findBlogById(blogId);
      if (
        (userid.toString() === getComment.userId.toString() &&
          role === "User") ||
        role === "Admin" ||
        (role === "Author" &&
          getBlog &&
          getBlog.userId.toString() === userid.toString() &&
          role === "Author")
      ) {
        const comment: ICOMMENT | null =
          await this.commentQuery.deleteCommentQuery(id);
        if (!comment) {
          return new ErrorHandler(
            "Comment with this id doesnot exist...",
            errorCodes.NOT_FOUND
          );
        } else {
          const message = { message: "Comment deleted successfully" };
          return message;
        }
      } else {
        return new ErrorHandler(
          "You cannot delete other user's comment",
          errorCodes.FORBIDDEN
        );
      }
    }
  }
}
