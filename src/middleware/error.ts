import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/error";
import { logger } from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req,
  res,
  _next
) => {
  // Log error
  logger.error("Error:", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  // Default error
  const statusCode = 500;
  res.status(statusCode).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
