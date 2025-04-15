import {
  changePassword,
  login,
  sendResetLink,
  signup,
} from "../controllers/authController";

import express from "express";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/reset-password", sendResetLink);
router.patch("/change-password", changePassword);

export default router;
