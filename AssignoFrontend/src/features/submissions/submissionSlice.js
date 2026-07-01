import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviewSubmissions: [],
  mySubmissions: [],
  loading: false,
  error: null,
  message: null,
};

const mapSubmission = submission => ({
  submissionId:
    submission._id,

  taskId:
    submission.task._id,

  taskTitle:
    submission.task.title,

  deadline:
    submission.task.deadline,

  submittedBy:
    submission.submittedBy?._id,

  submittedByName:
    submission.submittedBy?.name,

  submittedByEmail:
    submission.submittedBy?.email,

  note:
    submission.note,

  links:
    submission.links || [],

  files:
    submission.files || [],

  status:
    submission.status,

  reviewComment:
    submission.reviewComment,

  reviewedBy:
    submission.reviewedBy?._id,

  reviewedByName:
    submission.reviewedBy?.name,

  createdAt:
    submission.createdAt,

  reviewedAt:
    submission.reviewedAt,
});

const submissionSlice = createSlice({
  name: "submission",
  initialState,

  reducers: {
    submissionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    setReviewSubmissions: (state, action) => {

      state.loading = false;

      state.reviewSubmissions =
        action.payload.map(
          mapSubmission
        );
    },

    setMySubmissions:
    (state, action) => {

      state.loading = false;

      state.mySubmissions =
        action.payload.map(
          mapSubmission
        );
    },

    updateSubmissionStatus: (
      state,
      action
    ) => {

      const {
        submissionId,
        status,
        reviewComment,
      } = action.payload;

      const submission =
        state.reviewSubmissions.find(
          submission =>
            submission.submissionId ===
            submissionId
        );

      if (submission) {
        submission.status =
          status;

        submission.reviewComment =
          reviewComment || "";
      }
    },

    submissionFailure: (
      state,
      action
    ) => {
      state.loading = false;
      state.error =
        action.payload;

      state.message = null;
    },

    clearSubmissionError: (
      state
    ) => {
      state.error = null;
    },
  },
});

export const {
  submissionStart,
  setReviewSubmissions,
  setMySubmissions,
  updateSubmissionStatus,
  submissionFailure,
  clearSubmissionError,
} = submissionSlice.actions;

export default submissionSlice.reducer;