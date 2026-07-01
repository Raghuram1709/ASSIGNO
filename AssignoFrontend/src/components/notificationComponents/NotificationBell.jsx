import { FaBell }
from "react-icons/fa";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/reduxHooks.js"

const NotificationBell =
  ({ onClick }) => {

    const {
      notifications,
    } = useAppSelector(
      state =>
        state.notification
    );

    const unreadCount =
      notifications.filter(
        notification =>
          !notification.isRead
      ).length;

    return (

      <div
        className="notification-bell"
        onClick={onClick}
      >

        <FaBell />

        {unreadCount > 0 && (

          <span
            className="notification-badge"
          >
            {unreadCount}
          </span>

        )}

      </div>

    );
};

export default
NotificationBell;