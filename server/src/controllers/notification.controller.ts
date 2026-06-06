import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { Notification } from '../models/notification.model';

class NotificationController {
  /** GET /notifications */
  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const notifications = await Notification.find({ userId: req.user!.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(ApiResponse.ok('Notifications fetched', notifications));
  });

  /** PATCH /notifications/read-all */
  markAllRead = asyncHandler(async (req: Request, res: Response) => {
    await Notification.updateMany(
      { userId: req.user!.userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.json(ApiResponse.ok('All notifications marked as read'));
  });
}

export const notificationController = new NotificationController();
