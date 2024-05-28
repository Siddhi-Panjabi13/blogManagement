import express from "express";
import { UserController } from "../controllers/user.controller";
import { UserQuery } from "../queries/user.query";
import { UserService } from "../services/user.service";
import {Request, Response,NextFunction} from 'express'
import { verifyToken } from "../middlewares/verifyToken.middleware";
const router=express.Router();
const userQuery=new UserQuery();
const userService=new UserService(userQuery);
const userController=new UserController(userService)

router.post('/createUser',(req:Request,res:Response)=>userController.createUserController(req,res));
router.get('/getUsers',(req:Request,res:Response)=>userController.findUsersController(req,res));
router.post('/login',(req:Request,res:Response)=>userController.userLoginController(req,res));
router.patch('/updateUser/:id',[verifyToken],(req:Request,res:Response)=>userController.updateUserController(req,res))
router.delete('/deleteUser/:id',[verifyToken],(req:Request,res:Response)=>userController.deleteUserController(req,res))
router.post('/logout',[verifyToken],(req:Request,res:Response)=>userController.userLogoutController(req,res))
export default router;