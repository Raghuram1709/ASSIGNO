const SubmissionHistoryCard = ({
  submission,
  onSelect,
}) => {

  return (
    <div
      className="submission-history-card"
      onClick={() =>
        onSelect(submission)
      }
    >
      <h3>
        {submission.taskTitle}
      </h3>

      <p>
        Status:
        {" "}
        {submission.status}
      </p>

      <p>
        Submitted:
        {" "}
        {new Date(
          submission.createdAt
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
  );
};

export default SubmissionHistoryCard;