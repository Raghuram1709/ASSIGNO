import axiosInstance
from "../../services/axiosInstance";

export const createCommunicationAPI =
  async ({
    projectCode,
    scope,
    recipientId,
    message,
    token,
  }) => {

    const response =
      await axiosInstance.post(
        "/communications",
        {
          projectCode,
          scope,
          recipientId,
          message,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};