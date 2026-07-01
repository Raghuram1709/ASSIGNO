import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../app/reduxHooks';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileInformation from '../components/profile/ProfileInformation';
import StatisticsGrid from '../components/profile/StatisticsGrid';
import ActivityTimeline from '../components/profile/ActivityTimeline';
import AccountSettings from '../components/profile/AccountSettings';
import { getUserStatsAPI } from '../features/auth/authAPI';
import '../styles/profile.css';

const ProfilePage = () => {
  // Try to get user from Redux store, fallback to mock data for demonstration
  const authState = useAppSelector((state) => state.auth);
  const currentUser = authState?.user || {
    firstName: 'Alex',
    lastName: 'Morgan',
    username: 'alexmorgan99',
    email: 'alex.morgan@example.com',
    role: 'Senior Developer',
    department: 'Engineering',
    memberSince: '2023',
    status: 'Active',
    lastLogin: 'Today at 10:45 AM',
    avatarUrl: null
  };

  const [statsData, setStatsData] = useState(null);
  const [activitiesData, setActivitiesData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (authState?.token) {
        try {
          const response = await getUserStatsAPI(authState.token);
          if (response.success && response.data) {
            setStatsData(response.data.stats);
            setActivitiesData(response.data.activities);
          }
        } catch (error) {
          console.error("Failed to fetch user stats", error);
        }
      }
    };
    
    fetchStats();
  }, [authState?.token]);

  return (
    <div className="profile-page-container">
      <div className="profile-page-header">
        <h1 className="profile-page-title">My Profile</h1>
        <p className="profile-page-subtitle">Manage your account settings and preferences.</p>
      </div>

      <div className="profile-grid-top">
        {/* Left Column (Desktop) / Top Column (Mobile) */}
        <div className="profile-column-left" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ProfileCard user={currentUser} />
          <AccountSettings />
        </div>

        {/* Right Column (Desktop) / Bottom Column (Mobile) */}
        <div className="profile-column-right" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ProfileInformation user={currentUser} />
          <StatisticsGrid stats={statsData} />
          <ActivityTimeline activities={activitiesData} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
