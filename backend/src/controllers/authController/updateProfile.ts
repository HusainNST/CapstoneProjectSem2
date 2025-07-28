import prisma from "../../configs/prisma";
import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import {
  OK,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../../constants/httpStatusCodes";

const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, email } = req.body;
    const userId = req.user!.id;

    if (!username || !email) {
      res
        .status(BAD_REQUEST)
        .json({ error: "Username and email are required" });
      return;
    }

    // Check if username or email already exists for another user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser && existingUser.id !== userId) {
      res.status(BAD_REQUEST).json({
        error:
          existingUser.email === email
            ? "Email already in use"
            : "Username already in use",
      });
      return;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, email },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.status(OK).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

export default updateProfile;
