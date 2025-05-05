import MealPlan from "../models/MealPlan.js";
import { GroceryList } from "../models/GroceryList.js";
import { getRecipeDetails } from "../services/recipeService.js";

export const generateGroceryList = async (userId, start, end) => {
    
    if (!start || !end) throw new Error ('Start and end dates are required');
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) throw new Error ('End date cannot be earlier than start date');
    
    const mealPlans = await MealPlan.find( {userId : userId} )

    const filteredMealPlans = mealPlans.flatMap(plan => 
        plan.meals.filter(meal => {
            const mealDate = new Date(meal.date);
            return !isNaN(mealDate) && mealDate >= startDate && mealDate <= endDate;
        })
    )

    if (filteredMealPlans.length < 1) throw new Error ('There must be at least one meal to generate grocery list')

    const recipeIds = filteredMealPlans.map(meal => meal.recipeId);
    const recipes = await Promise.all(
      recipeIds.map(id => getRecipeDetails(id))
    );
    const ingredients = getIngredientList(recipes)
    const groupedIngredients = groupIngredientByAisle(ingredients);
    
    //edits existing grocery list if exists, creates a new one if grocery list has not been generated
    const updatedList = await GroceryList.findOneAndUpdate(
        {
            userId,
            startDate,
            endDate
        },
        {
            userId,
            startDate,
            endDate,
            aisles: groupedIngredients
        },
        {
            new: true,
            upsert : true,
            setDefaultsOnInsert: true
        }
    )
    return {recipeIds, updatedList};
}

export const getAllGroceryLists = async (userId) => {
    if (!userId) throw new Error ('Not Authorized');
    
    const groceryLists = await GroceryList.find( {userId: userId} );
    
    const groceryListIds = groceryLists.map(list => list._id);
    
    return groceryListIds; 
}

const getIngredientList = recipes => {
    const ingredientMap = {};

    recipes.forEach( recipe => {
        recipe.extendedIngredients.forEach(ingredient=>{
            const name = ingredient.name.toLowerCase();
            const aisle = ingredient.aisle.toLowerCase();
            const amount = ingredient.measures.metric.amount || 0;
            const unit = ingredient.measures.metric.unitLong.toLowerCase() || "";

            if (!ingredientMap[name]) {
                ingredientMap[name] = {
                    name,
                    aisle,
                    amount,
                    unit
                }
            } else {
                ingredientMap[name].amount += amount;
            }
        })
    })

    
    return Object.values(ingredientMap);
}

const groupIngredientByAisle = (ingredients) => {
    const grouped = {};

    ingredients.forEach(ingredient => {
        const aisle = ingredient.aisle || 'Other';
        if (!grouped[aisle]) {
            grouped[aisle] = [];
        }
        grouped[aisle].push({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            purchased: false
        })
    })

    return Object.entries(grouped).map(([aisle, items])=> ({
        aisle,
        items
    }));
};