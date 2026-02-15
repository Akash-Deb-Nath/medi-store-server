import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        role: string;
        status: string;
      };
    }
  }
}

const authMiddleware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authenticated",
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        status: session.user.status as string,
      };
      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! You don't have permission to access this resources",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authMiddleware;
