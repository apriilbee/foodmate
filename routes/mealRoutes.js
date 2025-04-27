import express from "express";
import { addMeal, getMealsForWeek, deleteMeal } from "../controllers/mealController.js";

const router = express.Router();

router.post("/add", addMeal);
router.get("/users/:user_id/meals/view", getMealsForWeek);
router.post("/delete", deleteMeal); 

export default router;
