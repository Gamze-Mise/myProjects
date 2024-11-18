import { z } from "zod";
import { awardSchema } from "../middleware/validation";

export type AwardRequest = z.infer<typeof awardSchema>;
