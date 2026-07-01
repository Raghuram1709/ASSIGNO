import React, { useState } from 'react';
import DeleteProjectModal from './DeleteProjectModal';

const ProjectActions = ({ projectTitle, onDelete }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="settings-content-card">
        <h2 style={{ color: '#dc2626', borderBottomColor: 'rgba(220, 38, 38, 0.2)' }}>
          Project Actions
        </h2>
        
        <div className="danger-zone">
          <div className="danger-zone-text">
            <h3>Delete Project</h3>
            <p>
              Once you delete a project, there is no going back. Please be certain.
            </p>
          </div>
          <button 
            className="settings-btn settings-btn-danger"
            onClick={() => setShowModal(true)}
          >
            Delete Project
          </button>
        </div>
      </div>

      {showModal && (
        <DeleteProjectModal
          projectTitle={projectTitle}
          onClose={() => setShowModal(false)}
          onConfirm={onDelete}
        />
      )}
    </>
  );
};

export default ProjectActions;
