import axiosInstance from "../../services/axiosInstance";

export const assignTaskAPI = async ({ projectId, assignedTo, tasks, token }) => {
    const response = await axiosInstance.post(
        "/assign",
        {
            projectId,
            assignedTo,
            tasks
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const fetchTasksByProjectAPI = async (projectCode, token) => {
    const response = await axiosInstance.get(`/projects/${projectCode}/tasks`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

