import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddMembers from './AddMembers';
import {useAppDispatch,useAppSelector} from '../app/reduxHooks';
import { deleteProject } from '../features/project/projectThunk';

const ProjectCard = ({project}) => {
    
   const navigate = useNavigate();

    console.log(project);

    const dispatch = useAppDispatch();

    const { token } = useAppSelector(
      (state) => state.auth
    );

    const {projects} = useAppSelector(
      (state) => state.project
    );

    const {members} = useAppSelector(
      (state) => state.member
    );

    console.log("Current projects in state:", projects);

    const handleDelete = () => {
      

      console.log("projectName:", project.title);
      console.log("Deleting project with ID:", project.projectId);

       dispatch(deleteProject(project.projectId,token));
    }

    if (!project.projectId) return null;
  return (
      <div className='project-card'
         style={{
                  "--progress": `${project.progress}%`,
                  "--progress-color":
                     project.progress < 30
                     ? "#ff0000"
                     : project.progress < 70
                     ? "#f59e0b"
                     : "#00ff04",
               }}
      >
                  
                     <h2 className='project-title'>
                        {project.title}
                     </h2>


                     <p className='project-company'>
                        {project.company}
                     </p>

                     <p className='project-deadline'>
                        {project.deadline}
                     </p>
                     
                     <div className='project-actions'>
                        <button 
                        onClick = {() => navigate(`/projects/${project.projectCode}`)}
                        className='add-member-btn'
                        >
                           View Dashboard
                        </button>

                        {/* <button className='delete-btn' onClick={handleDelete}>
                              Delete Project
                        </button> */}

                     </div>
                  <div>

                     
                     

                  </div>
                  </div>

    
  )
}

export default ProjectCard
