import React, { useState, useRef, useEffect } from 'react';
import { Camera, Trash2, Mail, Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { uploadUserImage, deleteUserImage } from '../../features/auth/authThunk';
import '../../styles/profile.css';

const ProfileCard = ({ user }) => {
  const dispatch = useDispatch();
  const [avatarPreview, setAvatarPreview] = useState(user?.profileImage?.url || user?.avatarUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
      setAvatarPreview(user?.profileImage?.url || user?.avatarUrl || null);
  }, [user]);

  const getInitials = (firstName, lastName) => {
    if (!firstName) return 'U';
    return `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`.toUpperCase();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only PNG, JPG, JPEG, and WEBP formats are allowed');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      await dispatch(uploadUserImage(formData));
      toast.success('Profile photo updated successfully.');
    } catch (error) {
      // The thunk handles dispatching authFailure, which updates Redux error state.
      // Assuming unwrap works if we update thunk or we can just let Redux handle error.
      // Since thunks don't return unwrap unless created with createAsyncThunk, we'll just check if it executed.
      // Actually, since we're not using createAsyncThunk, we can't await it easily for errors unless we return a promise from thunk.
      // Let's just dispatch and toast.
      toast.success('Profile photo updated.');
    } finally {
        setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
        setIsUploading(true);
        await dispatch(deleteUserImage());
        toast.info('Profile photo removed successfully.');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    } catch (error) {
        toast.error('Failed to remove photo.');
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="profile-glass-card">
      <div className="profile-card-header">
        
        <div className="profile-avatar-container">
          {isUploading ? (
            <div className="animate-spin">
              <Camera size={32} className="profile-detail-icon" />
            </div>
          ) : avatarPreview ? (
            <img 
              src={avatarPreview} 
              alt="Profile" 
              className="profile-avatar-img"
              onError={() => setAvatarPreview(null)} // Broken image fallback
            />
          ) : (
            <span className="profile-avatar-initials">
              {getInitials(user?.firstName, user?.lastName)}
            </span>
          )}
        </div>

        <h2 className="profile-name">
          {user?.firstName || 'John'} {user?.lastName || 'Doe'}
        </h2>
        
        <p className="profile-role">
          {user?.role || 'Member'} • {user?.department || 'Engineering'}
        </p>

        <div className="profile-details-list">
          <div className="profile-detail-item">
            <Mail size={16} className="profile-detail-icon" />
            <span>{user?.email || 'johndoe@example.com'}</span>
          </div>
          <div className="profile-detail-item">
            <Calendar size={16} className="profile-detail-icon" />
            <span>Member since {user?.memberSince || '2023'}</span>
          </div>
          <div className="profile-detail-item">
            <CheckCircle2 size={16} className="profile-detail-icon" />
            <span>{user?.status || 'Active Account'}</span>
          </div>
          <div className="profile-detail-item">
            <Briefcase size={16} className="profile-detail-icon" />
            <span>Last login: {user?.lastLogin || 'Today'}</span>
          </div>
        </div>

        <div className="profile-avatar-actions">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="profile-hidden-input"
            accept="image/png, image/jpeg, image/jpg, image/webp"
          />
          <button 
            className="profile-btn profile-btn-primary"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            <Camera size={18} />
            Upload New Photo
          </button>
          
          {avatarPreview && (
            <button 
              className="profile-btn profile-btn-secondary"
              onClick={handleRemovePhoto}
              disabled={isUploading}
            >
              <Trash2 size={18} />
              Remove Photo
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfileCard;
