import axiosInstance from "../../services/axiosInstance";

export const taskSubmissionAPI = async ({
  taskId,
  submissionData,
  token,
}) => {

  const formData =
    new FormData();

  formData.append(
    "note",
    submissionData?.note || ""
  );

  (submissionData?.links || []).forEach(
    (link) => {
      formData.append(
        "links",
        link
      );
    }
  );

  (submissionData?.files || []).forEach(
    (file) => {
      formData.append(
        "files",
        file
      );
    }
  );

  const response =
    await axiosInstance.post(
      `/tasks/${taskId}/submission`,
      formData,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
};

export const fetchSubmissionAPI = async (projectCode, token) => {
  const response = await axiosInstance.get(`/projects/${projectCode}/submissions`,
    {
      headers: {
          Authorization:
            `Bearer ${token}`,
      
      }
    }
  );
  return response.data;
};


export const fetchMySubmissionsAPI =
  async (token, projectCode) => {

    const response =
      await axiosInstance.get(
        `/projects/${projectCode}/submissions/my`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
          
        }
      );

    return response.data;
  };


export const approveSubmissionAPI = async (
  submissionId,
  token
) => {

  const response =
    await axiosInstance.patch(
      `/submissions/${submissionId}/approve`,
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

export const rejectSubmissionAPI = async (
  submissionId,
  comment,
  token
) => {

  const response =
    await axiosInstance.patch(
      `/submissions/${submissionId}/reject`,
      {
        comment,
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