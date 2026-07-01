import { useState } from 'react';
import AssignTask from './AssignTask';
import { ProgressBar } from './ProgressBars.jsx';
import { useAppDispatch, useAppSelector } from '../app/reduxHooks';
import { assignTask } from '../features/task/taskThunk.js';
import '../styles/memberCard.css';
import { FaCircleCheck, FaRegCircleCheck } from "react-icons/fa6";

const MemberCard = ({ member, onClick }) => {
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);


  const { projectId, role } =
    useAppSelector(
      (state) => state.project.selectedProject
    ) || {};

  const { token } = useAppSelector(
    (state) => state.auth
  );

  
  const handleAssignTask = async (tasks) => {
    await dispatch(
      assignTask({
        projectId,
        assignedTo: member.userId,
        tasks,
        token,
      })
    );

    setIsOpen(false);
  };

  

  return (
    <div className="member-card-container">

          <div className="member-card" onClick={onClick}>

            <div className="member-info">
              <h3>{member.name}</h3>
              <p>- {member.role}</p>
              
            </div>
              <ProgressBar progress={member.progress || 0} />

          </div>
          
        </div>
  );
};

export default MemberCard;