import express from "express";
import register from "../controllers/authController/register";
import login from "../controllers/authController/login";
import authenticate from "../middleware/authenticate";
import verify from "../controllers/authController/verify";
import logout from "../controllers/authController/logout";
import updateProfile from "../controllers/authController/updateProfile";
import changePassword from "../controllers/authController/changePassword";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", authenticate, verify);
router.delete("/logout", logout);
router.put("/updateProfile", authenticate, updateProfile);
router.put("/changePassword", authenticate, changePassword);

export default router;
