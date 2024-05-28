import { User } from "../models";
import { IUSER } from "../interface";

export class UserQuery {

    async createUserQuery(userName: string, email: string, password: string, role: string): Promise<IUSER> {
        const user: IUSER = await User.create({ userName, email, password, role });
        return user
    }
    async findUsersQuery():Promise<IUSER[]>{
        const users=await User.find({});
        return users;
    }
    async findUserById(id:string):Promise<IUSER|null>{
        const user:IUSER|null=await User.findById(id);
        return user;
    }
    async updateUserQuery(id:string,obj:object){
        const user=await User.findByIdAndUpdate(id,obj,{new:true})
        return user;
    }
    async findUserByMail(value:string){
        const user:IUSER|null=await User.findOne({email:value})
        return user
    }
    async deleteUserQuery(id:string){
        const user:IUSER|null=await User.findByIdAndDelete(id)
        return user
    }
}