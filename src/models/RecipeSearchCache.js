import mongoose from "mongoose";

const RecipeSearchCacheSchema = new mongoose.Schema(
    {
        cacheKey: { type: String, required: true, unique: true },
        recipes: { type: Array, required: true },
        totalResults: { type: Number, required: true },
        number: { type: Number, required: true },
        offset: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now, expires: 3600 },
    },
    { collection: "recipe_search_cache" }
);

export const RecipeSearchCache = mongoose.model("RecipeSearchCache", RecipeSearchCacheSchema);
