import { getFilteredRecipes } from "../services/recipeService.js";
import { fetchRecipesByQuery } from "../services/recipeService.js";
import { getRecipeDetails } from "../services/recipeService.js";
import { getIngredientDetails, getInstructionDetails, getDietTags } from "../utils/recipeUtils.js";
import { logger } from "../utils/logger.js";

export const getRecipes = async (req, res) => {
    logger.info("getRecipes called");
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
    logger.info("getRecipeById called");

    const recipeId = req.params.id;
    if (!recipeId) {
        return res.status(404).render("error", {
            title: "Error",
            code: 404,
            message: "Recipe ID is required.",
        });
    }

    const recipe = await getRecipeDetails(recipeId);

    if (recipe.error) {
        return res.render("error", {
            title: "Error",
            code: 500,
            message: "Something went wrong fetching recipes",
        });
    }

    const formattedIngredients = getIngredientDetails(recipe.extendedIngredients);
    let instructionDetails;
    if (recipe.analyzedInstructions.length > 0) {
        instructionDetails = getInstructionDetails(recipe.analyzedInstructions[0].steps);
    }

    const tags = getDietTags(
        recipe.extendedIngredients,
        recipe.nutrition?.nutrients || [],
        recipe.dishTypes || [],
        recipe.diets || [],
        recipe.cuisines || []
    );

    const rawRecipe = recipe.toObject();
    
    const fullRecipe = {
        ...rawRecipe,
        formattedIngredients,
        tags,
        instructionDetails
    }
    
    res.status(200).json({ recipe: fullRecipe })                                                                                                                     
};

export const searchRecipes = async (req, res) => {
    logger.info("searchRecipes called");
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Missing search query." });
    }

    try {
        const recipes = await fetchRecipesByQuery(query);

        if (!recipes || recipes.length === 0) {
            return res.status(404).json({ message: "No recipes found." });
        }

        res.status(200).json({ recipes });
    } catch (error) {
        logger.error(`Failed to search recipes: ${error.message}`);
        res.status(500).json({ message: "Failed to fetch recipes." });
    }
};
