import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/reduxHooks';
import { Navigate } from 'react-router-dom';
import RegisterProject from '../components/RegisterProject';
import { fetchProjects } from '../features/project/projectThunk';
import ProjectCard from '../components/ProjectCard';
import '../styles/projects.css';
import '../styles/animations.css';

const Projects = () => {
   const [showModal, setShowModal] = useState(false);
   const [selectedProject, setSelectedProject] = useState(null);
   const [searchQuery, setSearchQuery] = useState("");

   const dispatch = useAppDispatch();

   const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);
   const { projects } = useAppSelector((state) => state.project);

   useEffect(() => {
      if (token) {
         dispatch(fetchProjects(token));
      }
   }, [dispatch, token]);

   // Compute statistics
   const totalProjects = projects.length;
   const completedProjects = projects.filter(p => p.progress >= 100).length;
   const inProgressProjects = totalProjects - completedProjects;

   // Filter projects based on search query
   const filteredProjects = useMemo(() => {
      if (!searchQuery.trim()) return projects;
      return projects.filter(p => 
         p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         p.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
   }, [projects, searchQuery]);

   // Separate projects by role
   const leadProjects = filteredProjects.filter(p => p.role === 'lead' || p.createdBy === user?.userId || p.createdBy === user?._id);
   const memberProjects = filteredProjects.filter(p => p.role !== 'lead' && p.createdBy !== user?.userId && p.createdBy !== user?._id);

   const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
   });

   if (!isAuthenticated) {
      return <Navigate to='/login'/>
   }

   return (
      <div className='projects-page'>
         
         <div className="projects-top-section">
            <div className="projects-header-wrapper">
               <h1>Welcome back, {user?.name || user?.username || 'User'}!</h1>
               <p>{currentDate}</p>
            </div>

            <div className="projects-stats-row">
               <div className="hub-stat-card">
                  <h3>Total Projects</h3>
                  <p className="stat-value">{totalProjects}</p>
               </div>
               <div className="hub-stat-card">
                  <h3>In Progress</h3>
                  <p className="stat-value" style={{color: 'var(--copper)'}}>{inProgressProjects}</p>
               </div>
               <div className="hub-stat-card">
                  <h3>Completed</h3>
                  <p className="stat-value" style={{color: 'var(--pine)'}}>{completedProjects}</p>
               </div>
            </div>
         </div>

         <div className="projects-controls">
            <button
               className="register-project-btn"
               onClick={() => setShowModal(true)}
            >
               + Create Project
            </button>

            <input 
               type="text" 
               className="projects-search-input"
               placeholder="Search projects by name or company..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>

         {showModal && (
            <RegisterProject closeModal={() => setShowModal(false)} />
         )}

         {leadProjects.length > 0 && (
            <div className="project-role-section">
               <h3 className="project-section-title">Projects You Lead</h3>
               <div className='projects-container animated-list' key={`lead-${searchQuery}`}>
                  {leadProjects.map((project) => (
                     <ProjectCard 
                        key={project.projectId} 
                        project={project}
                        onAddMember={() => setSelectedProject(project)}
                     />
                  ))}
               </div>
            </div>
         )}

         {memberProjects.length > 0 && (
            <div className="project-role-section">
               <h3 className="project-section-title">Projects You Contribute To</h3>
               <div className='projects-container animated-list' key={`member-${searchQuery}`}>
                  {memberProjects.map((project) => (
                     <ProjectCard 
                        key={project.projectId} 
                        project={project}
                        onAddMember={() => setSelectedProject(project)}
                     />
                  ))}
               </div>
            </div>
         )}

         {filteredProjects.length === 0 && (
            <p style={{color: 'var(--text-muted)'}}>No projects found.</p>
         )}

      </div>
   )
}

export default Projects;