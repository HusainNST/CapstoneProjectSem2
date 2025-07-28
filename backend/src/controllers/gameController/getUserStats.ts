import prisma from "../../configs/prisma";
import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { INTERNAL_SERVER_ERROR, OK } from "../../constants/httpStatusCodes";

const getUserStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get all user scores
    const userScores = await prisma.score.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (userScores.length === 0) {
      res.status(OK).json({
        totalGames: 0,
        avgTime: 0,
        avgMoves: 0,
        mostPlayedDifficulty: "easy",
        bestEasyScore: null,
        bestHardScore: null,
        easyStats: {
          gamesPlayed: 0,
          avgTime: 0,
          avgMoves: 0,
          bestScore: 0,
        },
        hardStats: {
          gamesPlayed: 0,
          avgTime: 0,
          avgMoves: 0,
          bestScore: 0,
        },
      });
      return;
    }

    // Separate scores by difficulty
    const easyScores = userScores.filter(
      (score) => score.difficulty === "easy",
    );
    const hardScores = userScores.filter(
      (score) => score.difficulty === "hard",
    );

    // Calculate overall stats
    const totalGames = userScores.length;
    const avgTime = Math.round(
      userScores.reduce((sum, score) => sum + score.time, 0) / totalGames,
    );
    const avgMoves = Math.round(
      userScores.reduce((sum, score) => sum + score.moves, 0) / totalGames,
    );

    // Determine most played difficulty
    const mostPlayedDifficulty =
      easyScores.length >= hardScores.length ? "easy" : "hard";

    // Get best scores
    const bestEasyScore =
      easyScores.length > 0
        ? easyScores.reduce((best, current) =>
            current.score > best.score ? current : best,
          )
        : null;

    const bestHardScore =
      hardScores.length > 0
        ? hardScores.reduce((best, current) =>
            current.score > best.score ? current : best,
          )
        : null;

    // Calculate easy stats
    const easyStats = {
      gamesPlayed: easyScores.length,
      avgTime:
        easyScores.length > 0
          ? Math.round(
              easyScores.reduce((sum, score) => sum + score.time, 0) /
                easyScores.length,
            )
          : 0,
      avgMoves:
        easyScores.length > 0
          ? Math.round(
              easyScores.reduce((sum, score) => sum + score.moves, 0) /
                easyScores.length,
            )
          : 0,
      bestScore: bestEasyScore ? bestEasyScore.score : 0,
    };

    // Calculate hard stats
    const hardStats = {
      gamesPlayed: hardScores.length,
      avgTime:
        hardScores.length > 0
          ? Math.round(
              hardScores.reduce((sum, score) => sum + score.time, 0) /
                hardScores.length,
            )
          : 0,
      avgMoves:
        hardScores.length > 0
          ? Math.round(
              hardScores.reduce((sum, score) => sum + score.moves, 0) /
                hardScores.length,
            )
          : 0,
      bestScore: bestHardScore ? bestHardScore.score : 0,
    };

    const stats = {
      totalGames,
      avgTime,
      avgMoves,
      mostPlayedDifficulty,
      bestEasyScore,
      bestHardScore,
      easyStats,
      hardStats,
    };

    res.status(OK).json(stats);
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

export default getUserStats;
