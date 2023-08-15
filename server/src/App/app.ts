import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import connectDB from '../Libraries/Database/db.connect';
import followRouter from './routes/follow.router';
import tweetRouter from './routes/tweet.router';
import userRouter from './routes/user.router';

const app = express();

// Middlewares
const staticPath = path.join(__dirname, '../../public');
app.use(express.static(staticPath));

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5100"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config()

// Routes (bạn có thể thêm routes của mình tại đây)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/follow", followRouter)
app.use("/api/v1/tweets", tweetRouter)

//Connect Database
connectDB()

//Handle Error

export default app;
