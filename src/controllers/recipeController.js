import { getFilteredRecipes } from "../services/recipeService.js";

export const getRecipes = async (req, res) => {
    try {
        const { category, tags } = req.query;
        const recipes = await getFilteredRecipes(category, tags);
        res.json(recipes);
    } catch (error) {
        console.error("Failed to fetch from Spoonacular:", error.message);
        res.status(500).json({ error: "Something went wrong fetching recipes" });
    }
};
