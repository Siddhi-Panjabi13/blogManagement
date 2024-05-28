import mongoose from 'mongoose'
import dotenv from 'dotenv';
import { connect } from "http2";
dotenv.config()
const URL=process.env.CONNECTION_URL||''

const connectDb=async()=>{
    try{
        await mongoose.connect(URL);
        console.log("Connected  to the database successfully...")
    }
    catch(error){
        console.log("Connection to the database failed...")
        process.exit(1);
    }
}

export {connectDb}