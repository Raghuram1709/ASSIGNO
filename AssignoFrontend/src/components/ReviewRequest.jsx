const ReviewRequests = ({
  submissions,
  loading,
  onReview,
}) => {

  if (loading) {
    return <p>Loading...</p>;
  }

  if (
    submissions.length === 0
  ) {
    return (
      <p id="no-pending">
        No pending reviews
      </p>
    );
  }

  return (
    <div className="review-container">

      <h3>
        Pending Reviews
      </h3>

      {submissions.map(
        submission => (

          <div
            key={
              submission.submissionId
            }
            className="review-card"
          >

            <h4>
              {
                submission.taskTitle
              }
            </h4>

            <p>
              Submitted By:
              {" "}
              {
                submission.submittedByName
              }
            </p>

            <p>
                Submitted On:{" "}
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


            <button className="review-open-btn"
              onClick={() =>
                onReview(
                  submission
                )
              }
            >
              Review
            </button>

          </div>

        )
      )}

    </div>
  );
};

export default ReviewRequests;