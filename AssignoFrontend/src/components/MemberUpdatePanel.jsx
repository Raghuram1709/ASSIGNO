import { useEffect, useState } from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../app/reduxHooks";

import TaskSubmission from "../components/TaskSubmission";
import SubmissionHistory from "../components/SubmissionHistory";

import {
  fetchMySubmissions,
  taskSubmission,
} from "../features/submissions/submissionThunk";

const MemberUpdatePanel = ({projectCode}) => {

  console.log("projectCode prop:", projectCode);
console.log(typeof projectCode);

  const dispatch =
    useAppDispatch();

  const [
    activeTab,
    setActiveTab,
  ] = useState(false);

  const [
    showSubmission,
    setShowSubmission,
  ] = useState(false);

  const {
    selectedProject,
  } = useAppSelector(
    state => state.project
  );

  const {
    token,
    user,
  } = useAppSelector(
    state => state.auth
  );

  const {
    tasks,
  } = useAppSelector(
    state => state.task
  );

  if (!user) {
    return (
      <p>
        Loading User...
      </p>
    );
  }

  const handleTaskSubmission =
    async ({
      taskId,
      ...submissionData
    }) => {

      await dispatch(
        taskSubmission({
          taskId,
          submissionData,
          token,
        })
      );

      setShowSubmission(
        false
      );
    };

  useEffect(() => {
    if(!token) return;
    dispatch(fetchMySubmissions(token, projectCode));
  },[dispatch, token])

  const myTasks =
    tasks.filter(
      task =>
        task.assignedTo ===
          user.id &&
        task.status ===
          "assigned"
    );

  const isLead =
    user.id ===
    selectedProject
      .createdBy._id;

  const hasPendingTasks =
    myTasks.length > 0;

  return (

    <div className="member-update-panel">
      
      <div
        className="member-tabs"
      >

        {!isLead &&
          hasPendingTasks && (

          <button className="submit-task-btn"
            onClick={() =>
              setShowSubmission(
                true
              )
            }
          >
            Submit Task
          </button>

        )}

        <button className="history-btn"
          onClick={() =>
            setActiveTab(
              !activeTab
            )
          }
        >
          History
        </button>

      </div>

      {showSubmission && (

        <div
          className="modal-overlay"
        >

          <TaskSubmission
            tasks={myTasks}
            closeModel={() =>
              setShowSubmission(
                false
              )
            }
            onSubmit={
              handleTaskSubmission
            }
          />

        </div>

      )}

      {activeTab && (
        <SubmissionHistory />
      )}

      

    </div>

  );
};

export default MemberUpdatePanel;