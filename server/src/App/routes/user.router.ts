import { Router } from 'express';

import UserController from '../Controllers/user.controller';
import upload from '../Middlewares/multer.middleware';
import {
    authenticateJWT, authorizeRole, checkEmailExits, validateRequiredUserBodyFields
} from '../Middlewares/user.middleware';

const userRouter = Router()

//Get 

userRouter.get("/", UserController.getAllUsers) //Get all users
userRouter.get('/current-user', authenticateJWT, UserController.getCurrentUser);
userRouter.get('/admin', authenticateJWT, authorizeRole(1), UserController.getAdminPage);
userRouter.get('/search', UserController.searchUsers);
userRouter.get('/:id', authenticateJWT, UserController.getUserById); //Get user by id

//REGISTER
userRouter.post("/", checkEmailExits, validateRequiredUserBodyFields, UserController.registerUser)
//LOGIN 
userRouter.post("/login", UserController.login)
userRouter.post("/logout", UserController.logout)
//MAKE NEW ACCESSTOKEN
userRouter.post('/refresh-token', UserController.createNewAccessToken);
//UPDATE USER 
userRouter.patch("/update-user", authenticateJWT, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover_photo', maxCount: 1 }]), UserController.updateUser)
//Update USER STATUS 
userRouter.patch("/status/:id", UserController.updateUserStatus)

export default userRouter