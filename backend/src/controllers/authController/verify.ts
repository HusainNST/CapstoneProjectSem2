import { OK } from "../../constants/httpStatusCodes";
import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";

const verify = (req: AuthenticatedRequest, res: Response) => {
  res.status(OK).json(req.user);
};
export default verify;
