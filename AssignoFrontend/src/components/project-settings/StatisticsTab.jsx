import React from 'react';
import ProjectStats from '../ProjectStats';
import { CircularProgressBar } from '../ProgressBars';

const StatisticsTab = ({ stats }) => {
  return (
    <div className="settings-content-card">
      <h2>Project Statistics</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
        <div className="progress-bar" style={{ width: '100%', maxWidth: '400px' }}>
          <CircularProgressBar percentage={stats.completionPercentage || 0} />
          <p>Team Progress</p>
        </div>
      </div>

      <ProjectStats
        totalMembers={stats.totalMembers}
        totalTasks={stats.totalTasks}
        completedTasks={stats.completedTasks}
        pendingTasks={stats.pendingTasks}
      />
    </div>
  );
};

export default StatisticsTab;
