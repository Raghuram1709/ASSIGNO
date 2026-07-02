import {
  submitTaskService,
  fetchProjectSubmissionsService,
  approveSubmissionService,
  rejectSubmissionService,
  fetchMySubmissionsService
} from "../services/submissionService.js";

export const submitTaskController =
  async (req, res, next) => {
    try {
      const { taskId } = req.params;

      const uploadedFiles = req.files || [];

      const result =
        await submitTaskService({
          taskId,
          submittedBy: req.user.id,
          note: req.body.note || [],
          links: req.body.links || [],
          files: uploadedFiles
        });

      return res.status(201).json({
        success: true,
        submission: result.submission,
        task: result.task
      });

    } catch (error) {
      next(error);
    }
};

export const fetchProjectSubmissionsController =
  async (req, res, next) => {
    try {
      const { projectCode } =
        req.params;

      const submissions =
        await fetchProjectSubmissionsService({
          projectCode,
          userId: req.user.id,
        });

      return res.status(200).json({
        success: true,
        submissions,
      });

    } catch (error) {
      next(error);
    }
};


export const fetchMySubmissionsController =
  async (req, res, next) => {
    try {
      const { projectCode } =
      req.params;
      const submissions =
        await fetchMySubmissionsService(
          req.user.id,
          projectCode
        );

      return res.status(200).json({
        success: true,
        submissions,
      });

    } catch (error) {

      next(error);

    }
  };

export const approveSubmissionController =
  async (req, res, next) => {
    try {
      const { submissionId } =
        req.params;

      const submission =
        await approveSubmissionService({
          submissionId,
          leadId: req.user.id,
        });

      return res.status(200).json({
        success: true,
        submission,
      });

    } catch (error) {
      next(error);
    }
};

export const rejectSubmissionController =
  async (req, res, next) => {
    try {
      const { submissionId } =
        req.params;

      const { comment } =
        req.body;

      const submission =
        await rejectSubmissionService({
          submissionId,
          leadId: req.user.id,
          comment,
        });

      return res.status(200).json({
        success: true,
        submission,
      });

    } catch (error) {
      next(error);
    }
};