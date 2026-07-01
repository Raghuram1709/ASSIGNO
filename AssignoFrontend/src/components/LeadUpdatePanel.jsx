import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../app/reduxHooks";

import {
  fetchSubmissions,
} from "../features/submissions/submissionThunk";

import ReviewRequests from "./ReviewRequest";

import ReviewSubmission from "./ReviewSubmission";
import CommunicationPanel from "./communicationPanel";

const LeadUpdatePanel = ({
  projectCode,
  token,
}) => {

  const dispatch =
    useAppDispatch();

  const {
    reviewSubmissions,
    loading,
  } = useAppSelector(
    state => state.submission
  );

  const [
    activeTab,
    setActiveTab,
  ] = useState("reviews");

  const [
    selectedSubmission,
    setSelectedSubmission,
  ] = useState(null);

  useEffect(() => {

    if (!token) return;

    dispatch(
      fetchSubmissions(
        projectCode,
        token
      )
    );

  }, [
    dispatch,
    projectCode,
    token,
  ]);

  const pendingSubmissions =
    reviewSubmissions.filter(
      submission =>
        submission.status ===
        "pending"
    );

  return (
    <div className="lead-panel">

      <div className="lead-panel-tabs">

        <button
          className= "review-btn"
          
          onClick={() =>
            setActiveTab(
              "reviews"
            )
          }
        >
          Reviews
        </button>

        <button
            className="communication-btn"
            onClick={() =>
              setActiveTab(
                "communication"
              )
            }
          >
            Communication
          </button>

      </div>

      <div className="lead-panel-content">

        {activeTab ===
          "reviews" && (

          selectedSubmission ? (

            <ReviewSubmission
              submission={
                selectedSubmission
              }
              onBack={() =>
                setSelectedSubmission(
                  null
                )
              }
            />

          ) : (

            <ReviewRequests
              submissions={
                pendingSubmissions
              }
              loading={
                loading
              }
              onReview={
                setSelectedSubmission
              }
            />

          )
        )}
        {
          activeTab ===
          "communication" && (

            <CommunicationPanel
              projectCode={
                projectCode
              }
            />

          )
        }
        

      </div>

    </div>
  );
};

export default LeadUpdatePanel;