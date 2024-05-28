import { Request, Response } from 'express'
import { ErrorHandler } from '../handlers/errorHandler'
import { responseError } from '../handlers/errorFunction'
import { BlogService, UserService } from '../services'
import { IBLOG, IUSER, REQUEST1 } from '../interface';
import { errorCodes } from '../constants/error.codes';
import { createBlogSchema } from '../validator/validation';

export class BlogController {
    private blogService;
    constructor(blogService: BlogService) {
        this.blogService = blogService
    }

    async createBlogController(req: Request, res: Response) {
        try {
            const user: IUSER | null = (req as REQUEST1).user
            if ((user && user.role === 'Admin') || (user && user.role === 'Author')) {
                const userId = (user._id) as string
                const { title, content, likes, dislikes } = req.body
                await createBlogSchema.validate(req.body,{abortEarly:false})
                const blog: IBLOG = await this.blogService.createBlogService(title, userId, content, likes, dislikes);
                res.status(errorCodes.OK).json(blog)
                return
            }
            else if (!user) {
                const message = { "message": "User not found..." }
                res.status(errorCodes.FORBIDDEN).json(message)
            }
            else {
                const message = { "message": "You cannot create a blog..." }
                res.status(errorCodes.FORBIDDEN).json(message)
            }
        }
        catch (error: any) {
            res.status(500).json(error.message)
        }


    }
    async getBlogController(req: Request, res: Response): Promise<void> {
        try {
            let{page,limit,search,likes,dislikes,...filters}:any=req.query;
            page=Number(req.query.page)||1;
            limit=Number(req.query.limit)||4;
            const blogs = await this.blogService.getBlogService(page,limit,search,{...filters})
            res.status(errorCodes.OK).json(blogs)
        }
        catch (error: any) {
            res.status(500).json(error.message)
        }
    }
    async updateBlogController(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const user: IUSER | null = (req as REQUEST1).user;
            const { title, userId, content, likes, dislikes } = req.body
            if (!user) {
                res.status(errorCodes.NOT_FOUND).json({ "message": "User not found..." })
                return
            }
            else {
               
                const updatedBlog:IBLOG|object=await this.blogService.updateBlogService(id, title, userId, content, likes, dislikes,user);
                if(updatedBlog instanceof ErrorHandler){
                     res.status(updatedBlog.statusCode).json(responseError(false,updatedBlog.message,updatedBlog));
                     return
                }
                res.json(updatedBlog);
                return
            }

        }
        catch (error: any) {
            res.status(500).json(error.message)
            return
        }
    }
    async deleteBlogController(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const user: IUSER | null = (req as REQUEST1).user;
            if (!user) {
                res.status(errorCodes.NOT_FOUND).json({ "message": "User not found..." })
                return
            }
            else {
               
                const deletedBlog:IBLOG|object=await this.blogService.deleteBlogService(id,user);
                if(deletedBlog instanceof ErrorHandler){
                     res.status(deletedBlog.statusCode).json(responseError(false,deletedBlog.message,deletedBlog));
                     return
                }
                res.json(deletedBlog);
                return
            }

        }
        catch (error: any) {
            res.status(500).json(error.message)
            return
        }
    }
}

