const SubmissionHistoryDetails = ({
  submission,
  onBack,
}) => {

  return (
    <div className="submission-details">

      <button className="submission-btn"
        onClick={onBack}
      >
        Back
      </button>

      <h2>
        {submission.taskTitle}
      </h2>

      <p>
        Status:
        {" "}
        {submission.status}
      </p>

      <p>
        Submitted On:
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

      <p>
        Deadline:
        {" "}
        {new Date(
          submission.deadline
        ).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        )}
      </p>

      <p>
        Your note:
        {" "}
        {submission.note}
      </p>

      {/* <div>

        <h4>Links</h4>

        {submission.links
          ?.length > 0 ? (
          submission.links.map(
            (
              link,
              index
            ) => (
              <div
                key={index}
              >
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link}
                </a>
              </div>
            )
          )
        ) : (
          <p>
            No links
          </p>
        )}

      </div>

      <div>

        <h4>Files</h4>

        {submission.files
          ?.length > 0 ? (
          submission.files.map(
            (
              file,
              index
            ) => (
              <div
                key={index}
              >
                <a
                  href={file}
                  target="_blank"
                  rel="noreferrer"
                >
                  View File
                </a>
              </div>
            )
          )
        ) : (
          <p>
            No files
          </p>
        )}

      </div> */}

       

      <h3>
        Review Information
      </h3>

      <p>
        Reviewed By:
        {" "}
        {submission.reviewedByName ||
          "Not Reviewed Yet"}
      </p>

      <p>
        Reviewed On:
        {" "}
        {submission.reviewedAt
          ? new Date(
              submission.reviewedAt
            ).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            )
          : "-"}
      </p>

      {submission.reviewComment && (
        <div>
          <h4>
            Review Comment
          </h4>

          <p>
            {
              submission.reviewComment
            }
          </p>
        </div>
      )}

    </div>
  );
};

export default SubmissionHistoryDetails;