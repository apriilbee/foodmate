import { getFilteredRecipes } from "../services/recipeService.js";
import { getRecipeDetails } from "../services/recipeService.js";
import { getIngredientDetails, getInstructionDetails } from "../utils/recipeUtils.js";
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
    const recipeId= req.params.id;
    if (!recipeId) {
        return res.status(400).json({ error: `Recipe ID is required` })
    }
    try {
        const recipe = await getRecipeDetails(recipeId);        
        if (recipe.error) return res.status(400).json({ error: recipe.error })
        
        recipe['formattedIngredients'] = getIngredientDetails(recipe.extendedIngredients);
        if (recipe.analyzedInstructions) {
            recipe['instructionDetails'] = getInstructionDetails(recipe.analyzedInstructions[0].steps)
        }
        res.render("recipe", {
            title: recipe.title,
            user: req.user,
            recipe: recipe
        });
    }
    catch (error) {
        console.error("Failed to fetch from Spoonacular:", error.message);
        res.status(500).json({ error: "Something went wrong fetching recipes" }); //need to change to custom error page
    }
}