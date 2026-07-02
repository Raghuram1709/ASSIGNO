import Project from '../models/project.js';
import AppError from '../utils/appError.js';
import Member from '../models/member.js';
import Task from '../models/task.js';
export const createProject = async ({
  title,
  description,
  company,
  deadline,
  createdBy
}) => {

  // duplicate check
  const existingProject = await Project.findOne({
    title: title.trim(),
    createdBy
  });

  if (existingProject) {
    throw new AppError("Project with this title already exists", 409);
  }

   let projectCode;
   let exists = true;

   while (exists) {
      projectCode = `PRJ-${Math.floor(
         100000 + Math.random() * 900000
      )}`;

      exists = await Project.exists({ projectCode });
}
  // create project
  const project = await Project.create({
    projectCode,
    title: title.trim(),
    description,
    company,
    deadline,
    createdBy,
  });
  
  await Member.create({
      user: createdBy,
      project: project._id,
      role: "lead"
   });
   
  return {
    projectId: project.id,
    projectCode: project.projectCode,
    title: project.title,
    description: project.description,
    company: project.company,
    deadline: project.deadline,
    createdBy: project.createdBy
  };
};


export const getProjects = async (userId) => {

   const memberships = await Member.find({
      user: userId
   })
   .populate("project")
   .lean();

   if (!memberships.length) {
      return [];
   }

   return memberships.map(
      membership => ({

         ...membership.project,

         role: membership.role

      })
   );
};

export const deleteProject = async (projectCode, userId) => {
   const project = await Project.findOne({ projectCode });
   if (!project) {
      throw new AppError("Project not found", 404);
   }

   if (project.createdBy.toString() !== userId.toString()) {
      throw new AppError("Only the project lead can delete this project", 403);
   }

   // Delete all associated tasks
   await Task.deleteMany({ project: project._id });
   // Delete all members
   await Member.deleteMany({ project: project._id });
   // Delete the project
   await Project.findByIdAndDelete(project._id);

   return project;
};

export const getProjectByCode =
async (
   projectCode,
   userId
) => {

   const project =
      await Project.findOne({
         projectCode
      })
      .populate(
         "createdBy",
         "name email"
      )
      .lean();

   if (!project) {
      throw new AppError(
         "Project not found",
         404
      );
   }

   const members =
      await Member.find({
         project: project._id
      })
      .populate(
         "user",
         "name email"
      )
      .lean();

   const currentMember =
      await Member.findOne({
         project: project._id,
         user: userId
      })
      .lean();

   return {
      ...project,
      members,
      currentUserRole:
         currentMember?.role
   };
};

export const getProjectSettings = async (projectCode, userId) => {
   const project = await Project.findOne({ projectCode }).populate("createdBy", "name email avatarUrl").lean();
   if (!project) throw new AppError("Project not found", 404);

   const members = await Member.find({ project: project._id }).populate("user", "name email avatarUrl department role firstName lastName").lean();
   
   const totalTasks = await Task.countDocuments({ project: project._id });
   const completedTasks = await Task.countDocuments({ project: project._id, status: "completed" });
   const pendingTasks = await Task.countDocuments({ project: project._id, status: { $ne: "completed" } });

   return {
      project,
      members,
      stats: {
         totalMembers: members.length,
         totalTasks,
         completedTasks,
         pendingTasks,
         completionPercentage: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
         workspaceUpdates: 0,
         createdDate: project.createdAt,
         lastUpdated: project.updatedAt
      }
   };
};

export const updateProject = async (projectCode, userId, updateData) => {
   const project = await Project.findOne({ projectCode });
   if (!project) throw new AppError("Project not found", 404);

   if (project.createdBy.toString() !== userId.toString()) {
      throw new AppError("Only the project lead can update this project", 403);
   }

   const allowedFields = ['title', 'description', 'company', 'deadline', 'progress'];
   for (const key of Object.keys(updateData)) {
      if (allowedFields.includes(key)) {
         project[key] = updateData[key];
      }
   }

   await project.save();
   return project;
};

export const getProjectMembers = async (projectCode) => {
   const project = await Project.findOne({ projectCode });
   if (!project) throw new AppError("Project not found", 404);

   const members = await Member.find({ project: project._id }).populate("user", "name email avatarUrl department role firstName lastName").lean();
   return members;
};

export const removeMember = async (projectCode, memberId, userId) => {
   const project = await Project.findOne({ projectCode });
   if (!project) throw new AppError("Project not found", 404);

   if (project.createdBy.toString() !== userId.toString()) {
      throw new AppError("Only the project lead can remove members", 403);
   }

   const memberToRemove = await Member.findOne({ _id: memberId, project: project._id });
   if (!memberToRemove) throw new AppError("Member not found", 404);

   if (memberToRemove.user.toString() === userId.toString()) {
      throw new AppError("Lead cannot remove themselves", 403);
   }

   await Member.findByIdAndDelete(memberId);
   return { message: "Member removed successfully" };
};