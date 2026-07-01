import {
  useNavigate,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/reduxHooks";

import {
  readNotification,
} from "../../features/notifications/notificationThunk.js";

const NotificationCard =
  ({ notification }) => {

    const navigate =
      useNavigate();

    const dispatch =
      useAppDispatch();

    const { token } =
      useAppSelector(
        state => state.auth
      );

    const handleClick =
      async () => {

        if (
          !notification.isRead
        ) {

          await dispatch(
            readNotification(
              notification.notificationId,
              token
            )
          );

        }

        navigate(
          `/projects/${notification.projectCode}`
        );
      };

    return (

      <div
        className={`notification-card ${
          !notification.isRead
            ? "unread"
            : ""
        }`}
        onClick={handleClick}
      >

        <div className="notification-card-header">

          <h4>
            {notification.message}
          </h4>

          {!notification.isRead && (
            <span className="notification-dot">
              ●
            </span>
          )}

        </div>

        <p>
          {
            notification.projectTitle
          }
        </p>

      </div>

    );
};

export default NotificationCard;