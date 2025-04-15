import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

// Optionally define the user payload structure
interface JwtPayload {
  id: string;
  role: string;
  // add more if needed
}

// Extend Request type to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return; // 🔑 Prevents fall-through
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
    return; // 🔑 Prevents fall-through
  }
};
