import MealPlan from "../models/MealPlan.js";
import { MEAL_TYPES } from "../constants/recipeFilters.js";
import { Recipe } from "../models/Recipe.js";
import axios from "axios";
import { SPOONACULAR } from "../constants/apiEndpoints.js";
import { ENV } from "../utils/envLoader.js";

export const createOrUpdateMeal = async ({ userId, recipeId, date, mealType }) => {
    if (!userId || !recipeId || !date || !mealType) {
        throw new Error("Missing required fields.");
    }

    if (!MEAL_TYPES.includes(mealType)) {
        throw new Error("Invalid meal type.");
    }

    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
        throw new Error("Cannot modify past meals.");
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
    return mealPlan;
};

export const getWeeklyMeals = async ({ userId, start }) => {
    if (!userId || !start) {
        throw new Error("Missing userId or start date.");
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

            if (recipeId) {
                const localRecipe = await Recipe.findOne({ id: Number(recipeId) }).lean();

                if (localRecipe?.title) {
                    recipeName = localRecipe.title;
                } else {
                    try {
                        const response = await axios.get(SPOONACULAR.RECIPE_INFORMATION(recipeId), {
                            params: { apiKey: ENV.SPOONACULAR_KEY },
                        });
                        recipeName = response.data?.title ?? "Unknown Recipe";
                    } catch (err) {
                        console.warn(`Spoonacular fetch failed for ID ${recipeId}: ${err.message}`);
                    }
                }
            }

            weekMeals.push({ date, mealType, recipeId, recipeName });
        }
    }

    return weekMeals;
};
