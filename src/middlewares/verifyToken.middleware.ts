import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { IPAYLOAD, IUSER } from '../interface';
import { errorCodes } from '../constants/error.codes';
import { responseError } from '../handlers/errorFunction';
import { ErrorHandler } from '../handlers/errorHandler';

const secretKey = process.env.SECRET_KEY || ''

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    // console.log(req);
    try {

        if (!token) {
            const message = "Token not found"
            const error = new ErrorHandler(message, errorCodes.FORBIDDEN)
            return res.status(error.statusCode).json(responseError(false, message, error));
        }

        jwt.verify(token, secretKey, (err: any, decoded: IPAYLOAD | string | undefined) => {
            if (err) {
                const message: string = "Unauthorized User..."
                const error = new ErrorHandler(message, 401)
                return res.status(error.statusCode).json(responseError(false, message, error));
            }
            else {
                if (decoded !== undefined && typeof decoded !== 'string') {
                    const email = decoded.email;
                    const user = User.find({ email: email })
                    if (!user) {
                        const message = "User not found"
                        const error = new ErrorHandler(message, 404)
                        return res.status(error.statusCode).json(responseError(false, message, error));
                    }
                    else {
                        (req as IPAYLOAD).user = decoded
                        next();
                    }
                }

            }
        });
    }
    catch (error: any) {

        res.status(500).json(error.message)
    }

}