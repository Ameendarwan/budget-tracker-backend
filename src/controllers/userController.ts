import { NextFunction, Request, Response } from "express";

import { Notification } from "../models/Notification";
import User from "../models/User";

export const createUser = async (req: Request, res: Response) => {
  try {
    // If no password provided, create one
    if (!req.body.password) {
      const randomPassword = Math.random().toString(36).slice(-8); // e.g. "x8km1z2p"
      req.body.password = randomPassword;
    }

    const user = await User.create(req.body);

    // Create Notification
    await Notification.create({
      userId: req?.user?.id,
      title: `${user.firstName} ${user.lastName}`,
      message: `added successfully.`,
      type: "success",
    });
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const sortField = (req.query.sortField as string) || "createdAt";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const query = {
      $or: [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { role: new RegExp(search, "i") },
      ],
    };

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select(
      "-password -resetToken -resetTokenExpiry"
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Create Notification
    await Notification.create({
      userId: req?.user?.id,
      title: `${user?.firstName} ${user?.lastName}`,
      message: `updated successfully.`,
      type: "info",
    });
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const uploadProfilePic = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const file = req.body.file;

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: file.filename },
      { new: true }
    );

    res.status(200).json({
      message: "Profile picture updated",
      profilePic: updatedUser?.profilePic,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) res.status(404).json({ error: "User not found" });
    // Create Notification
    await Notification.create({
      userId: req?.user?.id,
      title: `${user?.firstName} ${user?.lastName}`,
      message: `was removed.`,
      type: "error",
    });
    res.json({ message: "User deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
