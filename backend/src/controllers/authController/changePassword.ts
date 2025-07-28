import bcrypt from "bcryptjs";
import prisma from "../../configs/prisma";
import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import {
  OK,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../../constants/httpStatusCodes";

const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    if (!currentPassword || !newPassword) {
      res
        .status(BAD_REQUEST)
        .json({ error: "Current and new passwords are required" });
      return;
    }

    if (newPassword.length < 6) {
      res
        .status(BAD_REQUEST)
        .json({ error: "New password must be at least 6 characters long" });
      return;
    }

    // Get user with current password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(BAD_REQUEST).json({ error: "User not found" });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      res.status(BAD_REQUEST).json({ error: "Current password is incorrect" });
      return;
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(OK).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

export default changePassword;
