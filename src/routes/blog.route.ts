import express from 'express'
import { BlogQuery } from '../queries';
import { BlogService } from '../services';
import { BlogController } from '../controllers';
import {Request, Response} from 'express';
import { verifyToken } from '../middlewares/verifyToken.middleware';
const router=express.Router();
const blogQuery=new BlogQuery();
const blogService=new BlogService(blogQuery);
const blogController=new BlogController(blogService)

router.post('/createBlog',[verifyToken],(req:Request,res:Response)=>blogController.createBlogController(req,res));
router.get('/getBlog',[verifyToken],(req:Request,res:Response)=>blogController.getBlogController(req,res));
router.patch('/updateBlog/:id',[verifyToken],(req:Request,res:Response)=>blogController.updateBlogController(req,res));
router.delete('/deleteBlog/:id',[verifyToken],(req:Request,res:Response)=>blogController.deleteBlogController(req,res));


export default router;