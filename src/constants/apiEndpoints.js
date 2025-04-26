export const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";

export const SPOONACULAR = {
<<<<<<< Updated upstream
    COMPLEX_SEARCH: `${SPOONACULAR_BASE_URL}/recipes/complexSearch?`,
=======
    COMPLEX_SEARCH: `${SPOONACULAR_BASE_URL}/recipes/complexSearch`,
>>>>>>> Stashed changes
    RECIPE_INFORMATION: (id) => `${SPOONACULAR_BASE_URL}/recipes/${id}/information`,
    RANDOM_RECIPE: `${SPOONACULAR_BASE_URL}/recipes/random`,
};
