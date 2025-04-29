import { TAG_MAPPINGS, MEAL_TYPES } from "../constants/recipeFilters.js";

export const searchRecipesParamBuilder = (category, tags) => {
    const params = new URLSearchParams();
    const diets = [];
    const intolerances = [];
    const excludeIngredients = [];
    const nutritionConstraints = {};
    const keywords = [];

    if (category) {
        if (MEAL_TYPES.includes(category)) {
            params.append("type", category.toLowerCase());
        } else {
            params.append("cuisine", category.toLowerCase());
        }
    }

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

    if (diets.length > 0) {
        params.append("diet", diets.join(","));
    }

    if (intolerances.length > 0) {
        params.append("intolerances", intolerances.join(","));
    }

    if (excludeIngredients.length > 0) {
        params.append("excludeIngredients", excludeIngredients.join(","));
    }

    if (Object.keys(nutritionConstraints).length > 0) {
        for (const [fullKey, value] of Object.entries(nutritionConstraints)) {
            params.append(fullKey, value);
        }
    }

    if (keywords.length > 0) {
        params.append("query", keywords.join(","));
    }

    // TODO: Add allergies from user profile settings later if needed

    return params;
};
