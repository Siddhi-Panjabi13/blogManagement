import express from "express";
import { CommentController } from "../controllers";
import { CommentService } from "../services";
import { CommentQuery, BlogQuery } from "../queries";
import { Request, Response } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
const commentQuery = new CommentQuery();
const blogQuery = new BlogQuery();
const commentService = new CommentService(commentQuery, blogQuery);
const commentController = new CommentController(commentService);
const router = express.Router();
router.get("/getComment", [verifyToken], (req: Request, res: Response) =>
  commentController.getCommentController(req, res)
);
router.post("/createComment", [verifyToken], (req: Request, res: Response) =>
  commentController.createCommentController(req, res)
);
router.patch(
  "/updateComment/:id",
  [verifyToken],
  (req: Request, res: Response) =>
    commentController.editCommentController(req, res)
);
router.delete(
  "/deleteComment/:id",
  [verifyToken],
  (req: Request, res: Response) =>
    commentController.deleteCommentController(req, res)
);

export default router;
