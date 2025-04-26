import axios from "axios";
import { ENV } from "../utils/envLoader.js";
import { searchRecipesParamBuilder } from "../utils/searchRecipesParamBuilder.js";
import { SPOONACULAR } from "../constants/apiEndpoints.js";

export const getFilteredRecipes = async (category, tags) => {
    const params = searchRecipesParamBuilder(category, tags);
    params.append("apiKey", ENV.SPOONACULAR_KEY);
    const response = await axios.get(`${SPOONACULAR.COMPLEX_SEARCH}${params.toString()}`);
    return response.data;
};
