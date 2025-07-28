import prisma from "../../configs/prisma";
import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { INTERNAL_SERVER_ERROR, OK } from "../../constants/httpStatusCodes";

const myScores = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const userScores = await prisma.score.findMany({
      where: { userId },
      orderBy: { score: "desc" },
    });

    res.status(OK).json(userScores);
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};
export default myScores;
