import prisma from "../../configs/prisma";
import { Request, Response } from "express";
import { INTERNAL_SERVER_ERROR, OK } from "../../constants/httpStatusCodes";

const getLeaderboard = async (_: Request, res: Response) => {
  try {
    const topScores = await prisma.score.findMany({
      orderBy: { score: "desc" },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    res.status(OK).json(topScores);
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};
export default getLeaderboard;
