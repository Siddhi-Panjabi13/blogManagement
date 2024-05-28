import { User, Blog, Comment } from "../models";
import { IUSER, IPAYLOAD, IBLOG } from "../interface";
import { UserQuery } from "../queries/user.query";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken'
import { ErrorHandler } from "../handlers/errorHandler";
import { errorCodes } from "../constants/error.codes";

export class UserService {
    private userQuery;
    constructor(userQuery: UserQuery) {
        this.userQuery = userQuery;
    }
    async createUserService(userName: string, email: string, password: string, role: string): Promise<IUSER> {
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        password = hashedPassword
        const user = await this.userQuery.createUserQuery(userName, email, password, role);

        return user;
    }
    async findUsersService(): Promise<IUSER[]> {
        const users = await this.userQuery.findUsersQuery();
        return users;
    }
    async updateUserService(id: string, userName: string, password: string, role: string, email: string, user: IUSER): Promise<IUSER | object> {
        if ((user._id == id && user.role === "User") || (user.role === "Admin")) {
            if (password) {
                const salt = 10;
                password = await bcrypt.hash(password, salt)
            }
            let obj = { userName, password, role, email }

            const updatedUser: IUSER | null = await this.userQuery.updateUserQuery(id, obj);
            if (!updatedUser) {
                return (new ErrorHandler("User not found", errorCodes.NOT_FOUND))
            }
            return updatedUser
        }
        else {
            return (new ErrorHandler('You donot have right to update detail of other users', errorCodes.FORBIDDEN))
        }

    }
    async deleteUserService(id: string, user: IUSER): Promise<IUSER | object> {
        let session;
        try {
        if ((user._id == id && user.role === "User") || (user.role === "Admin")) {
            
           
                session = await User.startSession();
                session.startTransaction();
                const blogs: IBLOG[] = await Blog.find({ userId: id });
                if (blogs.length == 0) {
                    await User.deleteOne({ _id: id });
                    await session.commitTransaction();
                    session.endSession();
                    return {'message':'User deleted successfully...'};
                } else {
                    const comments = await Comment.find({ userId: id });
                    if (comments.length == 0) {
                        for (const blog of blogs) {
                            await Comment.deleteMany({ blogId: blog._id });
                            await Blog.deleteOne({ userId: id });
                        }
                        await User.deleteOne({ _id: id });
                        await session.commitTransaction();
                        session.endSession();
                        return {'message':'User along with his blog deleted successfully...'};
                    }
                    else {
                        await Comment.deleteMany({ userId: id });
                        for (const blog of blogs) {
                            await Comment.deleteMany({ blogId: blog._id });
                            await Blog.deleteOne({ userId: id });
                        }
                        await User.deleteOne({ _id: id });
                        await session.commitTransaction();
                        session.endSession();
                        return {'message':'User along with his blog and comments deleted successfully...'};

                    }
            }
            
         }
        else {
            return (new ErrorHandler('You donot have right to delete detail of other users', errorCodes.FORBIDDEN))
        }}
        catch(error:any){
            if (session) {
                await session.abortTransaction();
                session.endSession();
            }
            return new ErrorHandler(error.message,errorCodes.INTERNAL_SERVER_ERROR)
        }

    }
    async userLoginService(email: string, password: string): Promise<object> {
        const user: IUSER | null = await this.userQuery.findUserByMail(email);
        if (!user) {
            return new ErrorHandler("User not found", errorCodes.NOT_FOUND)
        }
        const matchPassword = bcrypt.compareSync(password, user.password);
        if (!matchPassword) {
            return new ErrorHandler("Invalid Password", errorCodes.UNAUTHORIZED);
        }
        const secretKey = process.env.SECRET_KEY || '';
        const userName: string = user.userName;
        const role: string = user.role;
        const _id: string = (user._id) as string;
        // const payload:IPAYLOAD={userName,email,role,_id}
        const token = jwt.sign({ userName, email, role, _id }, secretKey, { expiresIn: 1200 });

        const message = { "message": "Login successful" }
        const getUser = {
            ...message,
            token,
            userName,
            role,
            email
        }
        return getUser
    }
}