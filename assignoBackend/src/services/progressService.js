import Task from "../models/task.js";
import Member from "../models/member.js";
import mongoose from "mongoose";
import Project from "../models/project.js";

const updateProjectProgress = async (projectId) => {
  const members = await Member.find({
    project: projectId,
    role: { $ne: "lead" },
  }).select("progress");

  const totalMembers = members.length;

  const progress =
    totalMembers === 0
      ? 0
      : Math.round(
          members.reduce(
            (sum, member) => sum + member.progress,
            0
          ) / totalMembers
        );

  await Project.findByIdAndUpdate(projectId, {
    $set: { progress },
  });

  return progress;
};


export const updateMemberProgress = async ({
  userId,
  projectId,
}) => {
        
  const [stats] = await Task.aggregate([
    {
      $match: {
        assignedTo: new mongoose.Types.ObjectId(userId),
      project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: 1,
        },
        completed: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "completed"],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  

  const total = stats?.total ?? 0;
  const completed = stats?.completed ?? 0;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);
  await Member.findOneAndUpdate(
    {
      user: userId,
      project: projectId,
    },
    {
      $set: {
        progress,
      },
      
    },{new: true},
  );

  await updateProjectProgress(projectId);

  return {
    total,
    completed,
    progress,
  };
};