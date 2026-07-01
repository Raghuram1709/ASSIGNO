import axiosInstance from "../../services/axiosInstance";

export const createProjectAPI = async (projectData, token) => {

   console.log(token)
    const response = await axiosInstance.post("/projects", projectData,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data
};


export const getProjectsAPI = async (token) => {

   const response = await axiosInstance.get(
      "/projects",
      {
         headers: {
            Authorization: `Bearer ${token}`
         }
      }
   );

   return response.data;
}

export const deleteProjectAPI = async (projectCode, token) => {

   const response = await axiosInstance.delete(
      `/projects/${projectCode}`,
      {
         headers: {
            Authorization: `Bearer ${token}`
         }
      }
   );

   return response.data;
}

export const getProjectByCodeAPI = async (projectCode, token) => {

   console.log("API called with projectCode:", projectCode);

   const response = await axiosInstance.get(
      `/projects/${projectCode}`,
      {
         headers: {
            Authorization: `Bearer ${token}`
         }
      }
   );
   console.log("API response:", response.data);
   return response.data;
}

export const getProjectSettingsAPI = async (projectCode, token) => {
   const response = await axiosInstance.get(`/projects/${projectCode}/settings`, {
      headers: { Authorization: `Bearer ${token}` }
   });
   return response.data;
};

export const updateProjectAPI = async (projectCode, updateData, token) => {
   const response = await axiosInstance.patch(`/projects/${projectCode}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
   });
   return response.data;
};

export const getProjectMembersAPI = async (projectCode, token) => {
   const response = await axiosInstance.get(`/projects/${projectCode}/members`, {
      headers: { Authorization: `Bearer ${token}` }
   });
   return response.data;
};

export const removeProjectMemberAPI = async (projectCode, memberId, token) => {
   const response = await axiosInstance.delete(`/projects/${projectCode}/member/${memberId}`, {
      headers: { Authorization: `Bearer ${token}` }
   });
   return response.data;
};
