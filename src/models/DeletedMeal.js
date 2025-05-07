import mongoose from "mongoose";
import { MEAL_TYPES } from "../constants/recipeFilters.js";

const DeletedMealSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        recipeId: { type: String },
        mealType: { type: String, enum: MEAL_TYPES, required: true },
        date: { type: Date, required: true },
        deletedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("DeletedMeal", DeletedMealSchema);