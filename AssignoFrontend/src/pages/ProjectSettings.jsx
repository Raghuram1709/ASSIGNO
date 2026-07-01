import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector } from '../app/reduxHooks';
import { getProjectSettingsAPI, deleteProjectAPI } from '../features/project/projectAPI';

import SettingsTabs from '../components/project-settings/SettingsTabs';
import GeneralInformation from '../components/project-settings/GeneralInformation';
import MembersTab from '../components/project-settings/MembersTab';
import StatisticsTab from '../components/project-settings/StatisticsTab';
import ProjectActions from '../components/project-settings/ProjectActions';
import '../styles/projectSettings.css';
import { ArrowLeft } from 'lucide-react';

const ProjectSettings = () => {
  const { projectCode } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('general');
  const [projectData, setProjectData] = useState(null);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getProjectSettingsAPI(projectCode, token);
        setProjectData(response.data.project);
        setMembers(response.data.members);
        setStats(response.data.stats);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load project settings');
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    if (token && projectCode) {
      fetchSettings();
    }
  }, [projectCode, token, navigate]);

  if (loading || !user || !projectData) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Settings...</div>;
  }

  const isLead = user.id === projectData.createdBy._id;

  const handleProjectUpdate = (updatedProject) => {
    setProjectData(updatedProject);
  };

  const handleMemberRemoved = (memberId) => {
    setMembers((prev) => prev.filter((m) => m._id !== memberId));
    setStats((prev) => ({ ...prev, totalMembers: prev.totalMembers - 1 }));
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProjectAPI(projectCode, token);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
      throw err; // Re-throw to be caught by the modal
    }
  };

  return (
    <div className="project-settings-page">
      <div className="settings-header">
        <button 
          onClick={() => navigate(`/projects/${projectCode}`)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem' }}
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <h1>Project Settings</h1>
        <p>Manage settings and preferences for {projectData.title}</p>
      </div>

      <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} isLead={isLead} />

      <div className="settings-content">
        {activeTab === 'general' && (
          <GeneralInformation 
            project={projectData} 
            isLead={isLead} 
            onProjectUpdate={handleProjectUpdate} 
          />
        )}
        
        {activeTab === 'members' && (
          <MembersTab 
            projectCode={projectCode} 
            members={members} 
            isLead={isLead} 
            onMemberRemoved={handleMemberRemoved} 
          />
        )}
        
        {activeTab === 'statistics' && (
          <StatisticsTab stats={stats} />
        )}
        
        {activeTab === 'actions' && isLead && (
          <ProjectActions 
            projectTitle={projectData.title} 
            onDelete={handleDeleteProject} 
          />
        )}
      </div>
    </div>
  );
};

export default ProjectSettings;
