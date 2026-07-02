import {
  createProject,
   getProjects,
    deleteProject,
     getProjectByCode,
     getProjectSettings,
     updateProject,
     getProjectMembers,
     removeMember
} from "../services/projectService.js";
import Project from "../models/project.js";


export const createProjectController = async (req, res, next) => {

  try {

    const createdBy = req.user.id;

    const project = await createProject({
      ...req.body,
      createdBy
    });

    res.status(201).json({
      success: true,
      project
    });

  } catch (error) {
    next(error);
  }
};


export const getProjectsController =
async (req, res, next) => {

   try {

      const projects = await getProjects(req.user.id);

      return res.status(200).json({
         success: true,
         projects
      });

   } catch (error) {
      next(error);
   }
}

export const deleteProjectController = async (req, res, next) => {
    try {
        const { projectCode } = req.params;
        const userId = req.user.id;

        await deleteProject(projectCode, userId);

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getProjectByCodeController = async (req, res, next) => {
   try {
      const { projectCode } = req.params;  

      const project = await getProjectByCode(projectCode, req.user.id);
      
      res.status(200).json({
         success: true,
         project
      });
   } catch (error) {
      console.error("Error in getProjectByCodeController:", error.message);
      next(error);
   }
};

export const getProjectSettingsController = async (req, res, next) => {
   try {
      const { projectCode } = req.params;
      const settings = await getProjectSettings(projectCode, req.user.id);
      res.status(200).json({
         success: true,
         data: settings
      });
   } catch (error) {
      next(error);
   }
};

export const updateProjectController = async (req, res, next) => {
   try {
      const { projectCode } = req.params;
      const project = await updateProject(projectCode, req.user.id, req.body);
      res.status(200).json({
         success: true,
         project
      });
   } catch (error) {
      next(error);
   }
};

export const getProjectMembersController = async (req, res, next) => {
   try {
      const { projectCode } = req.params;
      const members = await getProjectMembers(projectCode);
      res.status(200).json({
         success: true,
         members
      });
   } catch (error) {
      next(error);
   }
};

export const removeMemberController = async (req, res, next) => {
   try {
      const { projectCode, memberId } = req.params;
      const result = await removeMember(projectCode, memberId, req.user.id);
      res.status(200).json({
         success: true,
         message: result.message
      });
   } catch (error) {
      next(error);
   }
};
