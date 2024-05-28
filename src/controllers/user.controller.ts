import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { errorCodes, errorMessage } from "../constants/error.codes";
import { ErrorHandler } from "../handlers/errorHandler";
import { responseError } from "../handlers/errorFunction";
import { REQUEST1 } from "../interface/request1.interface";
import { IUSER } from "../interface";
import { createUserSchema } from "../validator/validation";
import { object } from "yup";
// import session from "express-session";
import "express-session";

declare module "express-session" {
  interface SessionData {
    user: {
      email: string;
    };
  }
}
interface GetUserResponse {
  token: string;
  // Add other properties if they exist
  [key: string]: any;
}

export class UserController {
  private userService;
  constructor(userService: UserService) {
    this.userService = userService;
  }
  async createUserController(req: Request, res: Response) {
    try {
      const { userName, email, password, role } = req.body;
      await createUserSchema.validate(req.body,{abortEarly:false});
      const user = await this.userService.createUserService(
        userName,
        email,
        password,
        role
      );
      res.status(errorCodes.OK).json(user);
      return;
    } catch (error: any) {
      res.json(500).json(error.message);
      return;
    }
  }
  async findUsersController(req: Request, res: Response) {
    try {
      const users = await this.userService.findUsersService();
      res.status(errorCodes.OK).json(users);
      return;
    } catch (error: any) {
      res.json(500).json(error.message);
      return;
    }
  }

  async updateUserController(req: Request, res: Response): Promise<void> {
    try {
      const user: IUSER | null = (req as REQUEST1).user;
      const { id } = req.params;
      const { userName, email, password, role } = req.body;
      if (!user) {
        res.status(errorCodes.NOT_FOUND).json({ message: "User not found" });
        return;
      }
      const updatedUser = await this.userService.updateUserService(
        id,
        userName,
        password,
        role,
        email,
        user
      );
      if (updatedUser instanceof ErrorHandler) {
        res
          .status(updatedUser.statusCode)
          .json(responseError(false, updatedUser.message, updatedUser));
        return;
      }
      res.status(errorCodes.OK).json(updatedUser);
      return;
    } catch (error: any) {
      res.status(500).json(error.message);
      return;
    }
  }

  async deleteUserController(req: Request, res: Response): Promise<void> {
    try {
      const user: IUSER | null = (req as REQUEST1).user;
      const { id } = req.params;
      if (!user) {
        res.status(errorCodes.NOT_FOUND).json({ message: "User not found" });
        return;
      }
      const deletedUser = await this.userService.deleteUserService(id, user);
      if (deletedUser instanceof ErrorHandler) {
        res
          .status(deletedUser.statusCode)
          .json(responseError(false, deletedUser.message, deletedUser));
        return;
      }
      res.status(errorCodes.OK).json(deletedUser);
      return;
    } catch (error: any) {
      res.status(500).json(error.message);
      return;
    }
  }
  async userLoginController(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const getuser: GetUserResponse | object =
        await this.userService.userLoginService(email, password);

      if (getuser instanceof ErrorHandler) {
        res
          .status(getuser.statusCode)
          .json(responseError(false, getuser.message, getuser));
        return;
      }

      const token: string = (getuser as GetUserResponse).token;
      res.cookie("jwt", token,{
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      }).json({token,email,"message":"User logged-in successfully"});
      // res.json({"message":"User logged-in successfully"});
      return;
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }
  }
  async userLogoutController(req:Request,res:Response):Promise<void>{
    res.clearCookie('jwt');
    res.json('User logged out successfully...');
  }
}
