import { Router }
from "express";

import {
  fetchNotificationsController,
  markNotificationReadController,
  markAllNotificationsReadController
} from "../controllers/notificationController.js";

const router =
  Router();

router.get(
  "/notifications",
  fetchNotificationsController
);

router.patch(
  "/notifications/:notificationId/read",
  markNotificationReadController
);

router.patch(
  "/notifications/read-all",
  markAllNotificationsReadController
);


export default router;