import {
  createSlice,
} from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationSlice =
  createSlice({
    name: "notification",

    initialState,

    reducers: {

      notificationStart:
        (state) => {

          state.loading = true;
          state.error = null;

        },

      setNotifications:
        (
          state,
          action
        ) => {

          state.loading = false;

          state.notifications =
            action.payload.map(
              notification => ({
                notificationId:
                  notification._id,
                projectId:
                  notification.project?._id,

                projectCode:
                  notification.project?.projectCode,

                projectTitle:
                  notification.project?.title,

                message:
                  notification.message,

                type:
                  notification.type,

                isRead:
                  notification.isRead,

                createdAt:
                  notification.createdAt,
              })
            );
        },

      markNotificationRead:
        (
          state,
          action
        ) => {

          const notification =
            state.notifications.find(
              notification =>
                notification.notificationId ===
                action.payload
            );

          if (
            notification
          ) {

            notification.isRead =
              true;

          }
        },

      notificationFailure:
        (
          state,
          action
        ) => {

          state.loading = false;

          state.error =
            action.payload;

        },

    },

        markAllNotificationsRead:
            state => {

              state.notifications.forEach(
                notification => {

                  notification.isRead =
                    true;

                }
              );

        },
  });

export const {

  notificationStart,

  setNotifications,

  markNotificationRead,

  notificationFailure,

  markAllNotificationsRead

} =
  notificationSlice.actions;

export default
notificationSlice.reducer;