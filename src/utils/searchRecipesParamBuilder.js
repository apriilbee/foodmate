import { TAG_MAPPINGS, MEAL_TYPES } from "../constants/recipeFilters.js";

/**
 * Builds Spoonacular API query parameters based on category, tags, and user allergies.
 * @param {string} category - Meal type or cuisine
 * @param {string} tags - Comma-separated list of dietary tags
 * @param {string} allergies - Comma-separated list of user allergies (e.g., "Peanuts,Eggs")
 */
export const searchRecipesParamBuilder = (category, tags, allergies) => {
    const params = new URLSearchParams();
    const diets = [];
    const intolerances = [];
    const excludeIngredients = [];
    const nutritionConstraints = {};
    const keywords = [];

    // Add meal type or cuisine
    if (category) {
        if (MEAL_TYPES.includes(category)) {
            params.append("type", category.toLowerCase());
        } else {
            params.append("cuisine", category.toLowerCase());
        }
    }

    // Handle diet tags from TAG_MAPPINGS
    (tags ? tags.split(",") : []).forEach((tag) => {
        const mapping = TAG_MAPPINGS[tag.trim()];
        if (mapping) {
            switch (mapping.param) {
                case "diet":
                    diets.push(mapping.value);
                    break;
                case "intolerances":
                    intolerances.push(mapping.value);
                    break;
                case "excludeIngredients":
                    excludeIngredients.push(mapping.value);
                    break;
                case "nutrition":
                    nutritionConstraints[mapping.key] = mapping.value;
                    break;
                case "keyword":
                    keywords.push(mapping.value);
                    break;
                default:
                    params.append(mapping.param, mapping.value);
                    break;
            }
        }
    });

    // Merge allergies directly into excludeIngredients instead of intolerances
    if (allergies) {
        const allergyList = allergies
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean);
        excludeIngredients.push(...allergyList);
    }

    // Append all accumulated params
    if (diets.length > 0) {
        params.append("diet", diets.join(","));
    }

    if (intolerances.length > 0) {
        params.append("intolerances", Array.from(new Set(intolerances)).join(","));
    }

    if (excludeIngredients.length > 0) {
        params.append("excludeIngredients", Array.from(new Set(excludeIngredients)).join(","));
    }

    if (Object.keys(nutritionConstraints).length > 0) {
        for (const [key, value] of Object.entries(nutritionConstraints)) {
            params.append(key, value);
        }
    }

    if (keywords.length > 0) {
        params.append("query", keywords.join(","));
    }

    return params;
};
