import { Request, Response, NextFunction } from "express";

import { getUser } from "@/utils/actions/getUser";
import { RequestWithUserId } from "@/utils/interfaces/requestWithUserId";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies["sb-access-token"];
    const refreshToken = req.cookies["sb-refresh-token"];

    if (!accessToken || !refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { user, error } = await getUser(req, accessToken);

    if (error || !user || !user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    (req as RequestWithUserId).userId = user.id;
    next();
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};
