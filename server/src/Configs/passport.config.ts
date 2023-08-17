import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import UserModel from '../App/models/user.schemas';
import { IUser } from '../App/Types/type';

dotenv.config()
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: IUser, done) => {
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            callbackURL: "http://localhost:3000/auth/google/callback",
            scope: ["profile", "email"]
        },
        async (accessToken: string, refreshToken: string, profile, done) => {
            try {
                let user = await UserModel.findOne({ email: profile.emails?.[0]?.value });

                if (!user) {
                    // Tạo thông tin người dùng mới nếu chưa tồn tại
                    user = await UserModel.create({
                        fullname: profile.displayName,
                        email: profile.emails?.[0]?.value,
                        // Loại bỏ phần password
                        password: '',
                        status: 0,
                        email_verify_token: '',
                        forgot_password_token: '',
                        verify: 0,
                        role: 0,
                        avatar: profile.photos?.[0]?.value || '',
                        cover_photo: 'https://hocnhanh.vn/wp-content/uploads/2022/02/ultimate-guide-to-your-twitter-header-size-and-cover-photo-twitter-600x240.png'
                    });
                }

                // Thêm thông tin userRole và userId vào access token
                const payload = {
                    userId: user._id, // userId
                    userRole: user.role // userRole
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, { expiresIn: '2d' });

                done(null, { user, token });
            } catch (error: any) {
                done(error);
            }
        }
    )
);
export const passportConfig = passport;
