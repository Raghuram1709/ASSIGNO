import React from 'react';
import '../../styles/projectSettings.css';

const SettingsTabs = ({ activeTab, setActiveTab, isLead }) => {
  const tabs = [
    { id: 'general', label: 'General Information' },
    { id: 'members', label: 'Members' },
    { id: 'statistics', label: 'Statistics' },
  ];

  if (isLead) {
    tabs.push({ id: 'actions', label: 'Project Actions' });
  }

  return (
    <div className="settings-tabs-container">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SettingsTabs;
