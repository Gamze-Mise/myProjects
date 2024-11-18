import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const awardSchema = z.object({
  user_id: z.number(),
  subject: z.string().min(1),
  company: z.string().optional(),
  date: z.string().optional(), // ISO string olarak alıp Date'e çevireceğiz
  lang: z.string().optional(),
});

export const validateAward = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = awardSchema.safeParse(req.body);
  if (!result.success) {
    console.log("Validation Error:", result.error.errors);
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: result.error.errors,
    });
  }
  return next();
};
