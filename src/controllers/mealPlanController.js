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
export const deleteMealPlan = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { mealId } = req.body;

        if (!mealId) {
            return res.status(400).json({ message: "Meal ID is required." });
        }

        await deleteMeal({ userId, mealId });

        res.status(200).json({ message: "Meal deleted successfully." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
