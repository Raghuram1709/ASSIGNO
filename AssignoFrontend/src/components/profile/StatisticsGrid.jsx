import React from 'react';
import { FolderGit2, FolderOpen, CheckSquare, Clock, Users, Trophy, UploadCloud } from 'lucide-react';
import '../../styles/profile.css';

const StatisticsGrid = ({ stats }) => {
  
  // Default stats if none provided
  const defaultStats = [
    { id: 1, title: 'Projects Created', value: '12', icon: <FolderGit2 size={24} /> },
    { id: 2, title: 'Projects Joined', value: '8', icon: <FolderOpen size={24} /> },
    { id: 3, title: 'Completed Tasks', value: '143', icon: <CheckSquare size={24} /> },
    { id: 4, title: 'Pending Tasks', value: '27', icon: <Clock size={24} /> },
    { id: 5, title: 'Workspace Members', value: '45', icon: <Users size={24} /> },
    { id: 6, title: 'Achievements', value: '15', icon: <Trophy size={24} /> },
    { id: 7, title: 'Files Uploaded', value: '234', icon: <UploadCloud size={24} /> },
  ];

  const data = stats ? defaultStats.map(ds => {
    const backendStat = stats.find(s => s.id === ds.id);
    return {
      ...ds,
      value: backendStat ? backendStat.value : ds.value
    };
  }) : defaultStats;

  return (
    <div className="profile-glass-card">
      <div className="profile-section-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <h3 className="profile-section-title">Account Statistics</h3>
      </div>
      
      <div className="stats-grid-container" style={{ marginTop: '1.5rem' }}>
        {data.map((stat) => (
          <div key={stat.id} className="statistic-card">
            <div className="statistic-icon-wrapper">
              {stat.icon}
            </div>
            <div className="statistic-info">
              <span className="statistic-value">{stat.value}</span>
              <span className="statistic-label">{stat.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsGrid;
