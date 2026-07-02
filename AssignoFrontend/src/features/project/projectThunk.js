import {
   projectStart,
   projectSuccess,
   projectFailure,
   setProjects, setSelectedProject
} from "./projectSlice";

import { createProjectAPI, getProjectsAPI, deleteProjectAPI, getProjectByCodeAPI } from "./projectAPI";

const getErrorMessage = (error) =>
   error.response?.data?.message ||
   error.response?.data?.error?.message ||
   error.message ||
   "An error occurred";

export const createProject =
({ projectData, token }) => async (dispatch) => {

   try {

      dispatch(projectStart());

      const response = await createProjectAPI(
         projectData,
         token
      );


      dispatch(projectSuccess(response.project));

   } catch (error) {


      dispatch(
         projectFailure(
            getErrorMessage(error)
         )
      );

      throw error;
   }
}

export const fetchProjects =
(token) => async (dispatch) => {

   try {

      dispatch(projectStart());

      const response =
      await getProjectsAPI(token);

     

      dispatch(
         setProjects(response.projects)
      );

   } catch (error) {

      dispatch(
         projectFailure(
            getErrorMessage(error)
         )
      );
   }
}


export const deleteProject = (projectId, token) => async (dispatch) => {

   try {

      dispatch(projectStart());

      const response = await deleteProjectAPI(projectId, token);

      
      await dispatch(fetchProjects(token));


   } catch (error) {

   dispatch(
      projectFailure(
         error.response?.data?.message ||
         error.message ||
         "Failed to delete project"
      )
   );
}
}

export const fetchProjectByCode = (projectCode, token) => async (dispatch) => {

   try {

      dispatch(projectStart());

      const response = await getProjectByCodeAPI(
         projectCode,
         token
      );

      dispatch(
         setSelectedProject(response.project)
      );

   } catch (error) {

      dispatch(
         projectFailure(
            getErrorMessage(error)
         )
      );

   }

};