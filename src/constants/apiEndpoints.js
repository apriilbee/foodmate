export const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";

export const SPOONACULAR = {
    COMPLEX_SEARCH: `${SPOONACULAR_BASE_URL}/recipes/complexSearch`,
    RECIPE_INFORMATION: (id) => `${SPOONACULAR_BASE_URL}/recipes/${id}/information`,
    RANDOM_RECIPE: `${SPOONACULAR_BASE_URL}/recipes/random`,
};
