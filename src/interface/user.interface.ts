import mongoose,{Document} from 'mongoose'
export interface IUSER extends Document{
    userName:string,
    email:string,
    password:string,
    role:string
}
