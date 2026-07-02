import {
   createProjectController,
   getProjectsController,
   deleteProjectController,
   getProjectByCodeController,
   getProjectSettingsController,
   updateProjectController,
   getProjectMembersController,
   removeMemberController
} from '../controllers/projectController.js';

import { Router } from 'express';
const router = Router();


router.post('/projects', createProjectController);

router.get("/projects", getProjectsController);

router.delete("/test", (req, res) => {
   res.send("Delete route works");
});

router.delete("/projects/:projectCode", deleteProjectController);

router.get("/projects/:projectCode", getProjectByCodeController);

router.get("/projects/:projectCode/settings", getProjectSettingsController);
router.patch("/projects/:projectCode", updateProjectController);
router.get("/projects/:projectCode/members", getProjectMembersController);
router.delete("/projects/:projectCode/member/:memberId", removeMemberController);

export default router;