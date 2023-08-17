import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user.schemas';
import { IUser, UploadFiles } from '../Types/type';
import sendRegistrationEmail from '../Utils/mailer';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
const JWT_SECRET_KEY_REFRESH_TOKEN = process.env.JWT_SECRET_KEY_REFRESH_TOKEN || "";
let refreshTokenArr: any[] = []

class UserController {

    //Register user
    static async registerUser(req: Request, res: Response) {
        try {
            const hashPassword = await bcrypt.hash(req.body.password, 10)
            const user = new UserModel({
                ...req.body, password: hashPassword
            })
            const newUser = await user.save()
            await sendRegistrationEmail(newUser)
            const users = await UserModel.find()
            return res.status(201).send({ message: "Registered successfully", users: users });
        } catch (error) {
            return res.status(500).send(error);
        }
    }
    //LOGIN USER 
    static async login(req: Request, res: Response) {
        const { email, password } = req.body
        console.log(email, password)
        // Check user is already existing
        try {
            const user = await UserModel.findOne({ email });
            if (!user) return res.status(400).send({ error: 'Invalid email or password.' });

            // So sánh mật khẩu nhập vào với mật khẩu mã hóa trong cơ sở dữ liệu
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).send({ error: 'Invalid email or password.' });

            // Tạo và gửi accessToken
            const accessToken = jwt.sign(
                {
                    userId: user._id,
                    userRole: user.role
                },
                JWT_SECRET_KEY,
                { expiresIn: '2d' } // Hạn dùng của token
            );
            const refreshToken = jwt.sign(
                {
                    userId: user._id,
                    userRole: user.role
                },
                JWT_SECRET_KEY_REFRESH_TOKEN,
                { expiresIn: '7d' } // Hạn dùng của Refresh Token, bạn có thể điều chỉnh thời gian tùy ý
            );
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true, // Chỉ gửi cookie qua HTTPS
                sameSite: 'none' // Để làm việc với các domain khác (cross-site)
            });
            refreshTokenArr.push(refreshToken) // push refresh token vào 1 mảng để lưu trữ
            // Loại bỏ trường password trước khi gửi user
            const userResponse: Partial<IUser> = user.toObject()
            delete userResponse.password
            return res.status(200).send({ accessToken, user: userResponse });
        } catch (error) {
            console.log('login', error);
        }
    }
    // CREATE NEW ACCESS TOKEN
    static createNewAccessToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).send({ error: 'Refresh token not found.' });
        }
        if (!refreshTokenArr.includes(refreshToken)) {
            return res.status(401).json("Unauthenticated")
        }
        jwt.verify(refreshToken, JWT_SECRET_KEY_REFRESH_TOKEN, (err: any, decoded: any) => {
            if (err) {
                return res.status(403).send({ error: 'Invalid refresh token.' });
            }
            const { iat, exp, ...userOther } = decoded
            console.log(decoded);
            refreshTokenArr = refreshTokenArr.filter(token => token !== refreshToken) //lọc ra những thằng cũ, nếu đúng thì nó sẽ tạo accessToken mới và cả refreshToken mới
            const newAccessToken = jwt.sign(
                {
                    userId: decoded.userId,
                    userRole: decoded.userRole
                },
                JWT_SECRET_KEY,
                { expiresIn: '2d' } // Hạn dùng của Access Token
            );
            const newRefreshToken = jwt.sign(
                {
                    userId: decoded.userId,
                    userRole: decoded.userRole
                },
                JWT_SECRET_KEY_REFRESH_TOKEN,
                { expiresIn: '7d' } // Hạn dùng của Access Token
            );
            refreshTokenArr.push(newRefreshToken)
            res.cookie("refreshToken", newRefreshToken, { //Lưu NewrefreshToken vào cookie khi reset thành công 
                httpOnly: true,
                secure: true,
                sameSite: "none"
            })
            return res.status(200).json(newAccessToken);
        });
    }
    //GET ALL USERS 
    static async getAllUsers(req: Request, res: Response) {
        try {
            const page: number = Number(req.query.page) || 1;  // trang mặc định là 1
            const limit: number = Number(req.query.limit) || 10; // số lượng mặc định trên mỗi trang là 10
            const skip: number = (page - 1) * limit;

            const users = await UserModel.find({ role: 0 }).skip(skip).limit(limit);

            // Lấy số lượng tất cả người dùng để tính toán tổng số trang
            const totalUsers: number = await UserModel.countDocuments();
            const totalPages: number = Math.ceil(totalUsers / limit);

            return res.status(200).send({
                data: users,
                meta: {
                    currentPage: page,
                    perPage: limit,
                    totalUsers: totalUsers,
                    totalPages: totalPages
                }
            });
        } catch (error) {
            return res.status(500).send(error);
        }
    }

    //UPDATE USER CURENT
    static async updateUser(req: Request, res: Response) {
        try {
            const userId = req.userId; // Get this from your JWT or session

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(400).send({ error: 'User not found.' });
            }
            const files = req.files as UploadFiles
            if (files) {
                if (files['avatar']) {
                    const avatarUrl = `http://localhost:8000/images/${files['avatar'][0].filename}`;
                    user.avatar = avatarUrl;
                }

                if (files['cover_photo']) {
                    const coverUrl = `http://localhost:8000/images/${files['cover_photo'][0].filename}`;
                    user.cover_photo = coverUrl;
                }
            }
            // Update fullname if provided
            if (req.body.fullname) {
                user.fullname = req.body.fullname;
            }

            // Update username if provided
            if (req.body.username) {
                user.username = req.body.username;
            }
            await user.save();

            return res.send({ user });
        } catch (error) {
            return res.status(500).send({ error: 'Server error.' });
        }
    }

    // GET CURRENTLY LOGGED-IN USER
    static async getCurrentUser(req: Request, res: Response) {

        try {
            const userId = req.userId; // Get this from your JWT middleware
            // console.log(111111, req.userId);
            // Sử dụng ID người dùng từ JWT token
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).send({ error: 'User not found.' });
            }

            // Loại bỏ trường password trước khi gửi user
            const userResponse: Partial<IUser> = user.toObject();
            delete userResponse.password;

            return res.status(200).send({ user: userResponse });
        } catch (error) {
            return res.status(500).send({ error: 'Server error.' });
        }
    }
    // GET USER BY ID
    static async getUserById(req: Request, res: Response) {
        // console.log("req", req.userId)
        try {
            const userId = req.params.id; // Lấy ID từ URL

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).send({ error: 'User not found.' });
            }
            // Loại bỏ trường password trước khi gửi user
            const userResponse: Partial<IUser> = user.toObject();
            delete userResponse.password;

            return res.status(200).send({ user: userResponse });
        } catch (error) {
            return res.status(500).send({ error: 'Server error.' });
        }
    }
    //GET ADMIN PAGE
    static getAdminPage(req: Request, res: Response) {
        // Kiểm tra role của người dùng từ req.userRole (được đặt trong middleware)
        if (req.userRole === 1) {
            // Trả về trang admin nếu người dùng có quyền
            return res.status(200).send('Welcome to admin page');
        } else {
            // Trả về lỗi nếu người dùng không có quyền
            return res.status(403).send({ error: 'Access denied.' });
        }
    }
    // UPDATE USER STATUS BY ID
    static async updateUserStatus(req: Request, res: Response) {
        try {
            const userId = req.params.id; // Lấy ID từ URL
            const newStatus = req.body.status

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).send({ error: 'User not found.' });
            }
            // Cập nhật trạng thái người dùng
            user.status = newStatus;
            await user.save();
            // Trả về thông tin người dùng đã cập nhật
            const updatedUserResponse: Partial<IUser> = user.toObject();
            delete updatedUserResponse.password;
            return res.status(200).send({ user: updatedUserResponse });
        } catch (error) {
            return res.status(500).send({ error: 'Server error.' });
        }
    }
    // SEARCH USERS BY STRING (Email or Username)
    static async searchUsers(req: Request, res: Response) {
        try {
            const { query } = req.query;

            if (!query) {
                return res.status(400).send({ error: 'Search query is required.' });
            }
            // Tìm người dùng dựa trên email hoặc tên người dùng
            const users: IUser[] = await UserModel.find({
                $or: [
                    { email: { $regex: query, $options: 'i' } }, // Tìm kiếm email có chứa chuỗi search (không phân biệt hoa thường)
                    { username: { $regex: query, $options: 'i' } }, // Tìm kiếm tên người dùng có chứa chuỗi search (không phân biệt hoa thường)
                ],
            });
            // Loại bỏ trường password 
            const usersResponse: Partial<IUser>[] = users.map((user) => {
                const userObj: Partial<IUser> = user.toObject();
                delete userObj.password;
                return userObj;
            });

            return res.status(200).send({ users: usersResponse });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'Server error.' });
        }
    }
    static async logout(req: Request, res: Response) {
        res.clearCookie("refreshToken");
        refreshTokenArr = refreshTokenArr.filter(
            (token) => token !== req.cookies.refreshToken
        );
        res.status(200).json("Logout successfully");
    }
}
export default UserController

