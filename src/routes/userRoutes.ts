import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  uploadProfilePic,
} from "../controllers/userController";

import { authenticate } from "../middlewares/auth";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";
import express from "express";
import { upload } from "../middlewares/upload";

const router = express.Router();

// Protected admin-only routes
router.post("/", authenticate, authorizeAdmin, createUser);
router.get("/", authenticate, authorizeAdmin, getUsers);
router.delete("/:id", authenticate, authorizeAdmin, deleteUser);

// Protected user-only routes
router.get("/:id", authenticate, getUser);
router.patch("/:id", authenticate, updateUser);
router.patch(
  "/upload-profile-pic",
  authenticate,
  upload.single("image"),
  uploadProfilePic
);

export default router;
