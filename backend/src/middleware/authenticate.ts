import jwt from "jsonwebtoken";
import prisma from "../configs/prisma";
import { JWT_SECRET } from "../constants/env";
import { BAD_REQUEST, UNAUTHORIZED } from "../constants/httpStatusCodes";
import { Request, Response, NextFunction } from "express";

// Extended Request interface to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    username: string;
  };
}

const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    res
      .status(UNAUTHORIZED)
      .json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      res.status(UNAUTHORIZED).json({ error: "Invalid token." });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(BAD_REQUEST).json({ error: "Invalid token." });
  }
};
export default authenticate;
