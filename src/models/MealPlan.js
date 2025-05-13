import mongoose from "mongoose";
import { MEAL_TYPES } from "../constants/recipeFilters.js";

const MealEntrySchema = new mongoose.Schema({
    recipeId: {
        type: String,
        default: null,
    },
    mealType: {
        type: String,
        enum: MEAL_TYPES,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    }
});

const MealPlanSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        meals: [MealEntrySchema],
    },
    { timestamps: true }
);

export default mongoose.model("MealPlan", MealPlanSchema);
