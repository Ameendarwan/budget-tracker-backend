import {
  createNotification,
  getNotifications,
} from "../controllers/notificationController";

import { authenticate } from "../middlewares/auth";
import express from "express";

const router = express.Router();

router.use(authenticate);

router.get("/:userId", getNotifications);
router.post("/", createNotification);

export default router;
