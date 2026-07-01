import Notification from "../models/notification.js";
import AppError from "../utils/appError.js";

export const createNotification = async ({
  projectId,
  recipientId,
  type,
  message,
}) => {
  const notification = new Notification({
    project: projectId,
    recipient: recipientId,
    type,
    message,
  });

  return await notification.save();
};


export const fetchNotificationsService = async (userId) => {
  const notifications = await Notification.find({
    recipient: userId,
  })
    .populate(
      "project",
      "projectCode title createdBy"
    )
    .sort({
      createdAt: -1,
    });

  return notifications;
};

export const markNotificationReadService = async (
  notificationId,
  userId
) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw new AppError(
      "Notification not found",
      404
    );
  }

  notification.isRead = true;

  await notification.save();

  return notification;
};

export const markAllNotificationsReadService = async (
  userId
) => {
  await Notification.updateMany(
    {
      recipient: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );
};