import Task from "../models/task.js";
import Project from "../models/project.js";
import AppError from "../utils/appError.js";

import { createNotification } from "./notificationService.js";
import { updateMemberProgress } from "./progressService.js";

export const assignTaskService = async ({
  projectId,
  assignedTo,
  assignedBy,
  tasks,
}) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(
      "Project not found",
      404
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const task of tasks) {
    const deadline = new Date(task.deadline);

    if (deadline < today) {
      throw new AppError(
        "Deadline cannot be before today.",
        400
      );
    }
  }

  const taskDocs = tasks.map(task => ({
    project: projectId,
    assignedTo,
    assignedBy,
    title: task.title,
    deadline: task.deadline,
  }));

  const createdTasks = await Task.insertMany(taskDocs);

  await updateMemberProgress({
    userId: assignedTo,
    projectId,
  });

  await createNotification({
    projectId,
    recipientId: assignedTo,
    type: "task_assigned",
    message:
      createdTasks.length === 1
        ? `You have been assigned a new task: "${createdTasks[0].title}".`
        : `You have been assigned ${createdTasks.length} new tasks.`,
  });

  return createdTasks;
};


export const fetchTasksByProjectService = async (projectCode) => {
   const project = await Project.findOne({ projectCode });

   if (!project) {
      throw new Error("Project not found");
   }
   const projectId = project._id;

   const tasks = await Task.find({ project: projectId });

  
   
   return tasks;
};