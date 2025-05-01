import { getFilteredRecipes } from "../services/recipeService.js";
import { getRecipeDetails } from "../services/recipeService.js";
import { getIngredientDetails, getInstructionDetails, getDietTags } from "../utils/recipeUtils.js";


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

export const getRecipeById = async (req, res) => {
    const recipeId = req.params.id;
    if (!recipeId) {
        return res.status(404).json({ error: `Recipe ID is required` })
    }
    const recipe = await getRecipeDetails(recipeId);        
    if (recipe.error) return res.render("error", {
        title: "Error",
        code: 500,
        message: "Something went wrong fetching recipes"
    });
    
    recipe['formattedIngredients'] = getIngredientDetails(recipe.extendedIngredients);
    if (recipe.analyzedInstructions.length > 0) {
        recipe['instructionDetails'] = getInstructionDetails(recipe.analyzedInstructions[0].steps)
    }
    recipe['tags'] = getDietTags(recipe.extendedIngredients, recipe.nutrition.nutrients, recipe.dishTypes, recipe.diets)
    res.render("recipe", {
        title: recipe.title,
        user: req.user,
        recipe: recipe
    });
}