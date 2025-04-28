import axios from "axios";
import { ENV } from "../utils/envLoader.js";
import { searchRecipesParamBuilder } from "../utils/searchRecipesParamBuilder.js";
import { SPOONACULAR } from "../constants/apiEndpoints.js";
import { RecipeSearchCache } from "../models/RecipeSearchCache.js";
import { logger } from "../utils/logger.js";

export const getFilteredRecipes = async (category, tags, page = 1) => {
    logger.info(`Filtering Recipes: ${category} | ${tags} | ${page} `);

    const cacheKey = buildCacheKey(category, tags, page);

    // Check cache first
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

    // Not cached; Fetch from Spoonacular
    // const number = 10; // items per page
    // const offset = (page - 1) * number;

    const params = searchRecipesParamBuilder(category, tags);
    logger.info(`Params: ${params}`);
    params.append("apiKey", ENV.SPOONACULAR_KEY);
    const response = await axios.get(`${SPOONACULAR.COMPLEX_SEARCH}?${params.toString()}`);

    // Save new page to Mongo
    await RecipeSearchCache.create({
        cacheKey,
        recipes: response.data.results,
        totalResults: response.data.totalResults,
        number: response.data.number,
        offset: response.data.offset,
    });

    logger.info(`Fetched and cached: ${cacheKey}`);

    return {
        recipes: response.data.results,
        totalResults: response.data.totalResults,
        number: response.data.number,
        offset: response.data.offset,
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
