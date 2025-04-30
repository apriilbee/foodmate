import axios from "axios";
import { ENV } from "../utils/envLoader.js";
import { searchRecipesParamBuilder } from "../utils/searchRecipesParamBuilder.js";
import { SPOONACULAR } from "../constants/apiEndpoints.js";
import { RecipeSearchCache } from "../models/RecipeSearchCache.js";
import { logger } from "../utils/logger.js";
import { Recipe } from "../models/Recipe.js";

export const getFilteredRecipes = async (category, tags) => {
    logger.info(`Filtering Recipes: ${category || "None"} | ${tags || "None"}`);

    const isRandom = !category && !tags;
    let page = 1;
    let cacheKey = "";

    if (isRandom) {
        logger.info("No category/tags. Fetching truly random recipes...");
        const { data } = await axios.get(
            `${SPOONACULAR.RANDOM_RECIPES}?limitLicense=true&number=10&apiKey=${ENV.SPOONACULAR_KEY}`
        );

        const recipes = data.recipes;
        if (!recipes || recipes.length === 0) {
            throw new Error("No random recipes found from Spoonacular.");
        }

        logger.info("Fetched random recipes. Not cached.");
        return {
            recipes,
            totalResults: recipes.length,
            number: recipes.length,
            offset: 0,
        };
    }

    // Normal Search (Category/Tags Provided)
    page = getRandomPage(5); // Randomize 1-5
    cacheKey = buildCacheKey(category, tags, page);

    logger.info(`Searching category. Randomized page: ${page}`);

    // Check cache for this specific page
    const cached = await RecipeSearchCache.findOne({ cacheKey });
    if (cached) {
        logger.info(`Cache hit for: ${cacheKey}`);
        return formatCachedResult(cached);
    }

    // Fetch from Spoonacular
    const recipesResult = await fetchRecipesFromSpoonacular(category, tags, page);

    if (!recipesResult.recipes.length) {
        logger.warn(`No recipes on random page ${page}. Falling back to page 1...`);

        page = 1;
        cacheKey = buildCacheKey(category, tags, page);

        // Check cache for fallback page 1
        const fallbackCached = await RecipeSearchCache.findOne({ cacheKey });
        if (fallbackCached) {
            logger.info(`Fallback cache hit for: ${cacheKey}`);
            return formatCachedResult(fallbackCached);
        }

        // Fetch fallback from Spoonacular
        const fallbackResult = await fetchRecipesFromSpoonacular(category, tags, page);
        await cacheRecipeResults(cacheKey, fallbackResult);
        return fallbackResult;
    }

    // Cache fetched random page
    await cacheRecipeResults(cacheKey, recipesResult);
    return recipesResult;
};

// -------- Utilities --------

const getRandomPage = (maxPage = 5) => Math.floor(Math.random() * maxPage) + 1;

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

const fetchRecipesFromSpoonacular = async (category, tags, page) => {
    const params = searchRecipesParamBuilder(category, tags);
    params.append("apiKey", ENV.SPOONACULAR_KEY);
    params.append("offset", (page - 1) * 10);

    logger.info(`Fetching from Spoonacular with params: ${params.toString()}`);

    const { data } = await axios.get(`${SPOONACULAR.COMPLEX_SEARCH}?${params.toString()}`);

    return {
        recipes: data.results || [],
        totalResults: data.totalResults || 0,
        number: data.number || 0,
        offset: data.offset || 0,
    };
};

const cacheRecipeResults = async (cacheKey, result) => {
    await RecipeSearchCache.create({
        cacheKey,
        recipes: result.recipes,
        totalResults: result.totalResults,
        number: result.number,
        offset: result.offset,
    });
    logger.info(`Cached result for: ${cacheKey}`);
};

const formatCachedResult = (cached) => ({
    recipes: cached.recipes,
    totalResults: cached.totalResults,
    number: cached.number,
    offset: cached.offset,
});

export const getRecipeDetails = async (id) => {
    logger.info(`Obtaining Recipe Information ID #: ${id}`);

    try {
        //check cached recipes first
        let recipe = await Recipe.findOne({ id: id });

        if (recipe) {
            logger.info(`Recipe ${id} found in cache`);
            return recipe;
        }

        //get recipe from spooncaular api if not found in cache
        const response = await axios.get(SPOONACULAR.RECIPE_INFORMATION(id), {
            params: {
                apiKey: ENV.SPOONACULAR_KEY,
                includeNutrition: true,
            },
        });

        const data = response.data;

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
            analyzedInstructions: data.analyzedInstructions,
        });

        await newRecipe.save();

        return newRecipe;
    } catch (error) {
        logger.info(`Error fetching recipe: ${error.message}`);
        return { error: "Failed to fetch recipe" };
    }
};
