import express from "express";
import { createMealPlan, getWeeklyMealPlan, deleteMealPlan } from "../controllers/mealPlanController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateJWT, createMealPlan);
router.get("/week", authenticateJWT, getWeeklyMealPlan);
router.post("/delete", authenticateJWT, deleteMealPlan);

export default router;