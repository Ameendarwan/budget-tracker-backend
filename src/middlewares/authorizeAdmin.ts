import { NextFunction, Request, Response } from "express";

// Make sure this interface matches your JWT payload
interface JwtPayload {
  id: string;
  role: string;
}

// Extend Express's Request type to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ error: "Access denied: Admins only" });
    return;
  }

  next();
};
