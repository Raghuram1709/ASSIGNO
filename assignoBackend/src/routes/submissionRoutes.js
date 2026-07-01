import { Router } from "express";

import {
  submitTaskController,
  fetchProjectSubmissionsController,
  approveSubmissionController,
  rejectSubmissionController,
  fetchMySubmissionsController
} from "../controllers/submissionController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = Router();

router.post(
  "/tasks/:taskId/submission",
  upload.array("files"),
  submitTaskController
);

router.get(
  "/projects/:projectCode/submissions",
  fetchProjectSubmissionsController
);

router.get(
  "/projects/:projectCode/submissions/my",
  fetchMySubmissionsController
);

router.patch(
  "/submissions/:submissionId/approve",
  approveSubmissionController
);

router.patch(
  "/submissions/:submissionId/reject",
  rejectSubmissionController
);

export default router;