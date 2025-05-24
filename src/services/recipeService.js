import axios from "axios";
import { ENV } from "../utils/envLoader.js";
import { searchRecipesParamBuilder } from "../utils/searchRecipesParamBuilder.js";
import { SPOONACULAR } from "../constants/apiEndpoints.js";
import { RecipeSearchCache } from "../models/RecipeSearchCache.js";
import { Recipe } from "../models/Recipe.js";
import { logger } from "../utils/logger.js";

// ----- PUBLIC FUNCTIONS -----

export const getFilteredRecipes = async (category, tags, allergies) => {
    logger.info(`Filtering Recipes: ${category || "None"} | ${tags || "None"} | ${allergies || "None"}`);

    if (!category && !tags && !allergies) return await getRandomRecipes();

    const page = getRandomPage(5);
    const cacheKey = buildCacheKey("filter", category, tags, allergies, page);

    return await getWithCacheFallback(
        cacheKey,
        () => fetchRecipesFromSpoonacular(category, tags, allergies, page),
        () => {
            const fallbackKey = buildCacheKey("filter", category, tags, allergies, 1);
            return fetchRecipesFromSpoonacular(category, tags, allergies, 1).then((result) => {
                cacheRecipeResults(fallbackKey, result);
                return result;
            });
        }
    );
};

export const fetchRecipesByQuery = async (query) => {
    const baseKey = `query|${query.toLowerCase().trim()}`;
    const page = getRandomPage(5);
    const cacheKey = `${baseKey}|page=${page}`;

    return await getWithCacheFallback(
        cacheKey,
        () => fetchQueryFromSpoonacular(query, page),
        async () => {
            const fallbackKey = `${baseKey}|page=1`;
            return fetchQueryFromSpoonacular(query, 1).then((result) => {
                cacheRecipeResults(fallbackKey, result);
                return result;
            });
        }
    );
};

export const getRecipeDetails = async (id) => {
    logger.info(`Obtaining Recipe Information ID #: ${id}`);

    try {
        let recipe = await Recipe.findOne({ id: id });

        if (recipe) {
            logger.info(`Recipe ${id} found in cache`);
            return recipe;
        }

        const response = await axios.get(SPOONACULAR.RECIPE_INFORMATION(id), {
            params: {
                apiKey: ENV.SPOONACULAR_KEY,
                includeNutrition: true,
            },
        });

        const data = response.data;

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

// ----- PRIVATE UTILITIES -----

const getRandomRecipes = async () => {
    logger.info("Fetching truly random recipes...");
    const { data } = await axios.get(
        `${SPOONACULAR.RANDOM_RECIPES}?limitLicense=true&number=10&apiKey=${ENV.SPOONACULAR_KEY}`
    );

    const recipes = data.recipes || [];
    if (recipes.length === 0) throw new Error("No random recipes found.");

    return {
        recipes,
        totalResults: recipes.length,
        number: recipes.length,
        offset: 0,
    };
};

const fetchRecipesFromSpoonacular = async (category, tags, allergies, page) => {
    const params = searchRecipesParamBuilder(category, tags, allergies);
    params.append("apiKey", ENV.SPOONACULAR_KEY);
    params.append("offset", (page - 1) * 10);

    logger.info(`Fetching from Spoonacular with params: ${params.toString()}`);

    const { data } = await axios.get(`${SPOONACULAR.COMPLEX_SEARCH}?${params.toString()}`);
    return formatResult(data);
};

const fetchQueryFromSpoonacular = async (query, page) => {
    try {
        const response = await axios.get(SPOONACULAR.COMPLEX_SEARCH, {
            params: {
                query,
                number: 10,
                offset: (page - 1) * 10,
                limitLicense: true,
                apiKey: ENV.SPOONACULAR_KEY,
            },
        });
        return formatResult(response.data);
    } catch (error) {
        logger.error(`Query fetch failed: ${error.message}`);
        return { recipes: [], totalResults: 0, number: 0, offset: 0 };
    }
};

const getWithCacheFallback = async (cacheKey, fetchFn, fallbackFn) => {
    const cached = await RecipeSearchCache.findOne({ cacheKey });
    if (cached) {
        logger.info(`Cache hit: ${cacheKey}`);
        return formatCachedResult(cached);
    }

    const result = await fetchFn();
    if (result.recipes && result.recipes.length > 0) {
        await cacheRecipeResults(cacheKey, result);
        return result;
    }

    logger.warn(`Empty result for: ${cacheKey}. Trying fallback.`);
    return fallbackFn();
};

const buildCacheKey = (type, categoryOrQuery, tags = "", allergies = "", page = 1) => {
    if (type === "filter") {
        const sortedTags = tags
            ? tags
                  .split(",")
                  .map((t) => t.trim())
                  .sort()
                  .join(",")
            : "";
        const sortedAllergies = allergies
            ? allergies
                  .split(",")
                  .map((a) => a.trim())
                  .sort()
                  .join(",")
            : "";
        return `${categoryOrQuery || "any"}|tags=${sortedTags}|allergies=${sortedAllergies}|page=${page}`;
    }
    return `${categoryOrQuery.toLowerCase().trim()}|page=${page}`;
};

const cacheRecipeResults = async (cacheKey, result) => {
    const exists = await RecipeSearchCache.exists({ cacheKey });

    if (exists) {
        logger.info(`Cache already exists for: ${cacheKey}. Skipping insert.`);
        return;
    }

    await RecipeSearchCache.create({
        cacheKey,
        recipes: result.recipes,
        totalResults: result.totalResults,
        number: result.number,
        offset: result.offset,
    });

    logger.info(`Cached result for: ${cacheKey}`);
};

const formatResult = (data) => ({
    recipes: data.results || [],
    totalResults: data.totalResults || 0,
    number: data.number || 0,
    offset: data.offset || 0,
});

const formatCachedResult = (cached) => ({
    recipes: cached.recipes,
    totalResults: cached.totalResults,
    number: cached.number,
    offset: cached.offset,
});

const getRandomPage = (max = 5) => Math.floor(Math.random() * max) + 1;
