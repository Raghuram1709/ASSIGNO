import axiosInstance from "../../services/axiosInstance";

export const addMembersAPI = async ({ projectCode, membersData, token }) => {
    const payloadMembers = membersData.map(({ email, role }) => ({
        email,
        role
    }));

    const response = await axiosInstance.post(
        `/projects/${projectCode}/members`,
        { members: payloadMembers },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const getProjectMembersAPI = async ({ projectCode, token }) => {
    const response = await axiosInstance.get(
        `/projects/${projectCode}/members`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};
