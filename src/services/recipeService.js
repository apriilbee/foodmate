import axios from "axios";
import { ENV } from "../utils/envLoader.js";
import { searchRecipesParamBuilder } from "../utils/searchRecipesParamBuilder.js";
import { SPOONACULAR } from "../constants/apiEndpoints.js";
import { RecipeSearchCache } from "../models/RecipeSearchCache.js";
import { logger } from "../utils/logger.js";

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
