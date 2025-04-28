import { TAG_MAPPINGS, MEAL_TYPES } from "../constants/recipeFilters.js";

export const searchRecipesParamBuilder = (category, tags) => {
    const params = new URLSearchParams();

    if (category) {
        if (MEAL_TYPES.includes(category)) {
            params.append("type", category.toLowerCase());
        } else {
            params.append("cuisine", category.toLowerCase());
        }
    }

    const intolerances = (tags ? tags.split(",") : []).reduce((acc, tag) => {
        const mapping = TAG_MAPPINGS[tag.trim()];
        if (mapping) {
            if (mapping.param === "intolerances") {
                acc.push(mapping.value);
            } else {
                params.append(mapping.param, mapping.value);
            }
        }
        return acc;
    }, []);

    if (intolerances.length > 0) {
        params.append("intolerances", intolerances.join(","));
    }

    // TODO: Add allergies after user settings is implemented

    return params;
};
