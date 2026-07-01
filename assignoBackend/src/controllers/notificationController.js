import {
  fetchNotificationsService,
  markNotificationReadService,
  markAllNotificationsReadService
} from "../services/notificationService.js";

export const fetchNotificationsController = async (req, res, next ) => {
    console.log(
  "Logged User:",
  req.user
);
    try {

      const notifications =
        await fetchNotificationsService(
          req.user.id
        );

      return res.status(200).json({
        success: true,
        notifications,
      });

    } catch (error) {

      next(error);

    }
  };

export const markNotificationReadController = async ( req, res, next ) => {

    try {

      const {
        notificationId,
      } = req.params;

      const notification =
        await markNotificationReadService(
          notificationId,
          req.user.id
        );

      return res.status(200).json({
        success: true,
        notification,
      });

    } catch (error) {

      next(error);

    }
  };

  export const markAllNotificationsReadController =
  async (
    req,
    res,
    next
  ) => {

    try {

      await markAllNotificationsReadService(
        req.user.id
      );

      return res
        .status(200)
        .json({
          success: true,
        });

    } catch (error) {

      next(error);

    }
};