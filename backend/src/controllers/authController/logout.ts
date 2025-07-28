import { OK } from "../../constants/httpStatusCodes";
import { Request, Response } from "express";

const logout = (_: Request, res: Response) => {
  res.clearCookie("token");
  res.status(OK).json({ message: "Logged out successfully" });
};
export default logout;
