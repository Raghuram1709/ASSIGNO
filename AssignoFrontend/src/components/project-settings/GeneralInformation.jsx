import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { updateProjectAPI } from '../../features/project/projectAPI';
import { useAppSelector } from '../../app/reduxHooks';

const GeneralInformation = ({ project, isLead, onProjectUpdate }) => {
  const { token } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    deadline: '',
    progress: 0,
  });

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        company: project.company || '',
        deadline: formatDateForInput(project.deadline),
        progress: project.progress || 0,
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isLead) return;

    try {
      const updatedProject = await updateProjectAPI(project.projectCode, formData, token);
      onProjectUpdate(updatedProject.project);
      setIsEditing(false);
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="settings-content-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <h2 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>General Information</h2>
        {isLead && !isEditing && (
          <button className="settings-btn settings-btn-primary" onClick={() => setIsEditing(true)}>
            Edit Project
          </button>
        )}
      </div>

      <form className="settings-form" onSubmit={handleSave}>
        <div className="settings-form-group">
          <label>Project Name</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="settings-form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={!isEditing}
            rows="4"
          />
        </div>

        <div className="settings-form-group">
          <label>Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="settings-form-group">
          <label>Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        
        <div className="settings-form-group">
          <label>Progress (%)</label>
          <input
            type="number"
            name="progress"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
          <div className="settings-form-group">
            <label>Project Code</label>
            <input type="text" value={project.projectCode} disabled />
          </div>
          <div className="settings-form-group">
            <label>Created By</label>
            <input type="text" value={project.createdBy?.name || 'N/A'} disabled />
          </div>
          <div className="settings-form-group">
            <label>Created At</label>
            <input type="text" value={formatDate(project.createdAt)} disabled />
          </div>
          <div className="settings-form-group">
            <label>Last Updated</label>
            <input type="text" value={formatDate(project.updatedAt)} disabled />
          </div>
        </div>

        {isEditing && (
          <div className="settings-actions">
            <button
              type="button"
              className="settings-btn settings-btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  title: project.title || '',
                  description: project.description || '',
                  company: project.company || '',
                  deadline: project.deadline || '',
                  progress: project.progress || 0,
                });
              }}
            >
              Cancel
            </button>
            <button type="submit" className="settings-btn settings-btn-primary">
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default GeneralInformation;
