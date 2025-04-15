import { Request, Response } from "express";

import { Notification } from "../models/Notification";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to get notifications" });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { userId, message, type } = req.body;
    const notification = await Notification.create({ userId, message, type });
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ message: "Failed to create notification" });
  }
};
