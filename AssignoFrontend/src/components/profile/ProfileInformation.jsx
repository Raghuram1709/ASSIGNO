import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../../features/auth/authThunk';
import '../../styles/profile.css';

const ProfileInformation = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const initialFormData = {
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    username: user?.username || 'johndoe123',
    email: user?.email || 'johndoe@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    studentId: user?.studentId || '12345678',
    department: user?.department || 'Computer Science',
    year: user?.year || 'Junior',
    role: user?.role || 'Developer',
    organization: user?.organization || 'Tech Club',
    location: user?.location || 'New York, USA',
    bio: user?.bio || 'Passionate software engineering student building cool stuff.',
  };

  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        studentId: user.studentId || '',
        department: user.department || '',
        year: user.year || '',
        role: user.role || '',
        organization: user.organization || '',
        location: user.location || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';

    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone format';

    if (formData.bio.length > 300) newErrors.bio = 'Bio must be under 300 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel was clicked
      setFormData(initialFormData);
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    if (validate()) {
      try {
          await dispatch(updateUserProfile(formData));
          toast.success('Profile changes saved successfully.');
          setIsEditing(false);
      } catch (error) {
          toast.error('Failed to save profile changes.');
      }
    } else {
      toast.error('Please fix the errors in the form.');
    }
  };

  return (
    <div className="profile-glass-card">
      <div className="profile-section-header">
        <h3 className="profile-section-title">Personal Information</h3>
        {!isEditing && (
          <button 
            className="profile-btn profile-btn-primary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            onClick={handleEditToggle}
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="profile-info-grid">
        <div className="profile-form-group">
          <label className="profile-label">First Name</label>
          <input 
            type="text" 
            name="firstName"
            className="profile-input" 
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {errors.firstName && <span className="profile-error-text" style={{color: '#dc2626', fontSize: '0.75rem'}}>{errors.firstName}</span>}
        </div>
        
        <div className="profile-form-group">
          <label className="profile-label">Last Name</label>
          <input 
            type="text" 
            name="lastName"
            className="profile-input" 
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {errors.lastName && <span style={{color: '#dc2626', fontSize: '0.75rem'}}>{errors.lastName}</span>}
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Username</label>
          <input 
            type="text" 
            name="username"
            className="profile-input" 
            value={formData.username}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Email Address</label>
          <input 
            type="email" 
            name="email"
            className="profile-input" 
            value={formData.email}
            onChange={handleChange}
            disabled={true}
          />
          {errors.email && <span style={{color: '#dc2626', fontSize: '0.75rem'}}>{errors.email}</span>}
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Phone Number</label>
          <input 
            type="tel" 
            name="phone"
            className="profile-input" 
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {errors.phone && <span style={{color: '#dc2626', fontSize: '0.75rem'}}>{errors.phone}</span>}
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Student ID</label>
          <input 
            type="text" 
            name="studentId"
            className="profile-input" 
            value={formData.studentId}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Department</label>
          <input 
            type="text" 
            name="department"
            className="profile-input" 
            value={formData.department}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Role / Year</label>
          <input 
            type="text" 
            name="year"
            className="profile-input" 
            value={formData.year}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Organization</label>
          <input 
            type="text" 
            name="organization"
            className="profile-input" 
            value={formData.organization}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Location</label>
          <input 
            type="text" 
            name="location"
            className="profile-input" 
            value={formData.location}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-form-group full-width">
          <label className="profile-label">
            Bio 
            {isEditing && <span style={{float: 'right', fontSize: '0.75rem', color: formData.bio.length > 300 ? '#dc2626' : 'inherit'}}>{formData.bio.length}/300</span>}
          </label>
          <textarea 
            name="bio"
            className="profile-textarea" 
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Tell us a little bit about yourself..."
          />
          {errors.bio && <span style={{color: '#dc2626', fontSize: '0.75rem'}}>{errors.bio}</span>}
        </div>
      </div>

      {isEditing && (
        <div className="profile-info-actions">
          <button className="profile-btn profile-btn-secondary" onClick={handleEditToggle}>
            Cancel
          </button>
          <button className="profile-btn profile-btn-primary" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>
      )}

    </div>
  );
};

export default ProfileInformation;
