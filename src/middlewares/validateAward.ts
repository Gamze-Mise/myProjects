import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const validateAward = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const { subject, user_id } = req.body;

    if (!subject) {
      return next(new AppError("Subject is required", 400));
    }

    if (!user_id) {
      return next(new AppError("User ID is required", 400));
    }

    next();
  } catch (error) {
    next(error);
  }
};
