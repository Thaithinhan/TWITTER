

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import { passportConfig } from '../Configs/passport.config';
import connectDB from '../Libraries/Database/db.connect';
import followRouter from './routes/follow.router';
import googleRouter from './routes/googleAuth.router';
import notificationRouter from './routes/notification.router';
import tweetRouter from './routes/tweet.router';
import userRouter from './routes/user.router';

dotenv.config()
const app = express();

// Middlewares
app.use(cookieParser())
app.use(cookieSession({
    name: 'session',
    keys: ['googleOauth'],
    maxAge: 48 * 60 * 60 * 100
}))
app.use(passportConfig.initialize())
app.use(passportConfig.session())
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5100"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 200
}));
const staticPath = path.join(__dirname, '../../public');
app.use(express.static(staticPath));


app.use(morgan("dev"));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes (bạn có thể thêm routes của mình tại đây)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/follow", followRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/notifications", notificationRouter)
app.use('/api/v1/google', googleRouter);

//Connect Database
connectDB()

//Handle Error

export default app;
