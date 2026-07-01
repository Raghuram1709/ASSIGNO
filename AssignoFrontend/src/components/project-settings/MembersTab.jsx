import React from 'react';
import { toast } from 'react-toastify';
import { removeProjectMemberAPI } from '../../features/project/projectAPI';
import { useAppSelector } from '../../app/reduxHooks';

const MembersTab = ({ projectCode, members, isLead, onMemberRemoved }) => {
  const { token } = useAppSelector((state) => state.auth);

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from this project?`)) {
      return;
    }

    try {
      await removeProjectMemberAPI(projectCode, memberId, token);
      toast.success(`${memberName} removed successfully`);
      onMemberRemoved(memberId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <div className="settings-content-card">
      <h2>Project Members</h2>
      <div className="member-list-grid">
        {members.map((member) => (
          <div key={member._id} className="member-item-card">
            <div className="member-item-header">
              {member.user?.avatarUrl ? (
                <img src={member.user.avatarUrl} alt="Avatar" className="member-item-avatar" />
              ) : (
                <div className="member-item-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-primary)', color: 'white', fontWeight: 'bold' }}>
                  {member.user?.name ? member.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="member-item-info">
                <h4>{member.user?.name || 'Unknown User'}</h4>
                <p>{member.user?.email}</p>
              </div>
            </div>
            
            <div className="member-item-meta">
              <span><strong>Role:</strong> <span style={{ textTransform: 'capitalize' }}>{member.role}</span></span>
              <span><strong>Department:</strong> {member.user?.department || 'N/A'}</span>
              <span><strong>Joined:</strong> {new Date(member.joinedAt || member.createdAt).toLocaleDateString()}</span>
            </div>

            {isLead && member.role !== 'lead' && (
              <div className="member-item-actions">
                <button 
                  className="settings-btn settings-btn-danger" 
                  style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                  onClick={() => handleRemoveMember(member._id, member.user?.name)}
                >
                  Remove Member
                </button>
              </div>
            )}
          </div>
        ))}
        {members.length === 0 && <p>No members found.</p>}
      </div>
    </div>
  );
};

export default MembersTab;
