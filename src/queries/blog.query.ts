import { Blog } from "../models";
import { IBLOG } from "../interface";

export class BlogQuery {
  async createBlogQuery(
    title: string,
    userId: string,
    content: string,
    likes: string,
    dislikes: string
  ): Promise<IBLOG> {
    const blog = await Blog.create({ title, userId, content, likes, dislikes });
    return blog;
  }
  async getBlogQuery(): Promise<IBLOG[]> {
    const blogs: IBLOG[] = await Blog.find({});
    return blogs;
  }
  async updateBlogQuery(id: string, obj: object): Promise<IBLOG | null> {
    const updateBlog: IBLOG | null = await Blog.findByIdAndUpdate(id, obj,{new:true});
    return updateBlog;
  }
  async deleteBlog(id: string): Promise<IBLOG | null> {
    const blog: IBLOG | null = await Blog.findByIdAndDelete(id);
    return blog;
  }
  async findBlogByUser(id:string,uid:string):Promise<IBLOG|null>{
    const blog:IBLOG|null=await Blog.findOne({_id:id,userId:uid})
    return blog;
  }
  async findBlogById(id:string):Promise<IBLOG|null>{
    const blog:IBLOG|null=await Blog.findOne({_id:id})
    return blog;
  }
}
