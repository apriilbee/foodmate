import MealPlan from "../models/MealPlan.js";
import { MEAL_TYPES } from "../constants/recipeFilters.js";
import { Recipe } from "../models/Recipe.js";

// POST /api/mealPlans
export const createMealPlan = async (req, res) => {
    try {
        const { userId, recipeId, date, mealType } = req.body;

        if (!userId || !recipeId || !date || !mealType) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        if (!MEAL_TYPES.includes(mealType)) {
            return res.status(400).json({ message: "Invalid meal type." });
        }

        const inputDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (inputDate < today) {
            return res.status(400).json({ message: "Cannot modify past meals." });
        }

        let mealPlan = await MealPlan.findOne({ userId });

        if (!mealPlan) {
            mealPlan = new MealPlan({ userId, meals: [] });
        }

        const existingMealIndex = mealPlan.meals.findIndex(
            (meal) => meal.mealType === mealType && new Date(meal.date).toDateString() === inputDate.toDateString()
        );

        if (existingMealIndex !== -1) {
            mealPlan.meals[existingMealIndex].recipeId = recipeId;
        } else {
            mealPlan.meals.push({ recipeId, mealType, date: inputDate });
        }

        await mealPlan.save();
        res.status(200).json({ message: "Meal saved successfully.", mealPlan });
    } catch (err) {
        console.error("Error creating meal plan:", err);
        res.status(500).json({ message: "Server error." });
    }
};

// GET /api/mealPlans/week
export const getWeeklyMealPlan = async (req, res) => {
    try {
        const { userId, start } = req.query;

        if (!userId || !start) {
            return res.status(400).json({ message: "Missing userId or start date." });
        }

        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);

        const weekDays = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            d.setHours(0, 0, 0, 0);
            return d;
        });

        const mealPlan = await MealPlan.findOne({ userId });

        const weekMeals = [];

        for (const date of weekDays) {
            for (const mealType of MEAL_TYPES) {
                const meal =
                    mealPlan?.meals.find(
                        (m) => m.mealType === mealType && new Date(m.date).toDateString() === date.toDateString()
                    ) || null;

                let recipeId = meal?.recipeId ?? null;
                let recipeName = null;
                let localRecipe = null;

                if (recipeId) {
                    localRecipe = await Recipe.findOne({ id: Number(recipeId) }).lean(); // Spoonacular ID

                    if (localRecipe?.title) {
                        recipeName = localRecipe.title;
                    } else {
                        // If not in DB, try Spoonacular
                        try {
                            const response = await axios.get(SPOONACULAR.RECIPE_INFORMATION(recipeId), {
                                params: {
                                    apiKey: ENV.SPOONACULAR_KEY,
                                },
                            });

                            recipeName = response.data?.title ?? "Unknown Recipe";
                        } catch (apiErr) {
                            console.warn(`Spoonacular fetch failed for ID ${recipeId}`);
                        }
                    }
                }

                weekMeals.push({
                    date,
                    mealType,
                    recipeId,
                    recipeName,
                });
            }
        }

        res.status(200).json({ weekMeals });
    } catch (err) {
        console.error("Error getting weekly meal plan:", err);
        res.status(500).json({ message: "Server error." });
    }
};
