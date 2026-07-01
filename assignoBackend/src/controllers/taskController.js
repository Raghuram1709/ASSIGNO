import {
  assignTaskService,
  fetchTasksByProjectService
} from "../services/taskService.js";

export const assignTaskController = async (
  req,
  res,
  next
) => {
  try {
    const task = await assignTaskService({
      ...req.body,
      assignedBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      task
    });

  } catch (error) {
    next(error);
  }
};

export const fetchTasksByProjectController =
  async (req, res, next) => {

    try {

      const { projectCode } =
        req.params;

      const tasks =
        await fetchTasksByProjectService(
          projectCode
        );

      return res.status(200).json({
        success: true,
        tasks
      });

    } catch (error) {
      next(error);
    }
};

