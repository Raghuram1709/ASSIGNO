import { Router } from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {
   addMembersController,
   getProjectMembersController
} from "../controllers/memberController.js";

const router = Router();

router.post(
   "/projects/:projectCode/members",
   addMembersController
);

router.get(
   "/projects/:projectCode/members",
   getProjectMembersController
);

export default router;