import {Request, Response, NextFunction} from 'express';
import { IUSER,REQUEST1 } from '../interface';
import { ErrorHandler } from '../handlers/errorHandler';
import { responseError } from '../handlers/errorFunction';
export const verifyAdmin=async(req:Request, res:Response, next:NextFunction)=>{
    const user:IUSER|null=(req as REQUEST1).user;
    if (!user) {
        const message = "User not found"
        const error = new ErrorHandler(message, 404)
        return res.status(error.statusCode).json(responseError(false, message, error));
    }
    if(user.role==="Admin"){
        next();
    }
    else{
        const message = "You donot have access to this functionality..."
                const error = new ErrorHandler(message, 403)
               return  res.status(error.statusCode).json(responseError(false,message, error));
    }
}

export const verifyAuthor=async(req:Request, res:Response, next:NextFunction)=>{
    const user:IUSER|null=(req as REQUEST1).user;
    if (!user) {
        const message = "User not found"
        const error = new ErrorHandler(message, 404)
        return res.status(error.statusCode).json(responseError(false, message, error));
    }
    if(user.role==="Author"){
        next();
    }
    else{
        const message = "You donot have access to this functionality..."
                const error = new ErrorHandler(message, 403)
               return  res.status(error.statusCode).json(responseError(false,message, error));
    }
}