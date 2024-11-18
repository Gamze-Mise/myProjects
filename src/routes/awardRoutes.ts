import express from "express";
import { awardController } from "../controllers/awardController";
import { validateAward } from "../middlewares/validateAward";

const router = express.Router();

router.get("/:user_id", awardController.getAllAward);
router.get("/:id", awardController.getAwardById);
router.post("/", validateAward, awardController.createAward);
router.put("/:id", validateAward, awardController.updateAward);
router.delete("/:id", awardController.deleteAward);

export default router;
