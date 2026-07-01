
const ProjectStats = ({
  totalMembers,
  totalTasks,
  completedTasks,
  pendingTasks
}) => {
  return (
    <div className="projectStats-container">
      <div className="stat-card members-card">
        <h1>{totalMembers}</h1>
        <p>Team Members</p>
    </div>

    <div className="stat-card tasks-card">
        <h1>{totalTasks}</h1>
        <p>Total Tasks</p>
    </div>

    <div className="stat-card completed-card">
        <h1>{completedTasks}</h1>
        <p>Completed Tasks</p>
    </div>

    <div className="stat-card pending-card">
        <h1>{pendingTasks}</h1>
        <p>Open Tasks</p>
    </div>
    </div>
  );
};

export default ProjectStats;