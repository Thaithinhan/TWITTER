import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

class GoogleController {
    static login(req: Request, res: Response, next: NextFunction): void {
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })(req, res, next);
    }

    static callback(req: Request, res: Response, next: NextFunction): void {
        passport.authenticate('google', {
            successRedirect: '/profile', // Đổi thành đường dẫn bạn muốn
            failureRedirect: '/' // Đổi thành đường dẫn bạn muốn cho trường hợp đăng nhập thất bại
        })(req, res, next);
    }
}

export default GoogleController;
