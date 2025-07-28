import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../../configs/prisma";
import { Request, Response } from "express";
import { JWT_SECRET, NODE_ENV } from "../../constants/env";
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
} from "../../constants/httpStatusCodes";

const register = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      res.status(BAD_REQUEST).json({ error: "All fields are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      res.status(BAD_REQUEST).json({
        error:
          existingUser.email === email
            ? "Email already in use"
            : "Username already in use",
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

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

    res.status(CREATED).json({ user });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};
export default register;
