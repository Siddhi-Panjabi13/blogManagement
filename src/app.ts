import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connectDb } from './config/connection';
import { userRouter,blogRouter,commentRouter } from './routes';
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cookieParser()); 
app.use(express.json())
app.use(urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/comments',commentRouter) 
connectDb().then(() => {
    app.listen((PORT), () => {
        console.log("Server is running on port ", PORT)
    })
}).catch((error) => {
    console.log(error.message);
})