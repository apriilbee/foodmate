import { createOrUpdateMeal, getWeeklyMeals } from "../services/mealPlanService.js";

export const createMealPlan = async (req, res) => {
    try {
        const { recipeId, date, mealType } = req.body;
        const userId = req.user.id;

        const mealPlan = await createOrUpdateMeal({ userId, recipeId, date, mealType });


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

export const getMealPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const start = req.query.week;

        const meals = await getWeeklyMeals({ userId, start });

        res.status(200).json({ meals });
    } catch (error) {
        console.error("Failed to fetch meal plan:", error.message);
        res.status(500).json({ message: "Error retrieving meal plan" });
    }
};