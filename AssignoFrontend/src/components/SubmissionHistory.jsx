import { useState, useEffect } from "react";
import Pagination from "./Pagination";

import { useAppSelector }
from "../app/reduxHooks";

import SubmissionHistoryCard
from "./SubmissionHistoryCard";

import SubmissionHistoryDetails
from "./SubmissionHistoryDetails";

const SubmissionHistory = () => {

  const { mySubmissions, loading } =
    useAppSelector(
      state => state.submission
    );

  const [selectedSubmission,
    setSelectedSubmission] =
    useState(null);

  const [filter,
    setFilter] =
    useState("all");

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const submissionsPerPage = 3;

  // Reset page whenever filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const pendingCount =
    mySubmissions.filter(
      submission =>
        submission.status ===
        "pending"
    ).length;

  const approvedCount =
    mySubmissions.filter(
      submission =>
        submission.status ===
        "approved"
    ).length;

  const rejectedCount =
    mySubmissions.filter(
      submission =>
        submission.status ===
        "rejected"
    ).length;

  const filteredSubmissions =
    filter === "all"
      ? mySubmissions
      : mySubmissions.filter(
          submission =>
            submission.status ===
            filter
        );

  const totalPages =
    Math.ceil(
      filteredSubmissions.length /
      submissionsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    submissionsPerPage;

  const currentSubmissions =
    filteredSubmissions.slice(
      startIndex,
      startIndex +
      submissionsPerPage
    );

  if (loading) {
    return (
      <p>
        Loading...
      </p>
    );
  }

  if (selectedSubmission) {
    return (
      <SubmissionHistoryDetails
        submission={
          selectedSubmission
        }
        onBack={() =>
          setSelectedSubmission(
            null
          )
        }
      />
    );
  }

  if (
    mySubmissions.length === 0
  ) {
    return (
      <p>
        No submission history
        found.
      </p>
    );
  }

  return (
    <div className="submission-container">

      <h2>
        Submission History
      </h2>

      <div className="history-filters">

        <button
          className="submission-btn"
          onClick={() =>
            setFilter("all")
          }
        >
          All (
          {mySubmissions.length}
          )
        </button>

        <button
          className="submission-btn"
          onClick={() =>
            setFilter("pending")
          }
        >
          Pending (
          {pendingCount}
          )
        </button>

        <button
          className="submission-btn"
          onClick={() =>
            setFilter("approved")
          }
        >
          Approved (
          {approvedCount}
          )
        </button>

        <button
          className="submission-btn"
          onClick={() =>
            setFilter("rejected")
          }
        >
          Rejected (
          {rejectedCount}
          )
        </button>

      </div>

      <div>

        {currentSubmissions.length === 0 ? (

          <p>
            No {filter} submissions
            found.
          </p>

        ) : (

          currentSubmissions.map(
            submission => (
              <SubmissionHistoryCard
                key={
                  submission.submissionId
                }
                submission={
                  submission
                }
                onSelect={
                  setSelectedSubmission
                }
              />
            )
          )

        )}

      </div>

      {filteredSubmissions.length > submissionsPerPage && (
        <Pagination 
          currentPage={currentPage}
          totalItems={filteredSubmissions.length}
          itemsPerPage={submissionsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

    </div>
  );
};

export default SubmissionHistory;