import React, { useState } from 'react';
import { toast } from 'react-toastify';

const DeleteProjectModal = ({ projectTitle, onClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isMatch = inputValue === projectTitle;

  const handleConfirm = async () => {
    if (!isMatch) return;
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (err) {
      toast.error('Failed to delete project');
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="settings-content-card" 
        style={{ maxWidth: '500px', width: '100%', margin: '0 1rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: '#dc2626', borderBottomColor: 'rgba(220, 38, 38, 0.2)' }}>
          Delete Project
        </h2>
        
        <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '1rem' }}>
            Deleting this project permanently removes:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            <li>Members</li>
            <li>Tasks</li>
            <li>Workspace Updates</li>
            <li>Project Files</li>
          </ul>
          <p style={{ color: '#dc2626', fontWeight: 'bold' }}>
            This action cannot be undone.
          </p>
        </div>

        <div className="settings-form-group">
          <label>
            To continue, type <strong style={{ color: 'var(--text-primary)' }}>{projectTitle}</strong> below:
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={projectTitle}
            disabled={isDeleting}
          />
        </div>

        <div className="settings-actions" style={{ marginTop: '2rem' }}>
          <button 
            className="settings-btn settings-btn-secondary" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            className="settings-btn settings-btn-danger" 
            onClick={handleConfirm}
            disabled={!isMatch || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;
