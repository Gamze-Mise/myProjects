import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";
import { awardModel } from "../models/award";
import { AppError } from "../utils/error";

type AwardController = {
  getAllAward: RequestHandler;
  getAwardById: RequestHandler;
  createAward: RequestHandler;
  updateAward: RequestHandler;
  deleteAward: RequestHandler;
};

export const awardController: AwardController = {
  getAllAward: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.params;
      if (!user_id) {
        throw new AppError("User ID is required", 400);
      }

      const awards = await awardModel.findAll(parseInt(user_id));
      res.json({
        success: true,
        data: awards,
      });
    } catch (error) {
      next(error);
    }
  },

  getAwardById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const award = await awardModel.findById(parseInt(id));

      if (!award) {
        res.status(404).json({
          success: false,
          message: "Award not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: award,
      });
    } catch (error) {
      next(error);
    }
  },

  createAward: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const award = await awardModel.create(req.body);
      res.json({
        success: true,
        message: "Award created successfully",
        data: award,
      });
    } catch (error) {
      next(error);
    }
  },

  updateAward: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const success = await awardModel.update(parseInt(id), req.body);

      if (!success) {
        return next(new AppError("Award not found", 404));
      }

      res.json({
        success: true,
        message: "Award updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  deleteAward: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const success = await awardModel.delete(parseInt(id));

      if (!success) {
        return next(new AppError("Award not found", 404));
      }

      res.json({
        success: true,
        message: "Award deleted successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          message: error.message,
        });
        return;
      }
      res.status(500).json({
        message: "An unknown error occurred",
      });
    }
  },
};
