import Project from "../models/project.js";
import AppError from "./appError.js";

export const getProjectByCode = async (projectCode) => {
   const project = await Project.findOne({ projectCode });

   if (!project) {
      throw new AppError("Project not found", 404);
   }

   return project;
};