import { Router }
from "express";

import { createCommunicationController } from "../controllers/communicationController.js";
const router =
  Router();

router.post(
  "/communications",
  createCommunicationController
);

export default router;