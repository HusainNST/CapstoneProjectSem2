import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../../configs/prisma";
import { Request, Response } from "express";
import { JWT_SECRET, NODE_ENV } from "../../constants/env";
import {
  OK,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../../constants/httpStatusCodes";

const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      res
        .status(BAD_REQUEST)
        .json({ error: "Email/username and password are required" });
      return;
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
    if (!user) {
      res.status(NOT_FOUND).json({ error: "Invalid credentials" });
      return;
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(BAD_REQUEST).json({ error: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(OK).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};
export default login;
