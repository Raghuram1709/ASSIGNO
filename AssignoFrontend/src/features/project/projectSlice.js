import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   projects: [],
   selectedProject: null,
   loading: false,
   error: null
};

const projectSlice = createSlice({

   name: "project",

   initialState,

   reducers: {

      projectStart: (state) => {
         state.loading = true;
         state.error = null;
      },

      projectSuccess: (state, action) => {

         console.log("SET PROJECTS PAYLOAD:");
         console.log(action.payload);
         
         state.loading = false;
         state.projects.push({
            projectId: action.payload.projectId,
            projectCode: action.payload.projectCode,
            title: action.payload.title,
            description: action.payload.description,
            company: action.payload.company,
            deadline: action.payload.deadline
               ? new Date(action.payload.deadline)
                  .toISOString()
                  .split("T")[0]
               : "",
            progress: action.payload.progress || 0,
            createdBy: action.payload.createdBy,
            role: action.payload.currentUserRole
         });

      },

      projectFailure: (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },

      setProjects: (state, action) => {
         
         state.loading = false;

         state.projects = action.payload.map(
            (project) => ({
               projectId: project.projectId || project._id,
               projectCode: project.projectCode,
               title: project.title,
               description: project.description,
               company: project.company,
               deadline: project.deadline
                  ? new Date(project.deadline)
                     .toISOString()
                     .split("T")[0]
                  : "",
               progress: project.progress || 0,
               createdBy: project.createdBy,
               role: project.role
            })
         );

      },
      setSelectedProject: (state, action) => {
         
         state.selectedProject = {
            projectId: action.payload.projectId || action.payload._id,
            projectCode: action.payload.projectCode,
            title: action.payload.title,
            description: action.payload.description,
            company: action.payload.company,
            deadline: action.payload.deadline
               ? new Date(action.payload.deadline)
                  .toISOString()
                  .split("T")[0]
               : "",
            createdBy: action.payload.createdBy,
            progress: action.payload.progress || 0,
            role: action.payload.currentUserRole
         };
         state.loading = false;
      }

   }

});

export const {
   projectStart,
   projectSuccess,
   projectFailure,
   setProjects,
   setSelectedProject
} = projectSlice.actions;

export default projectSlice.reducer;