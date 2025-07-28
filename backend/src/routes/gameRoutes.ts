import express from "express";
import authenticate from "../middleware/authenticate";
import saveScore from "../controllers/gameController/saveScore";
import getLeaderboard from "../controllers/gameController/getLeaderboard";
import myScores from "../controllers/gameController/myScores";
import getUserStats from "../controllers/gameController/getUserStats";

const router = express.Router();

router.post("/saveScore", authenticate, saveScore);
router.get("/getLeaderboard", getLeaderboard);
router.get("/myScores", authenticate, myScores);
router.get("/getUserStats", authenticate, getUserStats);

export default router;
