import * as yup from 'yup';
import { Blog,User,Comment } from '../models';
import mongoose from 'mongoose';

const createUserSchema=yup.object({
    userName:yup.string().required('Enter the username').test('unique-name','Username must be unique',async function(value){
        const user=await User.findOne({userName:value})
        return !user;
    }),
    email:yup.string().email().required('Email is mandatory').test('unique-mail','Email must be unique',async function(value){
        const user=await User.findOne({email:value})
        return !user;
    }),
    password:yup.string().required('Enter the password...')
});
const createBlogSchema=yup.object({
    title:yup.string().required('Enter the title...').test('unique-blog','Blog name already exists...',async function(value){
        const blog=await Blog.findOne({title:value})
        return !blog
    }),
    content:yup.string().required('Enter the content of the blog...'),
    likes:yup.number(),
    dislikes:yup.number()
})
const createCommentSchema=yup.object({
    blogId:yup.string().required('Enter the blog-id').test('isvalid-blog','Enter a valid blog-id', async function(value){
        if(!mongoose.Types.ObjectId.isValid(value)){
            return false
        }
        const blog=await Blog.findOne({_id:value});
        return !blog
    }),
    likes:yup.number(),
    dislikes:yup.number(),
    content:yup.string().required('Enter the comment')
})

export{createUserSchema,createBlogSchema};