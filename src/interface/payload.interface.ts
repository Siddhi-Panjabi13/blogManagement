import { JwtPayload } from "jsonwebtoken"

export interface IPAYLOAD extends JwtPayload{
    userName?:string,
    _id?:string,
    role?:string,
    email?:string,
    iat?:number,
    exp?:number
}