import axiosInstance
from "../../services/axiosInstance";

export const fetchNotificationsAPI =
  async (token) => {

    const response =
      await axiosInstance.get(
        "/notifications",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};

export const markNotificationReadAPI =
  async (
    notificationId,
    token
  ) => {

    const response =
      await axiosInstance.patch(
        `/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};

export const markAllNotificationsReadAPI =
  async token => {

    const response =
      await axiosInstance.patch(
        "/notifications/read-all",
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};