import React, { useState } from 'react';
import { Key, Trash2, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/reduxHooks';
import { changePasswordAPI, deleteAccountAPI } from '../../features/auth/authAPI';
import { logoutSuccess } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../styles/profile.css';

const AccountSettings = () => {
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [activeModal, setActiveModal] = useState(null); // 'password' or 'delete'
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password Visibility Toggle State
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Delete State
  const [deletePassword, setDeletePassword] = useState('');
  
  // Loading & Error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const settingsOptions = [
    {
      id: 'password',
      title: 'Change Password',
      description: 'Update your account password',
      icon: <Key size={20} />,
      isDanger: false
    },
    {
      id: 'delete',
      title: 'Delete Account',
      description: 'Permanently remove your account and data',
      icon: <Trash2 size={20} />,
      isDanger: true
    }
  ];

  const resetModals = () => {
    setActiveModal(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setDeletePassword('');
    setError('');
    setIsLoading(false);
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match.");
    }
    setIsLoading(true);
    setError('');
    try {
      await changePasswordAPI(token, { currentPassword, newPassword });
      resetModals();
      toast.success('Password changed successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) {
      return setError("Password is required to delete account.");
    }
    setIsLoading(true);
    setError('');
    try {
      await deleteAccountAPI(token, deletePassword);
      resetModals();
      dispatch(logoutSuccess());
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="profile-glass-card">
        <div className="profile-section-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <h3 className="profile-section-title">Account Settings</h3>
        </div>
        
        <div className="settings-list" style={{ marginTop: '1.5rem' }}>
          {settingsOptions.map((option) => (
            <div 
              key={option.id} 
              className={`settings-item ${option.isDanger ? 'settings-item-danger' : ''}`}
              onClick={() => setActiveModal(option.id)}
            >
              <div className="settings-item-left">
                <div className="settings-icon-wrapper">
                  {option.icon}
                </div>
                <div className="settings-item-info">
                  <span className="settings-item-title">{option.title}</span>
                  <span className="settings-item-desc">{option.description}</span>
                </div>
              </div>
              <ChevronRight size={20} className="settings-arrow" />
            </div>
          ))}
        </div>
      </div>

      {/* Change Password Modal */}
      {activeModal === 'password' && (
        <div className="profile-modal-overlay" onClick={resetModals}>
          <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="profile-modal-title">Change Password</h3>
            <p className="profile-modal-subtitle">Ensure your account is using a long, random password to stay secure.</p>
            
            <form onSubmit={handleChangePassword}>
              <div className="profile-form-group" style={{ marginBottom: '1rem' }}>
                <label className="profile-label">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showCurrent ? "text" : "password"} 
                    className="profile-input" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required 
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => setShowCurrent(!showCurrent)}
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="profile-form-group" style={{ marginBottom: '1rem' }}>
                <label className="profile-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showNew ? "text" : "password"} 
                    className="profile-input" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required 
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="profile-form-group" style={{ marginBottom: '1rem' }}>
                <label className="profile-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showConfirm ? "text" : "password"} 
                    className="profile-input" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

              <div className="profile-modal-actions">
                <button type="button" className="profile-btn profile-btn-secondary" onClick={resetModals}>Cancel</button>
                <button type="submit" className="profile-btn profile-btn-primary" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {activeModal === 'delete' && (
        <div className="profile-modal-overlay" onClick={resetModals}>
          <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="profile-modal-title" style={{ color: '#dc2626' }}>Delete Account</h3>
            <p className="profile-modal-subtitle">Once you delete your account, there is no going back. Please be certain.</p>
            
            <form onSubmit={handleDeleteAccount}>
              <div className="profile-form-group" style={{ marginBottom: '1rem' }}>
                <label className="profile-label">Confirm Password to Delete</label>
                <input 
                  type="password" 
                  className="profile-input" 
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required 
                />
              </div>

              {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

              <div className="profile-modal-actions">
                <button type="button" className="profile-btn profile-btn-secondary" onClick={resetModals}>Cancel</button>
                <button type="submit" className="profile-btn profile-btn-primary" style={{ background: '#dc2626' }} disabled={isLoading}>
                  {isLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountSettings;
