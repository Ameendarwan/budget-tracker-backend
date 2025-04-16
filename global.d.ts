import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role: string;
      email: string;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { _id: ObjectId; role: string };
    }
  }
}
