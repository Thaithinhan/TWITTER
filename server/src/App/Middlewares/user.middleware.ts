import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user.schemas';
import { IErrorValidate } from '../Types/type';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
declare module 'express' {
    export interface Request {
        userId?: string; // hoặc kiểu dữ liệu bạn muốn dùng
        userRole?: number; // hoặc kiểu dữ liệu bạn muốn dùng
    }
}

interface IJwtPayload extends jwt.JwtPayload {
    userId: string;
    userRole: number;
}

//CHECK EMAIL EXITS
export const checkEmailExits = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors: Partial<IErrorValidate> = {}
        const user = await UserModel.findOne({ email: req.body.email });
        if (user) {
            errors.errorEmail = 'Email already exists. Please choose another one.'
            return res.status(400).send(errors)
        }

        next();
    } catch (error) {
        return res.status(500).send({
            error: 'Internal server error.'
        });
    }
}

//CHECK VALIDATE FEILD FROM REGISTER USER 
export const validateRequiredUserBodyFields = (req: Request, res: Response, next: NextFunction) => {
    // Kiểm tra email bằng regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    let errors: Partial<IErrorValidate> = {};

    if (!req.body.email || !emailRegex.test(req.body.email)) {
        errors.errorEmail = 'Please enter a valid email address';
    }

    if (!req.body.password || req.body.password.length < 8) {
        errors.errorPassword = 'Please enter a valid password with at least 8 characters';
    }

    if (!req.body.fullname || req.body.fullname.length < 6) {
        errors.errorFullname = 'Please enter a valid fullname with at least 6 characters';
    }

    if (!req.body.username || req.body.username.length < 6) {
        errors.errorUsername = 'Please enter a valid username with at least 6 characters';
    }
    if (Object.keys(errors).length > 0) {
        return res.status(400).send(errors);
    }
    next()
}

//CHECK AUTHENTICATION 
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1] || ""

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        // console.log("token abc", token)
        if (!token) {
            return res.status(401).json({ error: 'Access token not found' });
        }
        try {
            const decoded = jwt.verify(token, JWT_SECRET_KEY) as IJwtPayload;
            req.userId = decoded.userId;
            req.userRole = decoded.userRole;
            next();
        } catch (error) {
            console.log(error);
            return res.sendStatus(403);
        }

    });
};

// CHECK AUTHORIZATION
export const authorizeRole = (requiredRole: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.userRole === requiredRole) {
            next();
        } else {
            res.status(403).send({ error: 'Access denied.' });
        }
    };
};