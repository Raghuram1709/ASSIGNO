import React from 'react';
import { UserPlus, CheckCircle, Edit3, Image as ImageIcon, Lock, Shield, FolderGit2, Clock } from 'lucide-react';
import '../../styles/profile.css';

const ActivityTimeline = ({ activities }) => {
  
  const defaultActivities = [
    {
      id: 1,
      title: 'Joined Project',
      description: 'You joined "Frontend Redesign Q3"',
      time: '2 hours ago',
      icon: <UserPlus size={20} />
    },
    {
      id: 2,
      title: 'Completed Task',
      description: 'Marked "Update Landing Page" as done',
      time: 'Yesterday',
      icon: <CheckCircle size={20} />
    },
    {
      id: 3,
      title: 'Profile Updated',
      description: 'Updated your bio and contact information',
      time: '3 days ago',
      icon: <Edit3 size={20} />
    },
    {
      id: 4,
      title: 'Photo Changed',
      description: 'Uploaded a new profile picture',
      time: 'Last week',
      icon: <ImageIcon size={20} />
    },
    {
      id: 5,
      title: 'Password Updated',
      description: 'Changed your account password',
      time: '2 weeks ago',
      icon: <Lock size={20} />
    },
    {
      id: 6,
      title: 'Workspace Created',
      description: 'Created a new workspace "Personal Projects"',
      time: '1 month ago',
      icon: <Shield size={20} />
    }
  ];

  const getIconForType = (type) => {
    switch (type) {
      case 'project':
        return <FolderGit2 size={20} />;
      case 'task_completed':
        return <CheckCircle size={20} />;
      case 'task_assigned':
        return <Clock size={20} />;
      case 'joined':
        return <UserPlus size={20} />;
      default:
        return <Shield size={20} />;
    }
  };

  const data = activities ? activities.map(act => ({
    ...act,
    icon: getIconForType(act.type)
  })) : defaultActivities;

  return (
    <div className="profile-glass-card">
      <div className="profile-section-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <h3 className="profile-section-title">Recent Activity</h3>
      </div>
      
      <div className="timeline-container" style={{ marginTop: '1.5rem' }}>
        {data.map((activity) => (
          <div key={activity.id} className="timeline-item">
            <div className="timeline-icon-wrapper">
              {activity.icon}
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-title">{activity.title}</span>
                <span className="timeline-time">{activity.time}</span>
              </div>
              <p className="timeline-desc">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
