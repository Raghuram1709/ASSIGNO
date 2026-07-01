import { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../app/reduxHooks";
import { readAllNotifications } from "../features/notifications/notificationThunk";
import NotificationCard from "../components/notificationComponents/NotificationCard";
import Pagination from "../components/Pagination";
import "../styles/notifications.css";
import "../styles/animations.css";

const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector(state => state.auth);
  const { notifications, loading } = useAppSelector(state => state.notification);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "read") return notifications.filter(n => n.isRead);
    return notifications.filter(n => !n.isRead);
  }, [notifications, filter]);

  const groupedNotifications = useMemo(() => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    filteredNotifications.forEach(notif => {
      // Assuming notification object has a createdAt or timestamp field
      const dateStr = notif.createdAt || notif.timestamp || new Date().toISOString();
      const date = new Date(dateStr);
      
      let dateKey = "";
      if (date.toDateString() === today.toDateString()) {
        dateKey = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = "Yesterday";
      } else {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateKey = date.toLocaleDateString(undefined, options);
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(notif);
    });

    return groups;
  }, [filteredNotifications]);

  if (loading) {
    return <p className="no-notifications">Loading notifications...</p>;
  }

  return (
    <div className="notifications-page">
      <h1>Notifications</h1>

      <div className="notification-filters">
        <div className="filter-group">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({notifications.length})
          </button>
          <button
            className={`filter-btn ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread ({notifications.filter(n => !n.isRead).length})
          </button>
          <button
            className={`filter-btn ${filter === "read" ? "active" : ""}`}
            onClick={() => setFilter("read")}
          >
            Read ({notifications.filter(n => n.isRead).length})
          </button>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button
            className="mark-read-btn"
            onClick={() => dispatch(readAllNotifications(token))}
          >
            Mark All Read
          </button>
        )}
      </div>

      <div className="notification-list animated-list" key={`${filter}-${currentPage}`}>
        {Object.keys(groupedNotifications).length === 0 ? (
          <p className="no-notifications">No notifications found.</p>
        ) : (
          Object.keys(groupedNotifications)
            .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
            .map((dateKey) => (
            <div key={dateKey} className="notification-date-group">
              <h3 className="date-group-header">{dateKey}</h3>
              {groupedNotifications[dateKey].map(notification => (
                <div key={notification.notificationId} className="notification-item-wrapper">
                  <NotificationCard notification={notification} />
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      
      {Object.keys(groupedNotifications).length > ITEMS_PER_PAGE && (
        <Pagination 
          currentPage={currentPage}
          totalItems={Object.keys(groupedNotifications).length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default NotificationsPage;