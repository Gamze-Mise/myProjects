import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// .env dosyasının konumunu belirt
dotenv.config({ path: path.join(__dirname, ".env") });

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
