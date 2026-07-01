import { fetchSubmissionAPI, taskSubmissionAPI, approveSubmissionAPI, rejectSubmissionAPI, fetchMySubmissionsAPI }
from "./submissionAPI";
import { updateTaskStatus } from "../task/taskSlice";
import {
  submissionStart,
  setReviewSubmissions,
  submissionFailure,
  updateSubmissionStatus,
  setMySubmissions
} from "./submissionSlice";

export const taskSubmission = ({taskId, submissionData, token }) => async (dispatch) => {

    console.log(
      "Submission Thunk Hit"
    );

    console.log({
      taskId,
      submissionData,
      tokenPresent: !!token,
    });

    try {

      const response =
        await taskSubmissionAPI({
          taskId,
          submissionData,
          token,
        });

      console.log(
        "Submission Success:",
        response
      );

      dispatch(updateTaskStatus(response.task))

      return response;

    } catch (error) {

      console.error(
        "Submission Failed:"
      );

      console.error(
        error.response?.data ||
        error.message
      );

      throw error;
    }
  };


export const fetchSubmissions =
  (projectCode, token) =>
  async (dispatch) => {

    try {

      dispatch(
        submissionStart()
      );

      const response =
        await fetchSubmissionAPI(
          projectCode,
          token
        );

      dispatch(
        setReviewSubmissions(
          response.submissions
        )
      );

      console.log(response.submissions)

    } catch (error) {

      dispatch(
        submissionFailure(
          error.response?.data
            ?.message ||
          "Failed to fetch submissions"
        )
      );

      throw error;
    }
};


export const fetchMySubmissions =
  (token, projectCode) =>
  async (dispatch) => {
    console.log("fetchMySubmission Called")
    try {

      dispatch(
        submissionStart()
      );

      const response =
        await fetchMySubmissionsAPI(
          token, projectCode
        );
      console.log(response)
      dispatch(
        setMySubmissions(
          response.submissions
        )
      );

    } catch (error) {

      dispatch(
        submissionFailure(
          error.response?.data
            ?.message ||
          "Failed to fetch history"
        )
      );

      throw error;
    }
  };

export const approveSubmission =
  (submissionId, token) =>
  async (dispatch) => {

    try {

      const response =
        await approveSubmissionAPI(
          submissionId,
          token
        );
      console.log(response.submission)

      dispatch(
        updateSubmissionStatus({
          submissionId,
          status:
            response.submission.status,
        })
      );

      return response;

    } catch (error) {

      dispatch(
        submissionFailure(
          error.response?.data
            ?.message ||
          "Approval failed"
        )
      );

      throw error;
    }
  };


export const rejectSubmission =
  (
    submissionId,
    comment,
    token
  ) =>
  async (dispatch) => {

    try {

      const response =
        await rejectSubmissionAPI(
          submissionId,
          comment,
          token
        );

      dispatch(
        updateSubmissionStatus({
          submissionId,
          status:
            response.submission.status,

          reviewComment:
            response.submission
              .reviewComment,
        })
      );

      return response;

    } catch (error) {

      dispatch(
        submissionFailure(
          error.response?.data
            ?.message ||
          "Rejection failed"
        )
      );

      throw error;
    }
  };