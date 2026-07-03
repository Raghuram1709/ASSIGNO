import {

  fetchNotificationsAPI,

  markNotificationReadAPI,

  markAllNotificationsReadAPI

} from "./notificationAPI";

import {notificationStart,
    setNotifications,
    markNotificationRead,
    notificationFailure,
    markAllNotificationsRead
    
} from "./notificationSlice";

export const fetchNotifications = (token) => async (dispatch) => {

    try {

      dispatch(
        notificationStart()
      );

      const response =
        await fetchNotificationsAPI(
          token
        );

      dispatch(
        setNotifications(
          response.notifications
        )
      );

    } catch (error) {

      dispatch(
        notificationFailure(
          error.response?.data
            ?.message ||
          "Failed to fetch notifications"
        )
      );
    }
};

export const readNotification =
  (
    notificationId,
    token
  ) =>
  async (dispatch) => {

    try {

      await markNotificationReadAPI(
        notificationId,
        token
      );

      dispatch(
        markNotificationRead(
          notificationId
        )
      );

      // Trigger notification fetch to refresh feeds
      dispatch(fetchNotifications(token));

    } catch (error) {

      dispatch(
        notificationFailure(
          error.response?.data
            ?.message ||
          "Failed to update notification"
        )
      );
    }
};


export const readAllNotifications =
  token =>
  async dispatch => {

    try {

      await markAllNotificationsReadAPI(
        token
      );

      dispatch(
        markAllNotificationsRead()
      );

      // Trigger notification fetch to refresh feeds
      dispatch(fetchNotifications(token));

    } catch (error) {

      dispatch(
        notificationFailure(
          error.response?.data
            ?.message ||
          "Failed to mark all notifications read"
        )
      );

    }
};