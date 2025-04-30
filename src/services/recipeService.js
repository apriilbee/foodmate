import axios from "axios";
import { ENV } from "../utils/envLoader.js";
import { searchRecipesParamBuilder } from "../utils/searchRecipesParamBuilder.js";
import { SPOONACULAR } from "../constants/apiEndpoints.js";
import { RecipeSearchCache } from "../models/RecipeSearchCache.js";
import { logger } from "../utils/logger.js";
import { Recipe } from "../models/Recipe.js";

export const getFilteredRecipes = async (category, tags, page = 1) => {
    logger.info(`Filtering Recipes: ${category} | ${tags} | ${page}`);

    let isRandom = false;
    let cacheKey = "";

    if (!category && !tags) {
        isRandom = true;
    } else {
        cacheKey = buildCacheKey(category, tags, page);

        const cached = await RecipeSearchCache.findOne({ cacheKey });
        if (cached) {
            logger.info(`Cache hit for: ${cacheKey}`);
            return {
                recipes: cached.recipes,
                totalResults: cached.totalResults,
                number: cached.number,
                offset: cached.offset,
            };
        }
    }

    let response;
    if (isRandom) {
        logger.info("Category and tags undefined. Fetching random recipes...");
        response = await axios.get(
            `${SPOONACULAR.RANDOM_RECIPES}?limitLicense=true&number=10&apiKey=${ENV.SPOONACULAR_KEY}`
        );
    } else {
        const params = searchRecipesParamBuilder(category, tags);
        params.append("apiKey", ENV.SPOONACULAR_KEY);
        logger.info(`Category: ${category}, Tags: ${tags}`);
        logger.info(`Params: ${params}`);
        response = await axios.get(`${SPOONACULAR.COMPLEX_SEARCH}?${params.toString()}`);
    }

    // Extract recipes array safely
    const recipes = isRandom ? response.data.recipes : response.data.results;

    if (!recipes || recipes.length === 0) {
        throw new Error("No recipes found in Spoonacular response.");
    }

    // Cache only if it’s NOT random
    if (!isRandom) {
        await RecipeSearchCache.create({
            cacheKey,
            recipes,
            totalResults: response.data.totalResults || recipes.length,
            number: response.data.number || recipes.length,
            offset: response.data.offset || 0,
        });
        logger.info(`Fetched and cached: ${cacheKey}`);
    } else {
        logger.info(`Fetched random recipes. Not cached.`);
    }

    return {
        recipes,
        totalResults: response.data.totalResults || recipes.length,
        number: response.data.number || recipes.length,
        offset: response.data.offset || 0,
    };
};

const buildCacheKey = (category, tags, page) => {
    const sortedTags = tags
        ? tags
              .split(",")
              .map((t) => t.trim())
              .sort()
              .join(",")
        : "";
    return `${category || "any"}|${sortedTags}|page=${page}`;
};

export const getRecipeDetails = async (id) => {
    logger.info(`Obtaining Recipe Information ID #: ${id}`);

    try {
        //check cached recipes first
        let recipe = await Recipe.findOne( {id : id})
        
        if (recipe) {
            logger.info(`Recipe ${id} found in cache`)
            return recipe;
        }
        
        //get recipe from spooncaular api if not found in cache
        const response = await axios.get(SPOONACULAR.RECIPE_INFORMATION(id), {
            params : {
                apiKey: ENV.SPOONACULAR_KEY,
                includeNutrition : true
            }
        })

        const data = response.data
        
        //save recipe to cache
        const newRecipe = new Recipe({
            id: data.id,
            image: data.image,
            imageType: data.imageType,
            title: data.title,
            readyInMinutes: data.readyInMinutes,
            servings: data.servings,
            sourceUrl: data.sourceUrl,
            sourceName: data.sourceName,
            vegetarian: data.vegetarian,
            vegan: data.vegan,
            glutenFree: data.glutenFree,
            dairyFree: data.dairyFree,
            extendedIngredients: data.extendedIngredients,
            nutrition: data.nutrition,
            summary: data.summary,
            cuisines: data.cuisines,
            dishTypes: data.dishTypes,
            diets: data.diets,
            instructions: data.instructions,
            analyzedInstructions: data.analyzedInstructions
        })

        await newRecipe.save()

        return newRecipe
    }
    catch (error) {
        logger.info(`Error fetching recipe: ${error.message}`);
        return { error: "Failed to fetch recipe" }
    }
}
