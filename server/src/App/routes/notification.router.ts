import { Router } from 'express';

import NotificationController from '../Controllers/notification.controller';
import { authenticateJWT } from '../Middlewares/user.middleware';

const notificationRouter = Router()

notificationRouter.get("/", authenticateJWT, NotificationController.getUserNotifications)

export default notificationRouter