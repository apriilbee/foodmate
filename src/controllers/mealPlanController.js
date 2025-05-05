import { createOrUpdateMeal, getWeeklyMeals } from "../services/mealPlanService.js";

export const createMealPlan = async (req, res) => {
    try {
        const mealPlan = await createOrUpdateMeal(req.body);
        res.status(200).json({ message: "Meal saved successfully.", mealPlan });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getWeeklyMealPlan = async (req, res) => {
    try {
        const weekMeals = await getWeeklyMeals(req.query);
        res.status(200).json({ weekMeals });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
