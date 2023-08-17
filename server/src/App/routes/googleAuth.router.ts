import express from 'express';

import GoogleController from '../Controllers/google.controller';

const googleRouter = express.Router();

// Đăng nhập bằng Google
googleRouter.get('/auth/google', GoogleController.login);

// Xử lý callback sau khi đăng nhập thành công
googleRouter.get('/auth/google/callback', GoogleController.callback);

export default googleRouter;
