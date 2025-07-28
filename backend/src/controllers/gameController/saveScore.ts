import prisma from "../../configs/prisma";
import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import {
  OK,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../../constants/httpStatusCodes";

const saveScore = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Validate request body
    const { moves, time, difficulty = "easy" } = req.body;
    if (!moves || !time) {
      res.status(BAD_REQUEST).json({ error: "Moves and time are required" });
      return;
    }
    const userId = req.user!.id;

    // Calculate score (higher is better)
    const moveScore = Math.max(0, 1000 - moves * 10);
    const timeScore = Math.max(0, 1000 - time);
    const score = moveScore + timeScore;

    // Save score to the database
    const savedScore = await prisma.score.create({
      data: {
        moves: parseInt(moves),
        time: parseInt(time),
        score,
        difficulty,
        userId,
      },
    });

    res.status(OK).json(savedScore);
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};
export default saveScore;
