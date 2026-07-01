import { Router } from "express";

import {
  assignTaskController,
  fetchTasksByProjectController
} from "../controllers/taskController.js";

const router = Router();

router.post(
  "/assign",
  assignTaskController
);

router.get(
  "/projects/:projectCode/tasks",
  fetchTasksByProjectController
);



export default router;