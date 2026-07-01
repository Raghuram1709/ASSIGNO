import {
  MdCheckCircle,
  MdPending,
  MdRadioButtonUnchecked,
} from "react-icons/md";


const TaskCard = ({ task }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <MdCheckCircle color="green" size={24} />;

      case "in-progress":
        return <MdPending color="orange" size={24} />;

      default:
        return (
          <MdRadioButtonUnchecked color="gray" size={24} />
        );
    }
  };
  return (
    <div className='task-card-container'>

      <div className="task-card">
        <h3>{task.title}</h3>
        <p>
          {" "}
          {new Date(
            task.deadline
          ).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          )}
        </p>
      </div>
    </div>
  )
}

export default TaskCard

