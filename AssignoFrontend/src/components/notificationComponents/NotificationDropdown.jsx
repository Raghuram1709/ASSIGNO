import {useNavigate} from "react-router-dom";

import {useAppDispatch,useAppSelector} from "../../app/reduxHooks.js";

import {readNotification} from "../../features/notifications/notificationThunk";

const NotificationDropdown =
  ({ closeDropdown }) => {

    const dispatch =
      useAppDispatch();

    const navigate =
      useNavigate();

    const { token } =
      useAppSelector(
        state => state.auth
      );

    const {
      notifications,
    } =
      useAppSelector(
        state =>
          state.notification
      );

   const recentNotifications = [...notifications]
  .filter(
    notification =>
      !notification.isRead
  )
  .sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  )
  .slice(0, 3);

    const handleClick =
      async notification => {

        try {

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

          closeDropdown();

          navigate(
            `/projects/${notification.projectCode}`
          );

        } catch (error) {

          console.error(
            error
          );

        }
      };

    const handleViewAll =
      () => {

        closeDropdown();

        navigate(
          "/notifications"
        );

      };

    return (

      <div
        className="notification-dropdown"
      >

        <div
          className="notification-header"
        >

          <h4>
            Notifications
          </h4>


        </div>
        <div className="notification-list">

            {recentNotifications.length === 0 ? (

              <p
                className="empty-notifications"
              >
                No unread notifications
              </p>

            ) : (
              
              recentNotifications.map(
                notification => (

                  <div
                    key={
                      notification.notificationId
                    }
                    className="notification-item unread"
                    onClick={() =>
                      handleClick(
                        notification
                      )
                    }
                  >

                    <p>
                      {
                        notification.message
                      }
                    </p>

                  </div>

                )
              )

            )}
        </div>

        <button
          className="view-all-btn"
          onClick={
            handleViewAll
          }
        >
          View All
        </button>

      </div>

    );
};

export default
NotificationDropdown;