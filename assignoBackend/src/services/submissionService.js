import Task from "../models/task.js";
import Project from "../models/project.js";
import TaskSubmission from "../models/taskSubmission.js";
import User from "../models/user.js";
import AppError from "../utils/appError.js";
import cloudinary from "../config/cloudinary.js";
import { createNotification } from "./notificationService.js";
import { updateMemberProgress } from "./progressService.js";
import {getProjectByCode} from "../utils/getProjectByCode.js";


const uploadToCloudinary =
  async (filePath) => {

    const result =
      await cloudinary.uploader.upload(
        filePath,
        {
          resource_type: "auto",
          folder:
            "task-submissions",
        }
      );

    return result.secure_url;
};


export const submitTaskService = async ({
  taskId,
  submittedBy,
  note,
  links = [],
  files = [],
}) => {
  const uploadedFileUrls = await Promise.all(
    files.map(file => uploadToCloudinary(file.path))
  );

  const [task, user] = await Promise.all([
    Task.findById(taskId).populate("project", "_id createdBy"),
    User.findById(submittedBy).select("name"),
  ]);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (task.assignedTo.toString() !== submittedBy.toString()) {
    throw new AppError(
      "You are not assigned to this task",
      401
    );
  }

  if (task.status !== "assigned") {
    throw new AppError(
      `Task cannot be submitted because it is currently ${task.status}`,
      400
    );
  }

  const submission = await TaskSubmission.create(
    {
      task: taskId,
      project: task.project._id,
      submittedBy,
      note,
      links,
      files: uploadedFileUrls,
    },
  );

  task.status = "submitted";

  await task.save();
  await createNotification({
    projectId: task.project._id,
    recipientId: task.project.createdBy,
    type: "task_submitted",
    message: `${user.name} submitted task "${task.title}"`,
  });

  return {
    submission,
    task,
  };
};


export const fetchProjectSubmissionsService =
  async ({
    projectCode,
    userId,
  }) => {
    const project = await getProjectByCode(projectCode)

    if (!project) {
      throw new AppError(
        "Project not found", 404
      );
    }

    if (
      project.createdBy.toString() !==
      userId.toString()
    ) {
      throw new AppError(
        "Unauthorized", 401
      );
    }

    const tasks =
      await Task.find({
        project: project._id,
      }).select("_id");

    const taskIds =
      tasks.map(
        task => task._id
      );

    const submissions =
      await TaskSubmission.find({
        task: {
          $in: taskIds,
        },
      })
        .populate(
          "submittedBy",
          "name email"
        )
        .populate(
          "task",
          "title deadline"
        )
        .populate(
          "reviewedBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return submissions;
};

export const fetchMySubmissionsService =
  async (userId, projectCode) => {
    const project = await getProjectByCode(projectCode);

    const submissions = 
      await TaskSubmission.find({
        submittedBy: userId,
        project: project._id
      })
        .populate(
          "task",
          "title deadline"
        )
        .populate(
          "reviewedBy",
          "name"
        )
        .sort({
          createdAt: -1,
        });

    return submissions;
  };


export const approveSubmissionService = async ({
  submissionId,
  leadId,
}) => {
  const submission = await TaskSubmission.findById(submissionId)
    .populate({
      path: "task",
      populate: {
        path: "project",
      },
    });

  if (!submission) {
    throw new AppError(
      "Submission not found",
      404
    );
  }

  const task = submission.task;
  const project = task.project;

  if (project.createdBy.toString() !== leadId.toString()) {
    throw new AppError(
      "Unauthorized",
      401
    );
  }

  if (submission.status !== "pending") {
    throw new AppError(
      "Submission already reviewed",
      400
    );
  }

  submission.status = "approved";
  submission.reviewedBy = leadId;
  submission.reviewedAt = new Date();

  await submission.save();

  task.status = "completed";

  await task.save();

  await updateMemberProgress({
    userId: submission.task.assignedTo,
    projectId: submission.task.project._id,
  });

  await createNotification({
    projectId: submission.task.project._id,
    recipientId: submission.submittedBy,
    type: "submission_approved",
    message: `Your submission for "${submission.task.title}" was approved`,
  });

  return submission;
};


export const rejectSubmissionService = async ({
  submissionId,
  leadId,
  comment,
}) => {
  const submission = await TaskSubmission.findById(submissionId)
    .populate({
      path: "task",
      populate: {
        path: "project",
      },
    });

  if (!submission) {
    throw new AppError(
      "Submission not found",
      404
    );
  }

  if (submission.status !== "pending") {
    throw new AppError(
      "Submission already reviewed",
      400
    );
  }

  const task = submission.task;
  const project = task.project;

  if (
    project.createdBy.toString() !==
    leadId.toString()
  ) {
    throw new AppError(
      "Unauthorized",
      401
    );
  }

  submission.status = "rejected";
  submission.reviewedBy = leadId;
  submission.reviewComment = comment;
  submission.reviewedAt = new Date();

  task.status = "assigned";

  await task.save();
  await submission.save();

  await createNotification({
    projectId: project._id,
    recipientId: submission.submittedBy,
    type: "submission_rejected",
    message: `Your submission for "${submission.task.title}" was rejected`,
  });

  return submission;
};