import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector} from "../app/reduxHooks";
import { fetchProjectByCode } from "../features/project/projectThunk";
import {addMembers,fetchProjectMembers} from "../features/member/memberThunk";
import { fetchTasksByProject } from "../features/task/taskThunk";
import AddMembers from "../components/AddMembers";
import { CircularProgressBar } from "../components/ProgressBars.jsx";
import MemberCard from "../components/MemberCard";
import ProjectStats from "../components/ProjectStats";
import TaskSubmission from "../components/TaskSubmission";
import TaskCard from "../components/TaskCard";
import AssignTask from "../components/AssignTask";
import "../styles/projectdashboard.css";
import MemberUpdatePanel from "../components/MemberUpdatePanel.jsx";
import { assignTask } from '../features/task/taskThunk.js';
import LeadUpdatePanel from "../components/LeadUpdatePanel.jsx";
import { Settings } from 'lucide-react';
import { MdSettings } from "react-icons/md";
import "../styles/updatePanel.css";
import Pagination from "../components/Pagination";
import "../styles/animations.css";

const ProjectDashboard = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
  const [memberPage, setMemberPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    setTaskPage(1); // Reset task page when member changes
  };
  console.log(selectedMember)

  const { projectCode } = useParams();
  console.log("projectCode prop:", projectCode);
console.log(typeof projectCode);

  const { selectedProject } = useAppSelector(
    (state) => state.project
  );

  const { token, user } = useAppSelector(
    (state) => state.auth
  );
  console.log(token)
  const { error, members } = useAppSelector(
    (state) => state.member
  );

  const { tasks } = useAppSelector(
    (state) => state.task
  );

  const handleAddMembers = async (
    membersData
  ) => {
    if (!token) return;

    try {
      await dispatch(
        addMembers({
          projectCode,
          membersData,
          token,
        })
      );

      await dispatch(
        fetchProjectMembers({
          projectCode,
          token,
        })
      );

      setShowAddMembers(false);
    } catch (error) {
      console.error(
        "Failed to add members:",
        error.response?.data || error
      );
    }
  };

  const handleAssignTask = async (tasks) => {
    console.log("handleAssignTask Called")
    await dispatch(
      assignTask({
        projectId: selectedProject.projectId,
        assignedTo: selectedMember.userId,
        tasks,
        token,
      })
    );

    setShowAssignTask(false);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (token) {
      dispatch(
        fetchProjectByCode(
          projectCode,
          token
        )
      );

      dispatch(
        fetchProjectMembers({
          projectCode,
          token,
        })
      );

      dispatch(
        fetchTasksByProject(
          projectCode,
          token
        )
      
      );
    }
  }, [
    dispatch,
    projectCode,
    token,
  ]);

  
  if (!user) {
    return <p>Loading User...</p>;
  }
  const myTasks = tasks.filter(
        task => task.assignedTo === user.id
    );

  if (!selectedProject) {
    return <p>Loading project...</p>;
  }

  const isLead =
    user.id ===
    selectedProject.createdBy._id;

    const displayedTasks = isLead
      ? selectedMember
        ? tasks.filter(
            task =>
              task.assignedTo ===
              selectedMember.userId &&
              task.status === "assigned"
          )
        : []
      : tasks.filter(
          task =>
            task.assignedTo === user.id && 
            task.status === "assigned"
        );
    
    const teamMembers = members.filter(member => member.role !== "lead");
    const paginatedMembers = teamMembers.slice((memberPage - 1) * ITEMS_PER_PAGE, memberPage * ITEMS_PER_PAGE);
    
    const paginatedTasks = displayedTasks.slice((taskPage - 1) * ITEMS_PER_PAGE, taskPage * ITEMS_PER_PAGE);

  return (
    <div className="project-dashboard-container">
      <div className="project-details">
        <h1>
          {selectedProject.title}
        </h1>

        <p>
          Company:{" "}
          {selectedProject.company}
        </p>

        <p>
          Deadline:{" "}
          {selectedProject.deadline}
        </p>

        <p>
          Lead:{" "}
          {
            selectedProject.createdBy
              .name
          }
        </p>
        <div className="project-status">
          <div className="project-badge">
            <div className="project-badge-dot" style={{ background: selectedProject.progress < 100 ? "red" : "green" }}></div>
            <p>{ selectedProject.progress < 100 ? "Live" : "Completed" }</p>
          </div>
          <div className="project-settings">
            <button onClick={() => navigate(`/projects/${projectCode}/settings`)}>
              <Settings size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <CircularProgressBar
          percentage={
            selectedProject?.progress ||
            0
          }
        />

        <p>Team Progress</p>
      </div>

      <ProjectStats
        totalMembers={
          members.length - 1
        }
        totalTasks={tasks.length}
        completedTasks={
          tasks.filter(
            (task) => task.status === "completed"
          ).length
        }
        pendingTasks={
          tasks.filter(
            (task) => task.status === "assigned"
          ).length
        }
      />

      <div className="members-list">
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Members</h2>

          {isLead && (
            <button
              className="add-member-btn"
              onClick={() =>
                setShowAddMembers(
                  !showAddMembers
                )
              }
            >
              + Add Member
            </button>
          )}
        </div>

        <div className="member-container animated-list" key={memberPage}>
          {paginatedMembers.map((member) => (
            <MemberCard
              key={member.memberId}
              member={member}
              onClick={() => handleMemberSelect(member)}
            />
          ))}
        </div>
        <Pagination 
          currentPage={memberPage} 
          totalItems={teamMembers.length} 
          itemsPerPage={ITEMS_PER_PAGE} 
          onPageChange={setMemberPage} 
        />
      </div>
      
      {showAddMembers && (
        <div className="modal-overlay">
          <AddMembers
            onSubmit={
              handleAddMembers
            }
            closeModel={() =>
              setShowAddMembers(
                false
              )
            }
          />
        </div>
      )}
      {
        members.length > 1 && (
        <div className="task-list">
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2>
              {isLead
                ? selectedMember
                  ? `${selectedMember.name}'s Tasks`
                  : "Select a Member"
                : "My Tasks"}
            </h2>

            {isLead && (
              <button
                className="add-task-btn"
                onClick={() =>
                  setShowAssignTask(
                    !showAssignTask
                  )
                }
              >
                + Add Task
              </button>
            )}
          </div>
        <div className="task-container animated-list" key={taskPage}>
          {paginatedTasks.length > 0 ? (
            paginatedTasks.map(task => (
                <TaskCard
                key={task.taskId}
                task={task}
              />
            ))
          ) : (
            <p className="no-task-msg">
              {isLead
                ? "Select a member to view tasks"
                : "No Tasks at the moment"}
            </p>
          )}
        </div>
        {displayedTasks.length > 0 && (
          <Pagination 
            currentPage={taskPage} 
            totalItems={displayedTasks.length} 
            itemsPerPage={ITEMS_PER_PAGE} 
            onPageChange={setTaskPage} 
          />
        )}
      </div>
        )
      }
      { selectedMember &&
            showAssignTask && (
            <div className="modal-overlay">
              <AssignTask
                closeModel={() => setShowAssignTask(false)}
                onSubmit={handleAssignTask}
              />
            </div>
            )
          }

        <div className="update-panel-container">
          <div className="panel-header">
              <h3>Workspace</h3>
            <span>Updates & History</span>
          </div>
        {
                isLead ? (
                  <LeadUpdatePanel projectCode = {projectCode} token={token}/>
                ): (<MemberUpdatePanel projectCode = {projectCode} />)
              }
        </div>
      
    </div>
  );
};

export default ProjectDashboard;