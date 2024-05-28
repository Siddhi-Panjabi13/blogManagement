import { Request, Response } from "express";
import { ICOMMENT, REQUEST1, IUSER } from "../interface";
import { CommentService } from "../services/comment.service";
import { errorCodes } from "../constants/error.codes";
import { ErrorHandler } from "../handlers/errorHandler";
import { responseError } from "../handlers/errorFunction";
export class CommentController {
  private commentService;
  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }
  async getCommentController(req: Request, res: Response): Promise<void> {
    let {page,limit,search,...filters}:any=req.query;
    page=Number(req.query.page)||1;
    limit=Number(req.query.limit)||4;
    const comments = await this.commentService.getCommentService(page,limit,search,{...filters});
    res.json(comments);
    return;
  }
  async createCommentController(req: Request, res: Response): Promise<void> {
    const { blogId, likes, dislikes, content } = req.body;
    const user: IUSER | null = (req as REQUEST1).user;
    if (!user) {
      res.status(errorCodes.NOT_FOUND).json("User not found...");
      return;
    } else {
      const userId = user._id as string;
      const comment = await this.commentService.createCommentService(
        userId,
        blogId,
        likes,
        dislikes,
        content
      );
      res.status(errorCodes.OK).json(comment);
      return;
    }
  }
  async editCommentController(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = (req as REQUEST1).user;
    if (!user) {
      res.status(errorCodes.NOT_FOUND).json("User not found...");
      return;
    } else {
      const userid = user._id as string;
      const role = user.role;
      const { blogId, likes, dislikes, content } = req.body;
      const comment: ICOMMENT | object =
        await this.commentService.editCommentService(
          id,
          blogId,
          likes,
          dislikes,
          content,
          userid,
          role
        );
      if (comment instanceof ErrorHandler) {
        res
          .status(comment.statusCode)
          .json(responseError(false, comment.message, comment));
        return;
      }
      res.json(comment);
      return;
    }
  }
  async deleteCommentController(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = (req as REQUEST1).user;
    if (!user) {
      res.status(errorCodes.NOT_FOUND).json("User not found...");
      return;
    } else {
      const userid = user._id as string;
      const role = user.role;
      const comment: ICOMMENT | object =
        await this.commentService.deleteCommentService(id, userid, role);
      if (comment instanceof ErrorHandler) {
        res
          .status(comment.statusCode)
          .json(responseError(false, comment.message, comment));
        return;
      }
      res.json(comment);
      return;
    }
  }
}
