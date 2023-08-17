import { Request, Response } from 'express';

import NotificationModel from '../models/notification.schemas';

class NotificationController {
    static async getUserNotifications(req: Request, res: Response) {
        try {
            const userId = req.userId;

            const notifications = await NotificationModel.find({ receiverId: userId })
                .sort({ createdAt: -1 })
                .populate('senderId') // Sử dụng populate để lấy thông tin của người gửi
                .exec();
            res.status(200).json({ success: true, notifications });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
        }
    }
}

export default NotificationController;
