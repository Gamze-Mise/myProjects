import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/error";
import awardRoutes from "./routes/awardRoutes";
import { env } from "./config/env";
import { Request, Response, NextFunction } from "express";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// Routes tanımlanmadan önce ekleyin
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/awards", awardRoutes);

// Error handling - now properly typed
app.use(errorHandler);

const startServer = async () => {
  const tryPort = async (port: number): Promise<void> => {
    try {
      await new Promise((resolve, reject) => {
        const server = app
          .listen(port, () => {
            console.log(
              `Server running in ${env.NODE_ENV} mode on port ${port}`
            );
            resolve(server);
          })
          .on("error", reject);
      });
    } catch (error: any) {
      if (error.code === "EADDRINUSE") {
        console.log(`Port ${port} is busy, trying ${port + 1}...`);
        await tryPort(port + 1);
      } else {
        console.error("Failed to start server:", error);
        process.exit(1);
      }
    }
  };

  await tryPort(env.PORT);
};

if (require.main === module) {
  startServer();
}
export default app;
